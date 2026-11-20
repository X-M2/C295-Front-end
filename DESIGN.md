---
name: Student activities companion (working title)
description: The week's activities as a wall of gig posters, where the date is the headline.
colors:
  ground: "#121110"
  ground-2: "#1d1b19"
  ground-3: "#2b2825"
  rule: "#3d3934"
  paper: "#f3eee6"
  paper-2: "#c4bcb0"
  paper-3: "#a39b90"
  ink-sl: "#d9714f"
  ink-oa: "#3ad374"
  ink-hl: "#dcb85a"
  ink-cl: "#c09bff"
  on-ink: "#121110"
  soon: "#ffb85c"
  going: "#7be3a3"
  error: "#ff9b8a"
  error-ground: "#2c1a17"
typography:
  display:
    fontFamily: "Archivo, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "6rem"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.005em"
    fontVariation: "'wdth' 62"
  date-line:
    fontFamily: "Archivo, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 900
    lineHeight: 0.84
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 62"
  headline:
    fontFamily: "Archivo, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 900
    lineHeight: 1
    fontVariation: "'wdth' 62"
  title:
    fontFamily: "Archivo, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 850
    lineHeight: 1.02
    fontVariation: "'wdth' 76"
  body:
    fontFamily: "Archivo, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "'tnum' 1"
  fact:
    fontFamily: "Archivo, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.35
    fontFeature: "'tnum' 1"
  label:
    fontFamily: "Archivo, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.35
  billing:
    fontFamily: "Archivo, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.005em"
    fontVariation: "'wdth' 62"
rounded:
  none: "0px"
  field: "6px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "22px"
  xl: "32px"
  2xl: "48px"
components:
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.ground-3}"
  button-solid:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.paper-2}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "36px"
  button-on-ink:
    backgroundColor: "{colors.on-ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
    width: "104px"
  area-tab:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "42px"
  area-tab-selected:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.on-ink}"
  input:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.paper}"
    rounded: "{rounded.field}"
    padding: "10px 14px"
    height: "46px"
  poster:
    backgroundColor: "{colors.ink-sl}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.none}"
    padding: "22px 22px 20px"
  side-panel:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "24px"
  toast:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.pill}"
    padding: "12px 14px 12px 20px"
  button-icon:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0"
    height: "36px"
    width: "40px"
  ticket:
    backgroundColor: "{colors.ink-oa}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.none}"
    padding: "16px"
  day-cell:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
  day-cell-logged:
    backgroundColor: "{colors.ink-hl}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.none}"
  day-cell-tolog:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
  day-today:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.pill}"
    padding: "3px 6px"
  day-flag:
    backgroundColor: "{colors.on-ink}"
    textColor: "{colors.soon}"
    rounded: "{rounded.pill}"
    size: "24px"
  day-panel:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "22px"
  entry-header:
    backgroundColor: "{colors.ink-cl}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.none}"
    padding: "24px 24px 22px"
  photo-add:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "16px"
    height: "96px"
  thumb-remove:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    size: "36px"
  error-summary:
    backgroundColor: "{colors.error-ground}"
    rounded: "{rounded.none}"
    padding: "14px 16px"
  notice:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.paper-2}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
  range-tab:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "42px"
  range-tab-pressed:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.on-ink}"
  lineup-act:
    backgroundColor: "transparent"
    textColor: "{colors.ink-sl}"
    typography: "{typography.billing}"
    padding: "16px 0 14px"
  lineup-act-zero:
    backgroundColor: "transparent"
    textColor: "{colors.paper-3}"
  bar-segment:
    backgroundColor: "{colors.ink-sl}"
    rounded: "{rounded.none}"
  area-row:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "12px 0"
  area-row-hover:
    backgroundColor: "{colors.ground-2}"
---

# Design System: Student activities companion (working title)

## Overview

**Creative North Star: "The Gig Poster Wall"**

The week's activities are pasted up as gig posters on a dark wall, the kind outside *SCAPE or the Esplanade. The date is the headline: set in Archivo at its narrowest and heaviest, so what is soon reads from across the room. Each of the four areas is one flat spot ink, and every poster is printed on its ink in near-black. Everything around the posters (header, filters, side panels, forms) stays on the wall: near-black ground, warm off-white paper type, thin warm rules.

