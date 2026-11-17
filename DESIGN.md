---
name: Student activities companion (working title)
description: Activities as arrivals, read like a Singapore MRT platform board.
colors:
  ground: "#eef1f3"
  ground-2: "#e2e7eb"
  surface: "#ffffff"
  line: "#d6dde3"
  line-strong: "#b4c0ca"
  ink: "#0f1a24"
  ink-2: "#4b5a68"
  ink-3: "#5f6e7c"
  board: "#050708"
  board-2: "#161b20"
  board-line: "#262d34"
  board-ink: "#f2f5f7"
  board-ink-2: "#a3b3c1"
  board-live: "#ffc845"
  line-sl: "#d42e12"
  line-oa: "#00843d"
  line-hl: "#f99d1c"
  line-cl: "#9b26b6"
  warn: "#9a5200"
  warn-bg: "#fff3d6"
  ok: "#007a39"
  error: "#b42318"
  error-bg: "#fdecea"
  focus: "#1663d6"
typography:
  display:
    fontFamily: "Archivo, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "2.375rem"
    fontWeight: 750
    lineHeight: 1.15
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 84"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 84"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.15
    fontVariation: "'wdth' 84"
  countdown:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 750
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 75"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "'tnum'"
  meta:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 650
    lineHeight: 1.4
  code:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 750
    lineHeight: 1
    letterSpacing: "0.04em"
    fontVariation: "'wdth' 84"
rounded:
  none: "0px"
  xs: "4px"
  sm: "6px"
  md: "10px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "36px"
  gutter-mobile: "16px"
  container: "1160px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "42px"
  button-primary-hover:
    backgroundColor: "#24384b"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "42px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "34px"
  area-code-pill:
    textColor: "{colors.surface}"
    typography: "{typography.code}"
    rounded: "{rounded.pill}"
    padding: "0 0.5em"
    height: "1.65em"
  area-tab:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 14px 0 8px"
    height: "40px"
  area-tab-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
    height: "44px"
  arrival-board:
    backgroundColor: "{colors.board}"
    textColor: "{colors.board-ink}"
    rounded: "{rounded.none}"
    padding: "18px 22px 10px"
  board-flag:
    backgroundColor: "{colors.board-2}"
    textColor: "{colors.board-ink}"
    rounded: "{rounded.pill}"
    padding: "1px 8px"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "22px"
---

# Design System: Student activities companion (working title)

## Overview

**Creative North Star: "The Platform Board"**

Activities are arrivals. The system borrows Singapore MRT platform signage: a cool, light station ground, near-black ink, and one dark arrival board where the soonest things count down in amber. The four areas of growth are treated as train lines, each with its own line colour and a two-letter station code (SL, OA, HL, CL), so a student can read area, time and room left the way a commuter reads a platform display: at a glance, without a legend.

Density is operational, not promotional. Lists are ruled rows on the ground, not cards; photographs are optional and never lead. The one dark surface carries the live information (countdowns, closing-soon, few-spots), and every other surface stays light and quiet so the board reads first. Archivo runs everything, semi-condensed for headings, the board and numerals, normal width for running text, with tabular figures everywhere so times and counts align in columns.

Motion is nearly absent. Board rows tick in once on load and on filter change; buttons and tabs fade their colours; the toast slides up. Nothing else moves, and reduced-motion collapses all of it.

**Key Characteristics:**
- One dark arrival-board surface per view, square-cornered, with a 6px slate top rail.
- Area identity carried only by line colour plus two-letter code pill, never by colour alone.
- Ruled rows on a cool ground instead of card grids.
- Archivo variable: 84% width for headings and codes, 75% for big numerals, 100% for body.
- Tabular numerals on the whole document.
- Pill-shaped controls; 10px panels; 0px board.

## Colors

A cool grey-blue station ground with near-black ink, one black board with a single amber "live" signal, and four line colours reserved for area identity.

### Primary
- **Station Ink** (`ink`): Text, the primary button, the selected area tab, the 2px rule above each list group, and the active-nav underline. It is the system's action colour; there is no separate brand hue.
- **Arrival Board Black** (`board`): The Next up board, the detail page's when-strip, and the toast. Its family (`board-2` for flags and skeletons, `board-line` for row dividers and the 6px top rail, `board-ink` and `board-ink-2` for text) is used only on this surface.
- **Countdown Amber** (`board-live`): Countdowns, warning flags on the board, the board's focus ring, the toast action, and text selection. It appears only on board black (or as a translucent selection tint), never as text on the light ground.

### Secondary: Area line colours
- **Service Learning Red** (`line-sl`), **Outdoor Appreciation Green** (`line-oa`), **Healthy Living Orange** (`line-hl`), **Community Leadership Purple** (`line-cl`): Fill for the area code pill, the strip-map line and stop ring in list rows, and the four bars of the brand mark. Healthy Living Orange takes ink text on its pill; the other three take white.

