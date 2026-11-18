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
---

# Design System: Student activities companion (working title)

## Overview

**Creative North Star: "The Gig Poster Wall"**

The week's activities are pasted up as gig posters on a dark wall, the kind outside *SCAPE or the Esplanade. The date is the headline: set in Archivo at its narrowest and heaviest, so what is soon reads from across the room. Each of the four areas is one flat spot ink, and every poster is printed on its ink in near-black. Everything around the posters (header, filters, side panels, forms) stays on the wall: near-black ground, warm off-white paper type, thin warm rules.

The system is flat and printed. Depth comes only from ink against wall; there are no gradients, textures or shadows. Type width is the main expressive lever: poster type runs condensed (wdth 62) and uppercase, titles slightly wider (wdth 76), and every fact a student must read to decide runs at normal width and body size or larger. The poster world never outranks usability: posters stay compact on phones, Join sits in the same corner of every poster, and full or closed activities say so twice, with a stamp and a disabled button.

Motion is one gesture: posters paste up once on load and on filter change. Nothing else moves beyond state transitions.

This system replaces the retired MRT arrival-board world (kept in git history). It must extend, without new worlds, to the planned surfaces: the activity journal with photos, the hours summary per area, the reflection compiler, the optional award tracker, and admin. No components exist for those yet; build them from the wall, paper type, spot inks and the components below.

**Key Characteristics:**
- Near-black wall, warm off-white paper ink, one flat spot ink per area.
- The date line is the headline: Archivo 900, wdth 62, uppercase, tight leading.
- Posters are square-cornered ink blocks; controls are pills; text fields are gently rounded.
- Flat throughout: no gradients, textures or shadows.
- Status is printed: angled FULL, CLOSED, GOING stamps.
- Deciding facts at body size or larger, tabular numerals everywhere.

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
- **Wall Shadow** (ground-2): raised panels on the wall: side panel, sign-in options, inputs, skeletons.
- **Wall Edge** (ground-3): hover fill for outline buttons, meter track, avatar fill.
- **Warm Rule** (rule): 1px header, footer and section rules; 2px tab and input borders; dashed empty-state frame.
- **Paper** (paper): primary text, solid buttons, selected tab, toast, focus ring, meter fill.
- **Paper Dim** (paper-2): secondary text, inactive nav, ledes, field icons.
- **Paper Faint** (paper-3): placeholders, counts, footer, the full-meter fill.

### States
- **Soon Amber** (soon): closing-soon and few-spots-left on the wall, and the slow-server note.
- **Going Mint** (going): "You're going" on the detail side panel.
- **Error Coral** (error) on **Error Ground** (error-ground): invalid fields, field errors, the error state frame.

### Named Rules
**The One Ink Per Area Rule.** Each spot ink belongs to exactly one area and is used only to identify it. Never use a spot ink for status, emphasis or decoration; states use the wall's own state colors.

**The Printed In Black Rule.** Anything on a spot ink is Press Black (on-ink), never paper or another ink. The only reversal is the closing-soon fact, which knocks the poster's ink out of a black band.

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

### Named Rules
**The Date Is The Headline Rule.** On every poster and poster header, the date line is the largest type. Titles come second.

**The Deciding Facts Rule.** Spots left and the closing date are at body size (1rem) or larger on every viewport, never small print. Spots left leads at 1.125rem.

**The Two Widths Rule.** Condensed width (wdth 62-76) is for dates, titles and headings in uppercase. Facts, controls and prose use normal width and sentence case.

## Layout

A centered page of 1240px max with 32px side padding (16px on phones), 48px top padding (28px on phones). Narrow pages (sign-in) cap at 760px. Spacing is a loose 8px rhythm: 8 and 12px inside controls and rows, 16px between posters, 22px poster padding, 32px between major blocks, 44px between week groups.

**The wall** is a grid of three equal columns with 16px gaps; two columns under 1000px; one column at 760px and below. The soonest activity is the headliner and spans two columns, with a larger date and title. Posters are grouped under This week, Next week and Later.

**Detail** stacks a full-width poster header over a two-column grid (content plus a 340px sticky side panel, 300px under 1000px). On phones the header bleeds to the screen edges and the side panel moves above the content so Join comes first.

**Filters** are a row of area pills over a search field and a date select.