The system is flat and printed. Depth comes only from ink against wall; there are no gradients, textures or shadows. Type width is the main expressive lever: poster type runs condensed (wdth 62) and uppercase, titles slightly wider (wdth 76), and every fact a student must read to decide runs at normal width and body size or larger. The poster world never outranks usability: posters stay compact on phones, Join sits in the same corner of every poster, and full or closed activities say so twice, with a stamp and a disabled button.

Motion is one gesture: posters paste up once on load and on filter change. Two moments confirm an action the same way: joining presses the GOING stamp on, and saving an entry clears its to-log ticket and pastes that day's ink in. Nothing else moves beyond state transitions.

This system replaces the retired MRT arrival-board world (kept in git history). The journal is the first extension built inside it: the wall's own month calendar, where each logged day is pasted in its area's ink and each missed log is an empty dashed slot, with small ink tickets for what still needs logging and a one-page entry form under a poster header. The summary is the second: the four areas billed like a gig poster's line-up, type size as rank, the headliner biggest in its ink and an area with no hours set smallest in Paper Faint with a way to find one; under it, hours per month as stacked ink columns and the entries behind each area. It must extend the same way, without new worlds, to the remaining planned surfaces: the reflection compiler, the optional award tracker, and admin. No components exist for those yet; build them from the wall, paper type, spot inks and the components below.

**Key Characteristics:**
- Near-black wall, warm off-white paper ink, one flat spot ink per area.
- The date line is the headline: Archivo 900, wdth 62, uppercase, tight leading.
- Posters are square-cornered ink blocks; controls are pills; text fields are gently rounded.
- Flat throughout: no gradients, textures or shadows.
- Status is printed: angled FULL, CLOSED, GOING stamps.
- Deciding facts at body size or larger, tabular numerals everywhere.
- Photos print as duotone in the area ink on the wall, and in natural colour inside panels and on the activity page.
- On the journal calendar, ink means logged and a dashed slot means still to log.
- On the summary, type size is rank: four fixed billing sizes, set by hours.

## Colors

A dark wall with warm paper type, and four loud flat spot inks reserved for the areas.

### Primary
- **Spot Red-Orange** (ink-sl): Service Learning posters, tab dots and detail headers.
- **Spot Green** (ink-oa): Outdoor Appreciation.
- **Spot Yellow** (ink-hl): Healthy Living; also the text-selection highlight.
- **Spot Violet** (ink-cl): Community Leadership.
- **Press Black** (on-ink): the ink printed on every spot ink: poster type, poster rule, on-poster buttons and stamp borders. Same value as the wall, so posters read as printed on the wall's own black.

### Neutral
- **Night Wall** (ground): page background and the base of everything off-poster.
- **Wall Shadow** (ground-2): raised panels on the wall: side panel, sign-in options, inputs, skeletons, plain calendar day cells, the day panel, the restored-draft notice; hover fill on the summary's entry rows.
- **Wall Edge** (ground-3): hover fill for outline buttons, meter track, avatar fill.
- **Warm Rule** (rule): 1px header, footer and section rules; 2px tab and input borders; dashed empty-state frame.
- **Paper** (paper): primary text, solid buttons, selected tab, toast, focus ring, meter fill.
- **Paper Dim** (paper-2): secondary text, inactive nav, ledes, field icons; the dashes of to-log and unfinished day cells.
- **Paper Faint** (paper-3): placeholders, counts, footer, the full-meter fill, weekday labels, the dashed photo add zone at rest; the name and 0 h of a line-up area with no hours.

### States
- **Soon Amber** (soon): closing-soon and few-spots-left on the wall, the slow-server note, and unfinished journal entries (the flag on the day cell, the "Incomplete: add ..." line in the day panel, the flagged "Unfinished" mark on a summary entry row).
- **Going Mint** (going): "You're going" on the detail side panel.
- **Error Coral** (error) on **Error Ground** (error-ground): invalid fields (inputs, selects, textareas and the photo add zone), field errors, the error state frame, the form's error summary, and the live hours line when end is before start.

### Named Rules
**The One Ink Per Area Rule.** Each spot ink belongs to exactly one area and is used only to identify it. Never use a spot ink for status, emphasis or decoration; states use the wall's own state colors.

**The Printed In Black Rule.** Anything on a spot ink is Press Black (on-ink), never paper or another ink. The only reversal is the closing-soon fact, which knocks the poster's ink out of a black band.

