# Student activities companion (working title)

C295 project by Zhen Kang, Jun Hao and Xingmeng, Republic Polytechnic.

**Status: planning.** This document is the plan. Development has not started.

## 1. Problem

RP students find it hard to discover activities outside class that suit them, to find like-minded peers to join with, and to keep a record of what they did. Sign-up is scattered across different channels, and the reflection students are asked to write afterwards is usually reconstructed from memory.

## 2. Scope: four areas

| Area | What it covers | Example activities |
|---|---|---|
| **Service Learning** | Giving time to help others and learning from it | Befriending seniors, food packing, community farming, school events |
| **Outdoor Appreciation** | Activities in the outdoors with a learning goal | Camps, hikes, expeditions, intertidal walks |
| **Healthy Living** | Regular sport and recreation for physical and mental wellness | Swimming, badminton, walks, hobby workshops |
| **Community Leadership** | Leading or organising something that benefits a community | Running an event for residents, leading an orientation group |

Every activity belongs to one area.

## 3. Who it is for

- **Students (main users):** find activities, join with a buddy, contact the organiser, log what they did, and write a reflection.
- **Admin (project team or staff):** add activities and import them from the school's portal.

## 4. Features

### 4.1 Core (every student)

| # | Feature | Notes |
|---|---|---|
| 1 | **Browse activities by area** | Filter by area and date. |
| 2 | **Join in the app** | One tap to join. The app counts spots, closes sign-up at the deadline or when full, and lets the student leave again. Anyone can browse without signing in; joining needs sign-in. |
| 3 | **Contact the organiser** | A message is drafted for the student, with a link that opens email, WhatsApp or Telegram with it filled in. The student presses send. Nothing is sent automatically. |
| 4 | **Find a buddy** | Shows other students interested in the same activity. Only students who opted in are visible, and Telegram usernames are shared only after both accept. |
| 5 | **Activity journal with photos** | An entry has a date, text and photos, plus an optional start and end time so hours add up on their own. |
| 6 | **Summary** | Hours and number of activities per area. No targets or deadlines. |
| 7 | **Reminders** | A message the day before an activity the student saved, and a prompt afterwards to log it. |
| 8 | **Compile** | Turns journal entries into a reflection and a LinkedIn post the student can copy. Uses templates, with an optional "polish with AI" step. |
| 9 | **Admin** | Add activities through a form, or import a CSV. |

### 4.2 Optional add-on: award tracker (expansion)

Off by default. A student who is working toward a youth achievement award turns it on. It adds:

- **Hour targets per area** and progress against them. Targets are settings, not fixed in the workflows. Example set: 60 hours of Service Learning over 12 months, 36 hours of Outdoor Appreciation, 48 hours of Healthy Living over 18 months.
- **A goal for each area:** the goal itself, who can verify it, who approves it, start and end dates.
- **A project write-up for Community Leadership:** where, when, purpose, preparation, photos.
- **Log book export:** one document with, for each area, the goal, the dated activity log (date, time, hours, details and learning, photos), totals and a reflection, then a final reflection.

The tool is a personal tracker. It is not affiliated with any award body, and it does not replace an award's own registration or submission system. The core features do not mention any award.

### 4.3 Out of scope

- Sending messages on a student's behalf.
- Posting to LinkedIn for the student.
- Submitting anything to an award body or the school.
- Verifying that a student really attended an activity.

## 5. How it works: n8n

The project is built as **n8n workflows**. n8n is a visual workflow tool: each workflow starts from a trigger (a Telegram message, a form submission, a web request or a schedule) and passes data through a chain of nodes.

### 5.1 Interfaces

| Interface | n8n building block | Used for |
|---|---|---|
| **Telegram bot** (main) | Telegram Trigger and Telegram nodes | Sign-up, browse by area, buddy requests, reminders, logging an entry with photos. |
| **Web forms** | n8n Form Trigger | Longer input: journal entries, area goals, the leadership project write-up, admin adding activities. |
| **Web pages** | Webhook node with Respond to Webhook (HTML) | Read-only pages: activity list, summary, compiled reflection and log book. |

### 5.2 Planned workflows

| Workflow | Trigger | What it does |
|---|---|---|
| Bot router | Telegram message | Reads the command or button the student pressed and calls the right sub-workflow. |
| Sign-up | `/start` | Saves name, course, areas of interest and buddy-matching consent. |
| Browse | `/browse` or area button | Lists upcoming activities in that area with buttons to save, contact or find a buddy. |
| Contact organiser | Button | Drafts the message and replies with a link that opens the organiser's preferred app. |
| Buddy matching | Button | Finds consenting students on the same activity, sends a request, and shares usernames after both accept. |
| Log entry | `/log` or a photo sent to the bot | Asks for area, date, time and what happened; saves the entry and the photo. |
| Summary | `/summary` or web page | Totals hours and activities per area. |
| Reminders | Schedule (daily) | Messages students about tomorrow's activities and asks them to log yesterday's. |
| Compile | Web page | Builds the reflection and LinkedIn post from the student's entries using templates. |
| Award tracker | Form and web page | Saves goals and targets; shows progress; builds the log book. Only if the student turned it on. |
| Admin | Form and CSV upload | Adds or imports activities; skips duplicates by source ID. |

