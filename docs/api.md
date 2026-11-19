# API contract (front end ↔ n8n)

This is what the website expects from the n8n workflows. Each endpoint is an n8n **Webhook** node with a **Respond to Webhook** node that returns JSON.

The front end reads the base address from `js/config.js` (`apiBaseUrl`), for example `https://your-n8n-host/webhook/c295`. Set `useSampleData` to `false` there to switch from sample data to the real API.

All requests and responses are JSON. Dates are ISO 8601 strings with time zone, e.g. `"2026-11-22T08:00:00+08:00"`.

## Sign-in

Signed-in requests send `Authorization: Bearer <token>`. Requests without a token are treated as a signed-out visitor.

| Method and path | Body | Returns |
|---|---|---|
| `POST /auth/email/start` | `{ "email": "..." }` | `{ "sent": true }`. Emails a 6-digit code valid for 10 minutes. |
| `POST /auth/email/verify` | `{ "email": "...", "code": "123456" }` | `{ "token": "...", "student": Student }`, or 401 if the code is wrong. |
| `POST /auth/token` | `{ "token": "<from the bot's link>" }` | `{ "token": "...", "student": Student }`, or 401 if the link expired. |

The Telegram bot's `/web` command replies with a link to `https://<site>/index.html?token=<one-time token>`. The website exchanges it through `POST /auth/token`.

`Student`:

```json
{ "id": "s123", "name": "Alex Lim", "email": "alex@myrp.edu.sg" }
```

## Activities

| Method and path | Returns |
|---|---|
| `GET /activities` | `{ "activities": [Activity, ...] }`: upcoming activities, any order. Past ones can be left out. |
| `GET /activities/:id` | `{ "activity": Activity }`, or 404. |
| `POST /activities/:id/join` | `{ "activity": Activity }` with `joined: true`. 401 if not signed in. 409 with a `message` if full or sign-up has closed. |
| `POST /activities/:id/leave` | `{ "activity": Activity }` with `joined: false`. |

`Activity`:

```json
{
  "id": "a07",
  "area": "OA",
  "title": "Kayaking through the mangroves",
  "organiser": "Paddle North",
  "location": "Pasir Ris Park",
  "startsAt": "2026-11-23T09:00:00+08:00",
  "endsAt": "2026-11-23T13:00:00+08:00",
  "spotsTotal": 12,
  "spotsTaken": 10,
  "signupClosesAt": "2026-11-22T23:59:00+08:00",
  "description": "A beginner-friendly paddle ...",
  "photoUrl": null,
  "contact": { "type": "email", "value": "hello@example.org" },
  "joined": false,
  "friendsGoing": ["Daniel", "Wei Ling"]
}
```

- `area` is one of `SL` (Service Learning), `OA` (Outdoor Appreciation), `HL` (Healthy Living), `CL` (Community Leadership).
- `spotsTaken` counts everyone who joined, including the signed-in student.
- `joined` and `friendsGoing` are for the signed-in student only. For signed-out visitors, send `joined: false` and `friendsGoing: []`.
- **Privacy (PDPA):** `friendsGoing` lists first names only, and only of students who turned on buddy matching.
- `photoUrl` is optional: a link to a landscape photo of the activity (the organiser's own, used with permission), or `null`. Posters show it as a band printed in the area colour; the activity page shows it in natural colour.
- `photoCredit` is optional: `{ "by": "...", "licence": "...", "page": "https://..." }`, shown under the photo on the activity page. Required when the photo is openly licensed (for example CC BY).
- `contact.type` is `email`, `whatsapp`, `telegram` or `website`. For `website`, `contact.value` is the organiser's sign-up page URL.

## Journal (signed in only)

| Method and path | Body | Returns |
|---|---|---|
| `GET /me/journal` | | `{ "entries": [Entry, ...] }` for the signed-in student, any order. |
| `GET /me/journal/:id` | | `{ "entry": Entry }`, or 404. |
| `POST /me/journal` | Entry without `id` | `{ "entry": Entry }` with its new `id`. |
| `PUT /me/journal/:id` | Entry | `{ "entry": Entry }`. 404 if it isn't this student's. |
| `DELETE /me/journal/:id` | | `204` or `{}`. Deletes its photos too. |
| `GET /me/to-log` | | `{ "activities": [PastActivity, ...] }`: activities the student joined that have ended and have no entry yet. |
| `GET /me/history/:id` | | `{ "activity": PastActivity }` for prefilling the form, or 404. |
| `POST /me/photos` | `{ "image": "data:image/jpeg;base64,..." }` | `{ "url": "https://..." }`. The website shrinks photos to at most 1280px and JPEG quality 0.78 before sending (usually 100-300 KB). Store them in cloud storage and return a link. |

`Entry`:

```json
{
  "id": "e01",
  "activityId": "p01",
  "area": "OA",
  "title": "Mangrove boardwalk walk",
  "date": "2026-11-07",
  "start": "08:30",
  "end": "11:00",
  "did": "Walked the boardwalk with a guide ...",
  "learned": "Mangrove roots trap a lot of rubbish ...",
  "photos": [{ "url": "https://..." }],
  "source": "web"
}
```

- `activityId` is `null` for "Log something else" entries; then `area` and `title` come from the student.
- `date` is `YYYY-MM-DD`, and `start` and `end` are `HH:MM` (24-hour, Singapore time). Hours are worked out from them; don't store hours separately, or keep them in sync.
- `source` is `web` or `telegram`. Entries logged through the bot may be missing parts: the website marks them "Incomplete" and doesn't count their hours until all four parts are there (at least one photo, start and end time, `did`, `learned`).
- The website requires all four parts before saving, so `POST` and `PUT` can reject an incomplete entry with 400 and a `message`.

`PastActivity` has the same fields as `Activity` (at least `id`, `area`, `title`, `organiser`, `location`, `startsAt`, `endsAt`).

## Errors

Any error responds with a 4xx or 5xx status and `{ "message": "A sentence the student can read." }`. The website shows that message as it is, so write it for students.

## Testing the states without a back end

With `useSampleData: true`, add these to any page address:

- `?simulate=slow`: a 6-second wait, which shows the "waking up the server" note
- `?simulate=error`: the error screen
- `?simulate=empty`: no activities

Sample sign-in: any email, code `123456`.
