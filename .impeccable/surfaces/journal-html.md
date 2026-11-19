---
version: 1
slug: "journal-html"
primary_target: "journal.html"
related_targets: ["entry.html"]
---

# Surface: Journal (journal.html) and entry form (entry.html)

Mode: Operate. Signed-in only. Used mostly right after an activity, on a phone; sometimes later to read back or edit. Inside the established gig-poster-wall world (DESIGN.md): extend, do not invent a new world. Lead job: see what still needs logging, then log it fast. Every entry requires at least one photo, start and end time (hours computed), what I did, and what I learned. Entries also arrive from the Telegram bot and may be incomplete. Anti-goals: a heavy calendar-app look, a long multi-step wizard, burying the to-log items. All demo content is sample data.

## Direction contract

THESIS: The journal as the wall's own calendar: each logged day is pasted in its area's ink, each missed log is an empty dashed slot, so the month shows at a glance how regularly you show up. Refuses the generic blog-style list of white cards.

OWN-WORLD: Inherited from DESIGN.md: near-black wall, warm paper type, one flat spot ink per area printed in near-black, Archivo condensed for dates and headings, normal width for facts. Day cells are square paper-like blocks; to-log items are small ink tickets; photos print as duotone in the area ink on the wall, natural colour inside the entry.

STORY: The student opens Journal, sees the to-log tickets first, taps Write entry, adds a photo, confirms the times, writes what they did and learned, and saves; the day on the calendar fills with ink.

FIRST VIEWPORT: Header with nav (Browse, Going, Journal). "Journal" in display type with one line of context. A To log strip of small ink tickets (date line, title, Write entry). Then the month calendar: month heading with previous and next buttons, a seven-column grid, logged days filled with area ink, to-log days dashed with a Log mark, today outlined in paper. Phones: tickets scroll in one row; the grid stays seven columns with ink-only days; the chosen day's entries open below the grid.

FORM: Month calendar, position 6 of 7 on the grounded structure list (the dealt lead, chosen by the user). seed:ab1dd55f4c5cf976

SIGNATURE: logged days filled in area ink (split diagonally when a day holds two areas), to-log days as dashed empty slots, and the to-log tickets. Motion: none beyond the wall's paste-up on the ticket strip and colour transitions; the day panel opens without animation.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
