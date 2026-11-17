---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["activity.html"]
---

# Surface: Browse (index.html) and activity detail (activity.html)

Mode: Operate. Public without sign-in; signed-in students also see friends and their own joins. Phone and laptop. 10-30 activities, photos optional. Job: know what's soon in 10 seconds; per activity see when/where, who's going, spots and closing date; join in the app. Anti-goals: school portal, shopping grid, childish, hard to scan. All demo content is sample data.

## Direction contract

THESIS: Activities as arrivals: what is coming next, how soon, and whether there is still room, read like a platform board. Refuses the event-card photo grid with a hero banner.

OWN-WORLD: Singapore MRT signage. Cool light ground, near-black ink, one dark arrival-board panel. The four areas are MRT line colours with two-letter codes as station-code pills: SL red, OA green, HL orange, CL purple. Archivo, semi-condensed for board and headings, normal width for body; tabular numerals everywhere.

STORY: The visitor sees the next few activities counting down, filters to an area, scans the week-grouped list for time, place, friends and spots, and joins in one tap.

FIRST VIEWPORT: Header with working-title name, nav and sign-in. Page title and one line of context. The dark Next up board: 3-5 soonest rows, code pill, title, place and time, countdown right-aligned large ("Today 17:00", "2 days"), with closing-soon and few-spots flags. Below: area tabs with code pills, a when filter, then the This week group of rows with Join buttons.

FORM: MRT platform arrival board, position 1 of 7 on the grounded list (chosen by the user over the dealt direction). seed:1f5e6afcc367bdd6

SIGNATURE: the Next up arrival board, with live countdowns that refresh each minute. Motion: board rows tick in once on load and on filter change (opacity + 4px, 160ms, staggered 30ms); nothing else moves.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