**The Duotone On The Wall Rule.** On the wall (poster photo bands, logged calendar day cells) a photo is printed in greyscale multiplied into its area's ink, so it reads as part of the poster. Inside panels (the day panel's entry photos, form thumbnails) and on the activity page the same photo shows in its natural colour. Text never sits on a photo.

**The Ink Type On The Wall Rule.** A spot ink may print directly on the wall as type only for an area's own name, in billing type (900, wdth 62, uppercase, 1.25rem or larger), as on the summary line-up. This is identification, so it sits inside One Ink Per Area; it is not on an ink, so Printed In Black does not apply. Every other area label on the wall stays paper type with the 11-13px ink dot, and numbers beside an inked name stay paper. An area with nothing to identify (no hours) drops its ink for Paper Faint.

## Typography

**Display Font:** Archivo variable (wdth 62-125, wght 100-900), self-hosted, falling back to system-ui
**Body Font:** Archivo at normal width (wdth 100)

**Character:** One family doing two jobs. Condensed and black, it is the poster's shout; at normal width it is a calm, legible fact sheet. Numerals are tabular everywhere so dates, times and spots line up.

### Hierarchy
- **Display** (900, wdth 62, uppercase, 6rem / 3.5rem on phones, 0.86): the page title ("What's on", "Sign in" at 4.5rem / 3.5rem).
- **Date line** (900, wdth 62, uppercase, 4.5rem on posters, 6rem on the headliner and detail header; 3.25rem on phone posters, 3.75rem on the phone detail header; 0.84): weekday and date, two stacked lines on desktop posters, one line on headliner, detail and phones.
- **Headline** (900, wdth 62, uppercase, 2.25rem / 1.875rem on phones, 1): week group headings (THIS WEEK, NEXT WEEK, LATER); also the large spots figure in the side panel and sign-in option headings at 1.5rem.
- **Title** (850, wdth 76, uppercase, 1.625rem / 1.375rem on phones, 1.02): activity titles on posters; 2.25rem on the headliner, 3rem (2rem phones) on the detail header.
- **Body** (400, 1rem, 1.5): running text; prose capped at 62ch with 1.65 leading.
- **Fact** (600-850, 1rem, 1.35): poster facts; spots left is 1.125rem with the count in 850.
- **Label** (700, 0.8125rem): fact-sheet labels, field errors, hints, the area name on desktop posters. Never used for a deciding fact.
- **Billing** (900, wdth 62, uppercase, 0.9, -0.005em, balanced wrap): area names on the summary line-up, at one of four fixed rank sizes: 4.5, 3.25, 2.25 and 1.5rem on desktop; 2.75, 2.125, 1.625 and 1.25rem on phones.

### Named Rules
**The Date Is The Headline Rule.** On every poster and poster header, the date line is the largest type. Titles come second.

**The Deciding Facts Rule.** Spots left and the closing date are at body size (1rem) or larger on every viewport, never small print. Spots left leads at 1.125rem.

**The Two Widths Rule.** Condensed width (wdth 62-76) is for dates, titles and headings in uppercase. Facts, controls and prose use normal width and sentence case.

**The Size Is Rank Rule.** On the line-up an area's name size is its billing rank by hours, from four fixed sizes only. Areas tied on hours share a size; an area with no hours always takes the smallest. On phones a long name wraps to two lines rather than shrinking below its rank size. The hours and count beside it stay normal width and right-aligned, so the numbers read at full size whatever the billing.

## Layout

A centered page of 1240px max with 32px side padding (16px on phones), 48px top padding (28px on phones). Narrow pages (sign-in) cap at 760px. Spacing is a loose 8px rhythm: 8 and 12px inside controls and rows, 16px between posters, 22px poster padding, 32px between major blocks, 44px between week groups.

**The wall** is a grid of three equal columns with 16px gaps; two columns under 1000px; one column at 760px and below. The soonest activity is the headliner and spans two columns, with a larger date and title. Posters are grouped under This week, Next week and Later.

**Detail** stacks a full-width poster header over a two-column grid (content plus a 340px sticky side panel, 300px under 1000px). On phones the header bleeds to the screen edges and the side panel moves above the content so Join comes first.

**Filters** are a row of area pills over a search field and a date select.

