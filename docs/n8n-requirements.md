# n8n back end: requirements

Everything the back end needs to do, for the teammate building it in n8n. The website's exact request and response formats are in [`api.md`](api.md); this document covers the rest: database, Telegram bot, scheduled jobs, sign-in and rules.

**Priority labels:**
- **Must:** needed for the demo.
- **Should:** wanted; build after the Musts.
- **Later:** only if time allows.

## 1. Overview

```
Telegram bot  ─┐
               ├─►  n8n workflows  ─►  Azure SQL Database
Website (JS) ──┘    (webhooks, schedules)
```

- n8n is the only thing that reads or writes the database.
- The website calls n8n **Webhook** nodes and gets JSON back through **Respond to Webhook** nodes.
- The bot uses the **Telegram Trigger** and **Telegram** nodes.
- Use one n8n **credential** each for Azure SQL, the Telegram bot token and the email account. Never put secrets inside nodes.
- **n8n must be reachable on a public HTTPS address** (n8n Cloud, or self-hosted on Azure). Telegram and the website both need it. Test this first.

## 2. Database (Azure SQL)

Create these tables before building workflows. All times are stored in UTC (`datetime2`); the website and bot show Singapore time.

```sql
CREATE TABLE students (
  id               INT IDENTITY PRIMARY KEY,
  telegram_id      BIGINT NULL UNIQUE,          -- from Telegram; NULL if signed up by email only
  telegram_username NVARCHAR(64) NULL,
  name             NVARCHAR(120) NOT NULL,
  email            NVARCHAR(200) NULL UNIQUE,
  course           NVARCHAR(120) NULL,
  interests        NVARCHAR(40) NULL,          -- area codes, e.g. 'SL,OA'
  buddy_matching   BIT NOT NULL DEFAULT 0,     -- PDPA consent to be shown to others
  award_tracker    BIT NOT NULL DEFAULT 0,
  created_at       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE activities (
  id               INT IDENTITY PRIMARY KEY,
  source_id        NVARCHAR(64) NOT NULL UNIQUE,  -- ID from the school portal; prevents duplicate imports
  area             CHAR(2) NOT NULL CHECK (area IN ('SL','OA','HL','CL')),
  title            NVARCHAR(200) NOT NULL,
  organiser        NVARCHAR(200) NOT NULL,
  location         NVARCHAR(200) NOT NULL,
  starts_at        DATETIME2 NOT NULL,
  ends_at          DATETIME2 NOT NULL,
  spots_total      INT NOT NULL CHECK (spots_total > 0),
  signup_closes_at DATETIME2 NOT NULL,
  description      NVARCHAR(MAX) NULL,
  photo_url        NVARCHAR(500) NULL,
  contact_type     NVARCHAR(16) NOT NULL CHECK (contact_type IN ('email','whatsapp','telegram')),
  contact_value    NVARCHAR(200) NOT NULL,
  is_sample        BIT NOT NULL DEFAULT 0,
  created_at       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE signups (
  id           INT IDENTITY PRIMARY KEY,
  student_id   INT NOT NULL REFERENCES students(id),
  activity_id  INT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  joined_at    DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  attended     BIT NULL,
  CONSTRAINT uq_signup UNIQUE (student_id, activity_id)
);
-- Leaving deletes the row. spotsTaken = COUNT(*) of signups for the activity.

CREATE TABLE buddy_requests (
  id           INT IDENTITY PRIMARY KEY,
  from_id      INT NOT NULL REFERENCES students(id),
  to_id        INT NOT NULL REFERENCES students(id),
  activity_id  INT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  status       NVARCHAR(10) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
  created_at   DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT uq_buddy UNIQUE (from_id, to_id, activity_id)
);

CREATE TABLE journal_entries (
  id           INT IDENTITY PRIMARY KEY,
  student_id   INT NOT NULL REFERENCES students(id),
  activity_id  INT NULL REFERENCES activities(id),
  area         CHAR(2) NOT NULL CHECK (area IN ('SL','OA','HL','CL')),
  entry_date   DATE NOT NULL,
  start_time   TIME NULL,
  end_time     TIME NULL,
  hours        DECIMAL(4,1) NULL,             -- worked out from start/end, or typed in
  text         NVARCHAR(MAX) NOT NULL,
  source       NVARCHAR(10) NOT NULL DEFAULT 'web' CHECK (source IN ('web','telegram')),
  created_at   DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE photos (
  id               INT IDENTITY PRIMARY KEY,
  entry_id         INT NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  telegram_file_id NVARCHAR(200) NULL,       -- photo sent to the bot
  storage_url      NVARCHAR(500) NULL,       -- photo uploaded on the website
  caption          NVARCHAR(300) NULL
);

CREATE TABLE reflections (
  id            INT IDENTITY PRIMARY KEY,
  student_id    INT NOT NULL REFERENCES students(id),
  title         NVARCHAR(200) NOT NULL,
  body          NVARCHAR(MAX) NOT NULL,
  linkedin_text NVARCHAR(MAX) NULL,
  updated_at    DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- Sign-in
CREATE TABLE login_codes (                    -- email one-time codes
  email       NVARCHAR(200) NOT NULL,
  code_hash   NVARCHAR(100) NOT NULL,
  expires_at  DATETIME2 NOT NULL,
  attempts    INT NOT NULL DEFAULT 0
);
CREATE TABLE link_tokens (                    -- one-time links sent by the bot
  token_hash  NVARCHAR(100) PRIMARY KEY,
  student_id  INT NOT NULL REFERENCES students(id),
  expires_at  DATETIME2 NOT NULL,
  used        BIT NOT NULL DEFAULT 0
);
CREATE TABLE sessions (                       -- website sessions (the Bearer token)
  token_hash  NVARCHAR(100) PRIMARY KEY,
  student_id  INT NOT NULL REFERENCES students(id),
  expires_at  DATETIME2 NOT NULL
);
```