### Neutral
- **Station Ground** (`ground`): Page background.
- **Ground Shade** (`ground-2`): Meter tracks, avatars, skeleton bars, disabled primary buttons, photo placeholder.
- **White Surface** (`surface`): Header bar, inputs, tabs, secondary buttons, side panel, sign-in options, empty states.
- **Hairline** (`line`) and **Rule** (`line-strong`): Panel and tab borders; row dividers, input and secondary-button borders.
- **Secondary Ink** (`ink-2`) and **Muted Ink** (`ink-3`): Meta text and labels; placeholders and disabled text.

### States
- **Closing Amber-Brown** (`warn`, on `warn-bg`): Few-spots and closes-soon text on the light ground, the Sample data badge.
- **Going Green** (`ok`): "Going" / "You're going" confirmations.
- **Error Red** (`error`, on `error-bg`): Field errors, invalid input border, the error state panel.
- **Focus Blue** (`focus`): The 2px focus outline and input focus ring on light surfaces.

### Named Rules
**The Line Colour Rule.** The four line colours mean areas and nothing else. They never become button fills, headings, links or decoration, and they always travel with the two-letter code or area name.

**The One Amber Rule.** Amber is the live signal and lives on board black. On the light ground, urgency uses Closing Amber-Brown (`warn`) instead.

## Typography

**Display Font:** Archivo variable (wdth 62 to 125, wght 100 to 900), self-hosted, with system-ui fallback.
**Body Font:** Archivo at normal width.

**Character:** One family doing signage work. Semi-condensed, heavy weights give headings and codes the compressed authority of station signs; normal width keeps body copy easy to read.

### Hierarchy
- **Display** (750, 2.375rem, 1.15, wdth 84, -0.02em): Page title only (h1). Drops to 1.75rem under 760px.
- **Headline** (700, 1.375rem, 1.15, wdth 84): Section and group headings (h2, list-group headings), board row titles, the when-strip date.
- **Title** (700, 1.125rem, wdth 84): Row titles in lists, panel headings, the board's "Next up" label.
- **Countdown** (750, 1.75rem, line-height 1, wdth 75): Board countdowns and the day number in list rows. Unit words ("days") sit beside at 0.9375rem/600.
- **Body** (400, 1rem, 1.5): Running text; lede at 1.125rem in `ink-2`, max 60ch; prose at 62ch with 1.65 line height.
- **Meta** (400, 0.9375rem): Place, time, going counts, nav links (650).
- **Label** (650, 0.8125rem): Fact labels, closing dates, field errors, footer.
- **Code** (750, 0.8125rem, +0.04em, wdth 84): Area code pills; 0.75rem in the small size.

### Named Rules
**The Tabular Rule.** `font-variant-numeric: tabular-nums` is set on body. Every time, date and count aligns; never turn it off.

**The Two Widths Rule.** Headings, codes, the brand name and the board clock use the 84% width; big numerals use 75%; anything read as a sentence uses 100%.

## Layout

A single centred column, max 1160px with 24px side padding (16px under 760px); narrow pages (sign-in) cap at 720px. Page padding is 36px top and 72px bottom (24/56 on phones). Spacing steps are 4, 8, 16, 24, 36px with a few 10/12/14/18/22px fits inside components.

Browse is a vertical sequence: title and lede, the full-width board, then area tabs, a search-and-when filter bar, and week-grouped lists. A list row is a six-column grid (date stack, strip-map stop, title and meta, going, spots, action) that folds to five columns under 1000px and to a four-column, three-line stack under 760px, with the date and stop spanning all lines and the Join button bottom-right.

The detail page is a main column plus a 320px sticky side panel; under 760px the panel moves above the content. Breakpoints: 1000px and 760px.

## Elevation & Depth

Mostly flat. Depth comes from tonal contrast (black board against light ground, white surfaces on grey ground) and rules, not shadow. One soft two-layer shadow lifts the panels that hold a decision (the detail side panel and sign-in options); the toast has its own darker drop.

### Shadow Vocabulary
- **Panel lift** (`box-shadow: 0 1px 2px rgb(15 26 36 / 0.06), 0 4px 14px -6px rgb(15 26 36 / 0.12)`): Decision panels only.
- **Toast drop** (`box-shadow: 0 8px 24px -8px rgb(15 26 36 / 0.5)`): The floating toast.
- **Input focus ring** (`box-shadow: 0 0 0 3px rgb(22 99 214 / 0.2)`): Inputs and selects on focus.

### Named Rules
**The Flat List Rule.** Rows and the board never carry shadows. Only a panel the student acts in, or a toast, is lifted.

## Shapes