**Journal** runs top to bottom: the display title with a one-line count lede, the To log strip, then the month. To-log tickets fill an auto-fill grid (250px minimum, 12px gaps). The month heading (headline type) sits beside two 40px icon buttons, with Log something else pushed right. Below it, the calendar and a 380px day panel share a row with a 24px gap; under 1000px the panel drops below the calendar. The calendar is seven equal columns of square day cells with 6px gaps (4px on phones) under small Paper Faint weekday labels.

**Entry form** uses the narrow 760px page: a back link, the poster header, then blocks 30px apart (Photos, the activity, When, What I did, What I learned) and a full-width large solid Save. The When row is date, start, end and the live hours in four columns; on phones date and hours each take a full row over start and end side by side.

**Summary** uses a 1000px page: the display title with a one-line lede (total hours, activities, unfinished entries not counted with a Finish link), the range switch (26px below, 18px on phones), the line-up, then By month 52px below (40px on phones) under a headline-type heading, with the details panel under the chart. Entries stay hidden until the student taps a period or an area.

### Named Rules
**The Three On A Phone Rule.** At 760px and below a poster is compact (16px padding, 3.25rem date on one line, 1.375rem title, area name hidden) so about three posters are visible per screen.

**The Seven Columns On A Phone Rule.** On phones the calendar keeps all seven columns; day cells drop their photos and show ink only, the Log mark shrinks to 0.6875rem and the flag to 18px. The to-log tickets become one 236px-wide scrolling row that bleeds to the screen edges, and the chosen day's panel opens below the grid, edge to edge.

**The One Row Of Areas Rule.** On phones the area pills sit in one horizontally scrolling row that bleeds to the screen edges, with no visible scrollbar; the cut-off last pill shows there is more. The search field and a 128px date select share one row below it.

## Elevation & Depth

Flat. There are no shadows anywhere. Depth is tonal: the wall (ground), panels one step lighter (ground-2), hover and tracks one step more (ground-3), and the spot-ink posters as the brightest surfaces. Hover on a poster is a 3px paper outline offset 4px, not a lift.

### Named Rules
**The Pasted Flat Rule.** No box-shadow, gradient or texture on any surface. A poster announces itself with ink, not elevation.

## Shapes

Three shapes only. Posters, poster headers, panels, empty states and the meter are square-cornered (0px), like paper. Every control that is pressed or toggled, plus the toast and count badges, is a full pill (999px). Text inputs and selects are gently rounded (6px). Rules are 1px on the wall, 2px on posters and controls; the poster's facts sit under a 2px Press Black rule, as does the to-log ticket's foot. Calendar day cells are square-cornered squares (aspect 1); a day that holds two areas is split on the diagonal, the second ink taking the lower-right triangle. Dashed 2px borders mean "something still to add": to-log day cells, unfinished day cells, the photo add zone, the day panel's to-log note and the empty state. The stamp is the one rotated shape: a 3px-bordered square tag, tilted 7 degrees.

## Components

### Buttons
Pill-shaped, bold (750) and plainly worded; 44px tall by default.
- **Shape:** full pill (999px), 2px border.
- **Outline (default):** transparent with a paper border and text; hover fills Wall Edge.
- **Solid:** paper fill, Press Black text; hover goes to pure white. Used for the primary action on the wall (Join on the detail page, sign-in submits).
- **Quiet:** borderless, Paper Dim text; hover brightens with a Wall Shadow fill. Sign out, secondary form actions.
- **On-ink:** the poster's Join. Press Black fill, paper text, 104px min width (92px, 42px tall on phones). Disabled on-ink becomes a dashed Press Black outline with the reason as its label (Full, Closed). Leave on a poster is the on-ink quiet variant, a Press Black outline.
- **Icon:** a small outline pill squared to 40px wide, holding one 18px arrow; the month's previous and next. Carries an aria-label.
- **Sizes:** small 36px, large 54px; block buttons fill their column.
- **States:** colour transitions 150ms; active nudges down 1px; disabled is 0.55 opacity off-poster; busy shows "Joining..." with a progress cursor.

### Chips (area tabs)
- **Style:** 42px pills (38px on phones), 2px Warm Rule border, paper text, 650 weight, an 11px spot-ink dot before each area name.
- **State:** hover lifts the border to Paper Dim; selected fills paper with Press Black text.