### Named Rules
**The Three On A Phone Rule.** At 760px and below a poster is compact (16px padding, 3.25rem date on one line, 1.375rem title, area name hidden) so about three posters are visible per screen.

**The One Row Of Areas Rule.** On phones the area pills sit in one horizontally scrolling row that bleeds to the screen edges, with no visible scrollbar; the cut-off last pill shows there is more. The search field and a 128px date select share one row below it.

## Elevation & Depth

Flat. There are no shadows anywhere. Depth is tonal: the wall (ground), panels one step lighter (ground-2), hover and tracks one step more (ground-3), and the spot-ink posters as the brightest surfaces. Hover on a poster is a 3px paper outline offset 4px, not a lift.

### Named Rules
**The Pasted Flat Rule.** No box-shadow, gradient or texture on any surface. A poster announces itself with ink, not elevation.

## Shapes

Three shapes only. Posters, poster headers, panels, empty states and the meter are square-cornered (0px), like paper. Every control that is pressed or toggled, plus the toast and count badges, is a full pill (999px). Text inputs and selects are gently rounded (6px). Rules are 1px on the wall, 2px on posters and controls; the poster's facts sit under a 2px Press Black rule. The stamp is the one rotated shape: a 3px-bordered square tag, tilted 7 degrees.

## Components

### Buttons
Pill-shaped, bold (750) and plainly worded; 44px tall by default.
- **Shape:** full pill (999px), 2px border.
- **Outline (default):** transparent with a paper border and text; hover fills Wall Edge.
- **Solid:** paper fill, Press Black text; hover goes to pure white. Used for the primary action on the wall (Join on the detail page, sign-in submits).
- **Quiet:** borderless, Paper Dim text; hover brightens with a Wall Shadow fill. Sign out, secondary form actions.
- **On-ink:** the poster's Join. Press Black fill, paper text, 104px min width (92px, 42px tall on phones). Disabled on-ink becomes a dashed Press Black outline with the reason as its label (Full, Closed). Leave on a poster is the on-ink quiet variant, a Press Black outline.
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
- **Error:** Error Coral border and a bold 0.8125rem Error Coral message below.

### Navigation
- **Style:** 64px header (56px on phones) under a 1px rule. The product name is set in poster type (900, wdth 62, uppercase). Browse and Going links in 650 weight, Paper Dim at rest, paper on hover and when current, with a 3px paper bar on the header's bottom edge for the current page. Going carries a paper count pill.
- **Mobile:** the student's name hides and Sign out collapses to its icon (with an accessible label).

### Stamp (signature)
FULL, CLOSED and GOING printed at an angle like a sold-out sticker: poster type at 1.625rem (1.25rem on phones, 2rem on the detail header), 3px Press Black border, the poster's own ink as fill, rotated 7 degrees, top right. Decorative to assistive tech; the facts and the button carry the state in words.

### Toast
A paper pill dropped from just under the header, Press Black text with a 2px border, an optional underlined action (Undo). Slides in 12px over 220ms.

### Icons
Inline 24px-grid line icons, 1.75 stroke, round caps, sized to 1.15em beside text. Used beside labels, never alone, except the phone sign-out button, which has an aria-label.

### Named Rules
**The Same Corner Rule.** Join (or its disabled stand-in, or the Going tag with Leave) always sits bottom right of the poster, in the poster foot, regardless of how long the title or facts run.

**The Said Twice Rule.** A full or closed activity shows a stamp and a disabled button whose label gives the reason (Full, Closed, Sign-up closed). Never hide the button, never use colour alone.

**The Paste-Up Rule.** Posters fade up from 0.2 opacity and 6px below over 180ms (ease-out cubic-bezier(0.16, 1, 0.3, 1)), staggered 25ms each and capped at the eighth poster, on load and filter change only. Reduced motion removes it.

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
- **Do** extend the journal, hours summary, reflection compiler, award tracker and admin from these tokens and components before inventing new ones.

### Don't:
- **Don't** add shadows, gradients or textures to any surface.
- **Don't** use a spot ink for anything but its area.
- **Don't** put deciding facts in label size or Paper Faint.
- **Don't** round poster corners or square off buttons; posters are paper, controls are pills.
- **Don't** wrap the area filters onto several lines on phones.
- **Don't** hide a full or closed activity's button or signal its state by colour alone.
- **Don't** animate anything beyond the paste-up and state transitions.
