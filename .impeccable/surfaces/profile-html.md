---
version: 1
slug: "profile-html"
primary_target: "profile.html"
related_targets: []
---

# Surface: Profile (profile.html)

Mode: Operate. Signed-in only. A student checks or changes settings in seconds, mostly on a phone. Inside the established gig-poster-wall world (DESIGN.md): extend, do not invent a new world. Four settings: buddy matching (off by default; first name only, contact only after both accept), reminders sent by the Telegram bot (before an activity: day before and/or 2 h before; log it afterwards; new in my areas with area picks; sign-up closing for activities in those areas, never based on what the student viewed), Telegram link/unlink, my data (download, delete with typed DELETE). Every change saves at once with "Saved"; a failed save flips back and says why. Header: the name links to Profile on laptops; on phones the sign-out icon becomes a profile icon and Sign out moves onto this page. Anti-goals: a long settings form with a Save button, hiding the state of a setting, collecting anything beyond first name, changing name or email, profile photos, award targets. All demo content is sample data.

## Direction contract

THESIS: Settings as stubs stamped with their state: four paper tickets, each carrying OFF, ON or LINKED in the poster wall's own stamp, so a glance says how everything stands before a tap opens it. Refuses the generic list of grey toggles under headings.

OWN-WORLD: Inherited from DESIGN.md: near-black wall, warm paper, Archivo condensed uppercase for titles, normal width for every label and sentence. Stubs are flat paper (#f3eee6) printed in Press Black with a dashed tear line under the title; a stub whose setting is off or absent goes dark on the wall with a dashed paper-3 edge. Stamps are the posters' stamp: condensed caps in a 3px box, tilted 7°.

STORY: The student opens Profile, sees Buddy matching stamped OFF and Reminders ON, taps Reminders, turns on New in my areas and picks Healthy, sees Saved; taps Buddy matching, turns it on, and the stub flips to paper with ON pressed onto it.

FIRST VIEWPORT: Header with nav and the profile icon current. Name in display type, email below, Sign out at the right. A 2x2 grid of stubs (one row of four from 760px up). The open stub carries a 3px paper outline; its settings open below the grid under a headline-type heading, as rows with switches.

FORM: Stamped stubs: challenger vernacular-ephemera-jet-age-ticket-wallet fused into the poster wall's stamps, over dealt structure 4 (status rows), chosen by the user against dealt 6, 4, 7. seed:64d7d85f84e00444

SIGNATURE: the state stamp on each stub, re-pressed with the Confirm Rule's stamp-in when a change flips it. Nothing else moves beyond state transitions.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