### Cards / Containers
- **Poster:** a square block in the area's spot ink, Press Black type. Order is fixed: date line, when line (countdown and time), title, place, a 2px rule, then facts on the left (spots left, closes, who's going, area) and the action on the right. The whole poster opens the activity; Join sits above that link and works in place.
- **Side panel / sign-in option:** Wall Shadow fill, 1px Warm Rule border, 24px padding, square corners.
- **Empty state:** 2px dashed Warm Rule frame, 30px padding, headline, a Paper Dim line and actions. The error variant is solid Error Coral on Error Ground.
- **Skeleton:** Wall Shadow poster shapes with pulsing Wall Edge bars; a "Waking up the server" note in Soon Amber appears if loading is slow.

### Inputs / Fields
- **Style:** Wall Shadow fill, 2px Warm Rule border, 6px radius, 46px tall, 1rem text; search carries a leading icon, select a paper chevron.
- **Focus:** border turns paper (no glow).
- **Textarea:** the same field, 120px minimum, vertical resize, 1.55 leading.
- **Error:** Error Coral border and a bold 0.8125rem Error Coral message below. Applies to inputs, selects, textareas and the photo add zone alike.
- **Area choice in forms:** the area tabs reused as radio pills; checked fills paper with Press Black text.

### Navigation
- **Style:** 64px header (56px on phones) under a 1px rule. The product name is set in poster type (900, wdth 62, uppercase). Four links, Browse, Going, Journal and Summary, in 650 weight, Paper Dim at rest, paper on hover and when current, with a 3px paper bar on the header's bottom edge for the current page. Going carries a paper count pill.
- **Mobile:** the student's name hides and Sign out collapses to its icon (with an accessible label). At 480px and below the product name hides too, so the four links fit on one line; Browse is home.

### Stamp (signature)
FULL, CLOSED and GOING printed at an angle like a sold-out sticker: poster type at 1.625rem (1.25rem on phones, 2rem on the detail header), 3px Press Black border, the poster's own ink as fill, rotated 7 degrees, top right. Decorative to assistive tech; the facts and the button carry the state in words.

### Toast
A paper pill dropped from just under the header, Press Black text with a 2px border, an optional underlined action (Undo). Slides in 12px over 220ms.

### To-log ticket
A small poster for an activity the student went to but has not logged. Square block in the area's ink, Press Black type, 16px padding: the date line (2.25rem, 1.875rem on phones, one line), the title (850, wdth 76, uppercase, 1.125rem), place and duration (600, 0.9375rem), then a foot under a 2px Press Black rule holding the on-ink Write entry button. Tickets paste up like posters. When nothing is left, a single Paper Dim line with a Going Mint check replaces the strip.

### Month calendar
Square day cells, day number top left (750, 1rem; 0.9375rem on phones). States:
- **Plain:** Wall Shadow fill; hover shows a 2px Paper Faint border.
- **Logged:** filled with the area's ink, number in Press Black; on desktop the lower half (52%) carries the day's first photo as duotone in that ink.
- **Two areas:** split on the diagonal, the second area's ink in the lower-right triangle.
- **To log:** transparent with a 2px dashed Paper Dim border and a bold "Log" mark bottom left.
- **Unfinished:** a 2px dashed Paper Dim border with the ink inset 3px inside it, and a 24px Press Black flag disc bottom right holding a Soon Amber flag.
- **Today:** the day number sits in a paper pill with Press Black type.
- **Selected:** a 3px paper outline offset 2px (aria-pressed).
- **Future:** disabled at 0.4 opacity, no hover.
Loading shows Wall Shadow squares pulsing; failure replaces the grid with the coral error frame.

### Day panel and entry
A Wall Shadow panel with a 1px Warm Rule border and 22px padding (edge to edge on phones). The heading is the day's date in headline type. A to-log activity shows first as a dashed Warm Rule note with a solid small Write entry. Each entry is an article: its photos in natural colour (one photo 16:9 full width, several in a three-column 4:3 grid), a title in 850 wdth 76 uppercase with the area's ink dot, a Paper Dim meta line (area, times, hours in paper bold, "from Telegram"), a Soon Amber "Incomplete: add ..." line with a flag when anything is missing, What I did and What I learned under small Paper Dim labels at 62ch, then Edit, or a solid Finish entry when incomplete. Entries are separated by a 1px rule.