**Later (award tracker add-on):** `area_goals` (student, area, goal, verifier name and email, approver, start and end dates, target hours, target months) and `leadership_projects` (student, where, when, purpose, preparation).

## 3. Website endpoints

The request and response shapes are in [`api.md`](api.md). The rules behind them:

| Endpoint | Priority | Rules |
|---|---|---|
| `GET /activities` | Must | Activities whose `ends_at` is in the future. `spotsTaken` = number of signups. If signed in: `joined` and `friendsGoing`. |
| `GET /activities/:id` | Must | Same fields. 404 if it doesn't exist. |
| `POST /activities/:id/join` | Must | Signed in only (401). 409 "Sign-up for this activity has closed." after `signup_closes_at`. 409 "Sorry, this activity just filled up." when full. Joining twice is not an error: return the activity. Do the count check and insert in **one SQL statement or transaction**, so two students can't take the last spot together. |
| `POST /activities/:id/leave` | Must | Deletes the signup. Leaving when not joined is not an error. |
| `POST /auth/email/start` | Must | See section 5. Always answer `{ "sent": true }`, even for unknown emails, so nobody can test which emails exist. |
| `POST /auth/email/verify` | Must | See section 5. |
| `POST /auth/token` | Must | See section 5. |

**`friendsGoing` (PDPA):**
- first names of other students signed up who have `buddy_matching = 1`;
- never for signed-out visitors;
- never including the student asking.

**Signed-in requests** carry `Authorization: Bearer <token>`. Look up the hashed token in `sessions`. If it's missing or expired, treat the request as signed out, or return 401 for join and leave.

**CORS:** the website is on a different address from n8n, so every webhook must allow the website's origin. Either set **Allowed Origins (CORS)** in each Webhook node's options, or add an `Access-Control-Allow-Origin` header in Respond to Webhook. Make sure `OPTIONS` preflight requests succeed. Do this first, or the browser blocks every call.

**Errors:** respond with the right status and `{ "message": "..." }`. The website shows the message to students as it is, so write it for them.

**Planned for later pages.** Shapes will be agreed when those pages are designed:

| Endpoint | Priority | Purpose |
|---|---|---|
| `GET /me/summary` | Should | Hours and number of activities per area for the signed-in student. |
| `GET /me/journal`, `POST /me/journal`, `PUT/DELETE /me/journal/:id` | Should | Journal entries, with hours worked out from start and end time. |
| `POST /me/journal/:id/photos` | Should | Photo upload from the website to cloud storage. |
| `GET/PUT /me/settings` | Should | Name, course, interests, buddy matching, award tracker on or off. |
| `POST /admin/activities`, `POST /admin/import` | Should | Add one activity, or import a CSV. Re-importing updates rows with the same `source_id` instead of duplicating them. |
| Award tracker endpoints | Later | Goals, targets and log book data. |

