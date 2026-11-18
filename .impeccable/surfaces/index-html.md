---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["activity.html","signin.html"]
---

# Surface: Browse (index.html) and activity detail (activity.html)

Mode: Operate. Public without sign-in; signed-in students also see friends, their joins and a Going view. Phone and laptop. 10-30 activities, photos optional. Job: know what's soon in 10 seconds; per activity see when/where, who's going, spots and closing date; join in the app with one tap. Anti-goals: school portal, shopping grid, childish, hard to scan. Team decision (redesign): Gig poster wall replaces the MRT board; usability must not drop. All demo content is sample data.

## Direction contract

THESIS: The week's activities as a wall of gig posters: the date is the headline, so what's soon reads from across the room. Refuses the white event-card grid and the grey portal list.

OWN-WORLD: Singapore event posters on a dark wall (*SCAPE, Esplanade). Near-black ground, warm off-white paper ink. Each area is one flat spot ink, poster printed on it in near-black: SL red-orange, OA green, HL yellow, CL violet. Archivo at its narrowest and heaviest for dates and titles, normal width for facts. No gradients, no textures, no shadows.

STORY: The visitor sees the soonest activity as the headliner poster, scans dates down the wall, filters by area, reads spots and closing date on each poster, and joins without opening it.

FIRST VIEWPORT: Header with name, Browse and Going nav, sign-in. "What's on" set huge in poster type with one line of context. Area pills and date and search filters. Then the wall: the soonest activity as a double-width headliner poster, then posters in three columns. Every poster: huge date line, countdown and time, title, place, a rule, then spots left, closing date, who's going and a Join button. The whole poster opens the activity; Join works in place.

FORM: Gig poster wall, position 5 of 7 on the grounded list (the dealt direction, now chosen by the team). seed:1f5e6afcc367bdd6

USABILITY RULES: On phones a poster is compact (about a third of the screen) so three are visible at once; facts that decide (spots left, closes) are at least body size, never small print; Join stays the same place on every poster; full and closed show as a stamp plus a disabled button with the reason.

SIGNATURE: the date set as a gig poster's date line, and the headliner poster. Status stamps (FULL, CLOSED, GOING) printed at an angle like a sold-out sticker. Motion: posters paste up once on load and filter change (opacity + 6px, 180ms, staggered 25ms); nothing else moves.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