### Entry form
- **Poster header:** the activity printed as a poster header in its area's ink (date line 4rem on one line, title 2rem; 3rem and 1.625rem on phones, bleeding to the edges). Logging something not listed uses the display title instead ("Log an activity", 4.5rem / 3.25rem).
- **Block headings:** each block is headed in headline type at 1.5rem (900, wdth 62, uppercase), with an optional normal-width Paper Faint count, and a Paper Dim hint below.
- **Photos:** a 96px dashed add zone (Paper Faint dashes, paper on hover, a 24px camera icon and "Add photo"); chosen photos show as square natural-colour thumbnails in a 104px auto-fill grid, each with a 36px wall-black remove pill with a paper border in its top-right corner.
- **When:** date, start and end fields and the live hours, set in poster type (900, wdth 62, 1.75rem); when end is not after start it switches to a bold normal-width Error Coral sentence.
- **Error summary:** on a failed save, an Error Ground box with a 2px Error Coral border above the form says how many things are missing in paper bold, then lists them; it takes focus. Errors clear one by one as they are fixed.
- **Restored-draft notice:** a Wall Shadow strip with a 1px Warm Rule border, a retry icon and a Paper Dim line saying the unsaved entry was kept on this phone.

### Range switch
The area-tab pill reused as a group of toggle buttons (aria-pressed) under the lede: All time, This term (only while a term is on), This month. Pressed fills paper with Press Black text, as a selected tab. The choice is kept in the URL. Hidden while the page shows its error frame.

### Line-up (signature)
The four areas billed like a gig poster, most hours first. Each act is a row between 1px Warm Rule rules (16px top, 14px bottom; 12px and 11px on phones): the area name on the left in billing type at its rank size (see The Size Is Rank Rule), printed in its own ink on the wall and linking to that area's entries (hover underlines it 3px); on the right, aligned to the name's foot, the hours (800, 1.5rem; 1.125rem on phones) over the activity count (Paper Dim, 1rem), both normal width, right-aligned and unwrapped. An area with no hours sets its name and 0 h in Paper Faint, with "Nothing yet. Find one" below (Paper Dim, the link in paper bold with an arrow) leading to Browse filtered to that area. Rows paste up on load and on range change. Loading shows four pulsing Wall Shadow bars sized by rank.
- **Empty:** all four acts in Paper Faint with Find one, then a solid Browse activities and an outline Log your first activity (Log an activity once anything exists).
- **Empty range:** when the chosen range has nothing but all time does, a solid See all time and an outline Log an activity.
- **Error:** the coral error frame with Try again replaces the line-up.

### Stacked ink columns
Hours per period as flat columns: By month (six to twelve months) or By week for This month. Columns share the width with 12px gaps (6px on phones, bleeding 6px past the page edge) and scale to the busiest period at 300px (220px on phones). Each column stacks its areas' inks bottom up in a fixed area order, segments sized by hours, square-cornered and separated by 2px gaps of wall; an ink appears only where it has hours. The total sits above (800, 1.125rem, Paper Dim, number only; 0.9375rem on phones) and the period label below a 1px Warm Rule (0.9375rem Paper Dim; 0.8125rem on phones); the current period's label and total are paper, the label bold. No axes, gridlines or legend: the line-up above is the key. The section hides when there are no hours. Each column is a button carrying a visually hidden sentence with the period, total and hours per area; a period with nothing logged is disabled. Left and right arrows move between columns.

- **Picked period:** the column's stack takes a 2px paper outline 4px out, its label and total turn paper and bold, and the other columns drop to 0.35 opacity.
- **Picked area** (from a line-up name): only that area's segments stay at full ink; every other segment drops to 0.18 opacity. The picked line-up name is underlined (3px) and the other names drop to 0.45.
- **Hover:** the stack's outline shows in Warm Rule.

### Details panel
Under the chart, nothing but a Paper Dim hint ("Tap a month, or an area above, to see what you did.") until something is picked. One pick at a time: tapping the same column or name again, or the 40px round close button, clears it, and focus returns to what was tapped. A picked area scrolls the chart into view when it is below the fold. The pick lives in the address as `?show=` (a month as YYYY-MM, a week by its first day, or an area code); changing the range clears a period pick and keeps an area pick.

The panel heading is title type at 1.5rem (850, wdth 76, uppercase): the period's full name, or a 13px ink dot and the area name. Its hours and activity count follow in 700 Paper Dim (below the heading on phones). Rows sit under 1px rules: date (Paper Dim, 0.9375rem, 8.5rem column), title (650; in a period, led by the entry's ink dot) and hours (800) right; an unfinished entry shows a Soon Amber flag and "Unfinished" instead of hours and links to its form, a finished one to its journal day. Hover fills Wall Shadow. On phones the date sits over the title, hours at the right, and rows bleed to the screen edges.