Three silhouettes. Controls and tags are full pills (999px): buttons, tabs, code pills, flags, badges, the toast. Containers on the light ground take a gentle 10px corner (panels, empty states, photos) and inputs a tighter 6px. The board and the when-strip are square (0px) with a 6px top rail, like a hung display. The strip-map stop is a circle: an 18px white ring with a 4px line-colour border on a 6px vertical line (14px/3px and 4px on phones).

## Components

### Buttons
Rounded, confident, ink-led.
- **Shape:** full pill (999px), 42px tall, 16px side padding, 650 weight at 0.9375rem.
- **Primary:** ink fill, white text; hover darkens to #24384b. Used for Join and the one main action per view.
- **Secondary:** white fill, `line-strong` border, ink text; hover turns the border ink.
- **Quiet:** transparent, `ink-2` text; hover gets a ground fill. Used for Sign out and Leave.
- **Sizes:** sm 34px, lg 50px (1.125rem), block full-width.
- **States:** press nudges 1px down; disabled drops to ground fill and muted text with `not-allowed`. Colour transitions 150ms.

### Area code pill (signature)
Two-letter station code in a line-colour pill: 750 weight, 84% width, +0.04em, white text (ink on Healthy Living). Carries a title with the full area name. Appears on board rows, list rows, tabs and the when-strip.

### Area tabs
White pills with a hairline border, code pill inside on the left; selected tab inverts to ink with white text. 40px tall, wrap freely.

### Inputs / Fields
- **Style:** white, 1px `line-strong` border, 6px radius, 44px tall, 1rem text. Search carries a leading stroke icon; select has a custom chevron.
- **Focus:** border turns Focus Blue plus a 3px translucent blue ring.
- **Error:** border turns Error Red; message below in 0.8125rem/600 Error Red.

### Navigation
White header bar, 60px (56px on phones), hairline bottom border. Brand mark (black rounded square with four line-colour bars) plus name; links in `ink-2` 650 weight, current page in ink with a 3px ink underline sitting on the border. A small ink count pill shows how many activities the student is going to.

### Arrival board (signature)
Black, square, 6px slate top rail. Head row: "Next up" title and a live clock. Each row: code pill, title (1.375rem, 84% width) with place and pill flags beneath, and a right-aligned amber countdown with a small time under it. Flags are `board-2` pills; warning flags are amber on a 14% amber tint. Rows tick in once (opacity and 4px rise, 160ms, `cubic-bezier(0.16, 1, 0.3, 1)`, staggered 30ms). On phones the countdown moves under the title, left-aligned. The detail page's when-strip is the same surface in miniature.

### Strip-map list row (signature)
Ruled rows under a 2px ink group rule, each a stop on a coloured line: a date stack (uppercase weekday, 75%-width day number, month), the stop, title with code pill and time and place, going count with a people icon, spots text over a 4px meter with the closing date, and the action. Few spots and closing soon switch to `warn`; full greys the meter. Hover tints the row with translucent white.

### Panels and states
- **Side panel / sign-in option:** white, hairline border, 10px radius, panel lift, 22px padding.
- **Empty:** white, 1px dashed `line-strong`, 10px radius, 28px padding, with reset actions as secondary buttons.
- **Error:** same shape, solid border, `error-bg` fill, Retry as primary.
- **Loading:** skeleton bars that pulse at 1.4s; a "waking up the server" note appears after a delay (amber on the board, `warn` elsewhere).
- **Toast:** board-black pill fixed at bottom centre, optional amber action, slides up in 220ms.

### Icons
One stroke set on a 24px grid, 1.75 stroke, round caps and joins, rendered at 1.15em and inheriting `currentColor`.

## Do's and Don'ts

### Do:
- **Do** keep one dark board-black surface per view for the live information, and keep everything else on the light ground.
- **Do** pair every line colour with its two-letter code or area name.
- **Do** use ruled rows with the strip-map stop for lists of dated activities.
- **Do** set headings, codes and numerals in Archivo at 84% or 75% width, and body at normal width.
- **Do** keep pills for controls and tags, 10px for light containers, 0px for board surfaces.
- **Do** design slow, empty and failing states with the empty/error panel and the waking-up note.
- **Do** mark demo content with the Sample badge in `warn` on `warn-bg`.
- **Do** extend this system to the planned surfaces (journal with photos, hours summary per area, reflection compiler, optional award tracker, admin) using these tokens and components before inventing new ones.

### Don't:
- **Don't** use line colours for buttons, links, headings or decoration.
- **Don't** put amber text on the light ground; use `warn` there.
- **Don't** lay activities out as a photo-card grid led by a hero banner; photos are optional and secondary.
- **Don't** add shadows to rows or the board.
- **Don't** animate beyond the board tick, colour fades, button press and toast slide.
- **Don't** turn off tabular numerals.