Shared logic, such as working out hours from a time range or filling in a message template, lives in Code nodes or in small sub-workflows that other workflows call.

## 6. Technology

| Part | Choice | Why |
|---|---|---|
| Workflows | n8n | Visual, quick to build and change, with ready-made nodes for Telegram, forms, databases and schedules. |
| Database | Azure SQL Database, through n8n's Microsoft SQL node | We already have Azure. |
| Photos | Telegram keeps photos sent to the bot (we store the file ID). Photos uploaded through a web form go to cloud storage. | Avoids storing large files in the database. |
| AI | Templates by default. Optional free-tier model through an n8n AI or HTTP Request node. | The school gives no AI credits, so nothing may depend on AI. |
| Hosting | To decide: n8n Cloud, or n8n self-hosted on Azure. | The Telegram trigger needs n8n to be reachable on a public HTTPS address. |

## 7. Data

### 7.1 Where activities come from

1. **Now:** copy listings from the school's activity portal (a Microsoft Power Apps app) into a CSV and import it through the admin workflow.
2. **Later, if IT allows:** a regular export or read-only access to the portal's data. An access request to the IT team has been drafted.

The workflows only read our own database, so the import method can change without changing anything else.

### 7.2 Tables

| Table | Main fields |
|---|---|
| Students | Telegram ID and username, name, course, areas of interest, buddy-matching consent, award tracker on or off |
| Activities | Source ID, title, organiser, area, date, start and end time, location, total spots, sign-up deadline, contact type and contact detail, description, photo (optional) |
| Sign-ups | Student, activity, date joined, left (if they left), attended |
| Buddy requests | From, to, activity, status (pending, accepted, declined) |
| Journal entries | Student, activity (optional), area, date, start and end time, hours, text |
| Photos | Journal entry, Telegram file ID or storage link, caption |
| Reflections | Student, title, reflection text, LinkedIn post text |
| Area goals (add-on) | Student, area, goal, verifier, approver, start and end dates, target hours and months |
| Leadership project (add-on) | Student, where, when, purpose, preparation |

## 8. Privacy (PDPA)

- Students are visible to other students only if they turn on buddy matching.
- Telegram usernames are shared only after both students accept.
- Verifier and approver names and emails are entered by the student and shown only to that student.
- As little personal data as possible is sent to any AI service; the student's name is removed first.
- Database and API credentials are kept in n8n's credential store, never inside workflow nodes.
- All demo data is made up and labelled "Sample".

## 9. Plan

Week numbers are placeholders until we confirm the submission date.

| Phase | Work | Weeks |
|---|---|---|
| 1. Set up | Agree this plan with our mentor. Set up n8n, the Telegram bot and the Azure SQL tables. Collect sample activities for all four areas. | 1 |
| 2. Core bot | Sign-up, browse by area, contact organiser, log entry with photos. | 2–3 |
| 3. Social and summary | Buddy matching, summary, reminders. | 4 |
| 4. Web and compile | Forms and pages, compile reflection and LinkedIn post, admin import. | 5 |
| 5. Award tracker | Goals, targets and progress, leadership project, log book. | 6 |
| 6. Test | Try it with 5–10 classmates. Fix what they struggle with. | 7 |
| 7. Hand in | Report, demo video, backup plan for the live demo. | 8 |

If time runs short, phase 5 is described in the report as a future expansion and not built.

### Proposed split of work

| Person | Area |
|---|---|
| Zhen Kang | Activity data and admin: the four areas, import from the portal, browse. |
| Jun Hao | Students and matching: sign-up, buddy requests, privacy rules, reminders. |
| Xingmeng | Journal, hours and summary, compile, award tracker. |

## 10. Risks

| Risk | What we do about it |
|---|---|
| IT does not give access to the portal's data | Keep the CSV import; it is enough for the project. |
| n8n is not reachable when the bot needs it | Host it on an always-on service before the demo, and test the Telegram connection early. |
| Workflows become hard to follow as they grow | One workflow per job, shared sub-workflows, and clear node names. |
| Award requirements differ by level or change | Targets are settings, and the add-on is optional. |
| The tool looks like an official award tool | No award names or logos; it says it is a personal tracker. |
| Free AI tier hits its limit or changes terms | Templates always work without AI. |
| Too much to build in the time | Core first; the award tracker can be left as a future expansion. |

## 11. Open decisions

1. **Name.**
2. **Hosting:** n8n Cloud or self-hosted on Azure.
3. **Award tracker in this round or later?**
4. **Which award levels the tracker supports.** Our reference log sheet is for one level only.
5. **Web sign-in:** how a student opens their own pages safely, for example a personal link sent by the bot.
6. **Reply from IT** on portal access.

## 12. Front end: how to run

The website is plain HTML, CSS and JavaScript with no build step.

1. From the repo folder, start any static server, for example `python -m http.server 8000`.
2. Open http://localhost:8000.

It uses sample data until the n8n API is ready. Sample sign-in: any email, code `123456`. The endpoints the front end expects are in [`docs/api.md`](docs/api.md). Switch to the real API in `js/config.js`.