## 4. Telegram bot

Use inline keyboard buttons where possible, so students tap instead of type.

| Command or action | Priority | What it does |
|---|---|---|
| `/start` | Must | New student: ask name, course and areas of interest (buttons), then buddy matching consent (Yes or No, with one line explaining what's shared). Existing student: show the menu. |
| `/browse` | Must | Area buttons, then the next 5 activities in that area: title, date and time, place, spots left. Each has **Join** and **More** buttons. |
| Join button | Must | Same rules as the website's join. Reply "You're going to …" or the reason it failed. |
| `/going` | Must | The student's upcoming joined activities, each with a **Leave** button. |
| `/web` | Must | Creates a one-time link token (section 5) and replies with `https://<website>/index.html?token=<token>`. |
| `/log` | Should | Asks area (or which joined activity), date, start and end time, what happened. Accepts photos. Saves a journal entry with `source = 'telegram'`. |
| Photo sent to the bot | Should | Asks which entry or activity it belongs to; saves `telegram_file_id`. |
| `/summary` | Should | Hours and activities per area. |
| Buddy requests | Should | When someone sends one: a message with **Accept** and **Decline**. After both accept, each gets the other's Telegram username. |
| `/settings` | Should | Change areas of interest, buddy matching on or off. |

## 5. Sign-in

**Email code:**
1. `POST /auth/email/start`:
   - make a random 6-digit code;
   - store its hash in `login_codes` with a 10-minute expiry;
   - email it with n8n's Send Email or Gmail node.
2. `POST /auth/email/verify`:
   - check the hash and expiry;
   - allow at most 5 attempts, then the code is dead;
   - on success, delete the code and find or create the student by email;
   - create a session.

**Telegram link:**
1. `/web` creates a random token. Store its hash in `link_tokens`, valid for 15 minutes, usable once.
2. `POST /auth/token` checks it, marks it used and creates a session.

**Session:**
- a random token of at least 32 bytes, stored hashed in `sessions`, valid for 30 days;
- return `{ "token": "<plain token>", "student": { "id", "name", "email" } }`.

A student who signs in by email and also uses the bot ends up as one student row: match on email, or link them through `/web`.

## 6. Scheduled workflows

| Workflow | Schedule | Priority | What it does |
|---|---|---|---|
| Reminder | Daily, 18:00 Singapore time | Should | Messages every student with a signup for an activity starting tomorrow: title, time, place. |
| Log prompt | Daily, 20:00 | Should | Messages students whose activity ended today: "How did it go? Send /log to record it." |
| Clean-up | Daily, 03:00 | Should | Deletes expired `login_codes`, `link_tokens` and `sessions`. |

## 7. Privacy and safety (PDPA)

- Other students only ever see a student's first name, and only if `buddy_matching = 1`.
- Telegram usernames are shared only after both students accept a buddy request.
- Codes, link tokens and session tokens are stored **hashed**, never in plain text.
- No passwords are stored. Sign-in is by code or link only.
- Only send what the website or bot needs; never return other students' emails or Telegram IDs.
- Sample and test activities have `is_sample = 1` and are labelled as sample on the website.

## 8. Testing checklist

- [ ] The website loads activities from n8n, with no CORS errors in the browser console.
- [ ] Join, leave, join again: the count goes up, down, up.
- [ ] Join a full activity: error message shown. Join after the deadline: error message shown.
- [ ] Two students joining the last spot at the same time: only one gets it.
- [ ] Email sign-in: correct code works; wrong code 5 times locks it; an expired code fails.
- [ ] `/web` link signs in once; opening the same link again fails.
- [ ] Signed out: `friendsGoing` is empty. Signed in: only opted-in friends are named.
- [ ] Bot `/browse` → Join shows up on the website as joined, and the other way round.
- [ ] Reminder arrives the evening before (test by temporarily changing the schedule).

## 9. Build order

1. Database tables, n8n reachable over HTTPS, CORS working.
2. `GET /activities` and `GET /activities/:id` (the website then works signed out).
3. Sign-in: `/web` plus `POST /auth/token`, then email codes.
4. Join and leave, from both the website and the bot.
5. `/start`, `/browse`, `/going` in the bot.
6. Reminders, `/log`, `/summary`, buddy requests.
7. Admin import, journal and summary endpoints for the next website pages.