### Icons
Inline 24px-grid line icons, 1.75 stroke, round caps, sized to 1.15em beside text. Used beside labels, never alone, except the phone sign-out button, which has an aria-label.

### Named Rules
**The Same Corner Rule.** Join (or its disabled stand-in, or the Going tag with Leave) always sits bottom right of the poster, in the poster foot, regardless of how long the title or facts run.

**The Said Twice Rule.** A full or closed activity shows a stamp and a disabled button whose label gives the reason (Full, Closed, Sign-up closed). Never hide the button, never use colour alone.

**The Paste-Up Rule.** Posters, to-log tickets and summary line-up rows fade up from 0.2 opacity and 6px below over 180ms (ease-out cubic-bezier(0.16, 1, 0.3, 1)), staggered 25ms each and capped at the eighth poster, on load and filter or range change only. Details panel rows paste up the same way when a pick opens them. Reduced motion removes it. The calendar and the day panel do not animate, except as below.

**The Grow Rule.** On load and range change the summary's columns grow up from the baseline (clip-path wiping in from the bottom over 520ms, ease-out, 45ms apart left to right), and each total fades up 4px over 220ms as its column lands. Picking fades other columns or segments over 150ms. Nothing else on the chart moves, and reduced motion removes all of it.

**The Confirm Rule.** Motion may confirm an action the student just took, once, where they are looking. Joining presses the GOING stamp onto the poster (and the activity header): it drops from 1.7x to 0.95x and settles at 1x over 300ms, keeping its 7° tilt. Saving an entry from a ticket shows that ticket once more, fades it to 0.94x after 320ms, and slides the remaining tickets over the gap in 240ms (on phones the strip scrolls to it first). The saved day's ink and photo then wipe up from the bottom over 380ms, starting only once the day is on screen. Nothing repeats, nothing loops, and reduced motion removes all of it.

**The Filled Or Dashed Rule.** On the journal calendar a past day the student went to is either filled with its area's ink (logged) or a dashed empty slot marked Log (still to log). Ink on the calendar means logged and nothing else.

## Do's and Don'ts

### Do:
- **Do** give every activity surface its area's spot ink and print on it in Press Black.
- **Do** set dates as the largest type on a poster: Archivo 900, wdth 62, uppercase.
- **Do** keep spots left and the closing date at 1rem or larger on every viewport.
- **Do** keep posters compact on phones so about three show per screen.
- **Do** put Join in the bottom-right corner of every poster.
- **Do** show full and closed as a stamp plus a disabled button that names the reason.
- **Do** keep area filters in one scrolling row on phones.
- **Do** design slow, empty and failed loads as states on the wall (skeletons, the waking-up note, dashed empty frame, coral error frame).
- **Do** print photos as duotone in the area ink on the wall, and show them in natural colour inside panels and on the activity page.
- **Do** put what still needs logging first, as ink tickets with Write entry, and mark it again on the calendar as a dashed slot.
- **Do** mark invalid photo zones, inputs and textareas with an Error Coral border plus a message, and summarise the errors above the form.
- **Do** bill areas on the summary by hours with the four fixed rank sizes, ties sharing a size, numbers at full size on the right.
- **Do** chart hours as flat stacked ink columns with 2px wall gaps, a total above and a label below a rule, and no axes chrome.
- **Do** extend the reflection compiler, award tracker and admin from these tokens and components before inventing new ones.

### Don't:
- **Don't** add shadows, gradients or textures to any surface.
- **Don't** use a spot ink for anything but its area.
- **Don't** put deciding facts in label size or Paper Faint.
- **Don't** round poster corners or square off buttons; posters are paper, controls are pills.
- **Don't** wrap the area filters onto several lines on phones.
- **Don't** hide a full or closed activity's button or signal its state by colour alone.
- **Don't** animate anything beyond the paste-up, the two Confirm Rule moments and state transitions.
- **Don't** use ink on the calendar for anything but a logged day.
- **Don't** print a spot ink as type on the wall for anything but an area's own name in billing type.
- **Don't** shrink a line-up name below its rank size to fit a phone; let it wrap.
