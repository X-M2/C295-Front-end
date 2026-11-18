# Telegram bot: to-do list

Build order for the bot in n8n. Tick items off as you go (edit this file on GitHub and change `[ ]` to `[x]`).

The details behind each item, including tables, sign-in and privacy rules, are in [`n8n-requirements.md`](n8n-requirements.md).

**Priority labels:**
- **Must:** needed for the demo.
- **Should:** wanted; build after the Musts.

## 1. Setup (Must)

- [ ] Create the bot with **@BotFather** (`/newbot`). Save the token as an n8n credential, never inside a node.
- [ ] Set the bot's name, description and profile picture in @BotFather.
- [ ] Register the commands in @BotFather (`/setcommands`): `start`, `browse`, `going`, `web`, `log`, `summary`, `settings`.
- [ ] Make n8n reachable on a public **https** address. The Telegram Trigger won't work otherwise.
- [ ] Create a **Telegram Trigger** workflow and test that a message reaches n8n.
- [ ] Build a **router**: one workflow that reads the command or button pressed and sends it to the right sub-workflow.
- [ ] Create the database tables (section 2 of the requirement sheet).

## 2. Sign-up: `/start` (Must)

- [ ] For a new student, ask for their name.
- [ ] Ask for their course.
- [ ] Ask for areas of interest with buttons: Service Learning, Outdoor Appreciation, Healthy Living, Community Leadership. Allow more than one, then a **Done** button.
- [ ] Ask for buddy-matching consent with **Yes** and **No** buttons, plus one line on what's shared: first name only, and their username only after both people accept.
- [ ] Save the student with their `telegram_id` and `telegram_username`.
- [ ] For an existing student, show the main menu instead.

## 3. Browse and join (Must)

- [ ] `/browse`: show area buttons, then the next 5 activities in that area: title, date and time, place, spots left.
- [ ] Give each activity **Join** and **More** buttons.
- [ ] **More:** full description, organiser, closing date, and who's going (counts only, or opted-in first names).
- [ ] **Join:** use the same rules as the website. Not after the closing date, not when full, and joining twice is not an error. Reply "You're going to …" or the reason it failed.
- [ ] Check that joining in the bot shows on the website, and the other way round.

## 4. My activities: `/going` (Must)

- [ ] List the student's upcoming joined activities, soonest first.
- [ ] Add a **Leave** button on each, with a short confirmation.
- [ ] If there are none, reply "You haven't joined anything yet. Try /browse."

## 5. Website sign-in link: `/web` (Must)

- [ ] Create a one-time token, store it hashed, valid for 15 minutes.
- [ ] Reply with the website link containing the token: `<website address>/index.html?token=<token>`.
- [ ] Test that the link signs in once, and fails the second time.

## 6. Reminders (Should)

- [ ] Schedule a daily message at **18:00 Singapore time** to everyone joined to an activity starting tomorrow: title, time and place.
- [ ] Schedule a daily message at **20:00** to everyone whose activity ended today: "How did it go? Send /log to record it."

## 7. Journal: `/log` and photos (Should)

- [ ] `/log`: ask which joined activity, or which area if it's not in the list.
- [ ] Ask for the date ("Today" button), then start and end time, then "What happened?"
- [ ] Accept photos and save each `telegram_file_id` with the entry.
- [ ] Save the entry with `source = 'telegram'`, working out hours from the times.
- [ ] If a photo arrives on its own, ask which entry or activity it belongs to.

## 8. Buddies (Should)

- [ ] Under **More**, show opted-in students going to the same activity, each with a **Send buddy request** button.
- [ ] Send the other student a message with **Accept** and **Decline** buttons.
- [ ] Once both have accepted, send each the other's Telegram username.

## 9. Summary and settings (Should)

- [ ] `/summary`: hours and number of activities per area.
- [ ] `/settings`: change areas of interest and turn buddy matching on or off.

## 10. Finishing (Must before the demo)

- [ ] Reply to unknown messages with the menu, not silence.
- [ ] Show a friendly message when n8n or the database fails, not nothing.
- [ ] Test the whole flow with 2–3 classmates' accounts.
- [ ] Check privacy: no other student's username, email or Telegram ID is ever shown without both people agreeing.
