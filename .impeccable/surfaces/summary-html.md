---
version: 1
slug: "summary-html"
primary_target: "summary.html"
related_targets: []
---

# Surface: Summary (summary.html)

Mode: Operate. Signed-in only. A quick balance check on a phone, after logging or before choosing what to join next. Inside the established gig-poster-wall world (DESIGN.md): extend, do not invent a new world. Lead job: answer "am I balanced across the four areas?" at a glance, then send the student to their neglected area. Range switch: All time (default) and This month; no term range, because term dates change every year. Also shows hours by month and the entries behind each area. Hours come from start and end times; incomplete entries are not counted and are named. Data comes from GET /me/journal; no new endpoint. Anti-goals: targets or progress bars (award tracker, later), badges, streaks, scores, celebration effects, pie or donut charts, hero-metric tiles. All demo content is sample data.

## Direction contract

THESIS: The summary as a gig poster's line-up: the four areas are billed in order of hours, the headliner set biggest in its ink, the neglected area set smallest in grey with a way to find one. Refuses the dashboard of four equal stat tiles and a donut chart.

OWN-WORLD: Inherited from DESIGN.md: near-black wall, warm paper type, one flat spot ink per area printed in near-black, Archivo condensed uppercase for names and dates, normal width for every number a student reads. The line-up names are type, not boxes; month columns are flat stacked ink blocks with no axes chrome beyond a baseline and month labels.

STORY: The student opens Summary, sees which area headlines and which is barely billed, taps Find one under the neglected area and lands on Browse filtered to it; or scrolls to see their months and the entries behind each area.

FIRST VIEWPORT: Header with nav (Browse, Going, Journal, Summary). "Summary" in display type with one line of context (total hours, activities, unfinished not counted). A three-option range switch (pills). The line-up: four rows, each the area name in condensed uppercase at one of four fixed sizes by rank, with hours and activity count at full reading size on the right. Zero-hour areas in paper-2 with Find one. Phones: names wrap to two lines rather than shrink below the rank size; numbers stay right-aligned.

FORM: Gig line-up, position 5 of 7 on the grounded structure list (the dealt lead, chosen by the user). seed:35442e3522e76166

SIGNATURE: type size as rank: the line-up billing, headliner in ink, neglected area in grey. Month columns stack the four inks. Motion: the wall's paste-up on the line-up rows on load and range change; nothing else.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
