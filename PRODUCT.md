# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain HTML, CSS and JavaScript, no build step (user's choice). The pages call the back end as an API: n8n workflows exposed as webhook endpoints, built by a teammate, backed by Azure SQL Database. Static hosting (for example GitHub Pages). The endpoint list and response shapes are agreed with the back-end teammate and are not decided yet.

## Users

- **RP students (primary):** Republic Polytechnic students looking for activities outside class across four areas, finding peers to join with, and keeping a record of what they did. Many already use the Telegram bot; the website is where they go to see everything properly. Phone and laptop both.
- **Admin (secondary):** the project team or staff, adding and importing activities.

## Product Purpose

A student activities companion (working title; the name is undecided). C295 school project by Zhen Kang, Jun Hao and Xingmeng; this front end is Xingmeng's part and is graded.

The Telegram bot handles quick actions. The website is the fuller version of the same product: everything the bot does, with the activities shown clearly and attractively, so students enjoy coming back to it. Success means students can find an activity that suits them faster than in the bot, and choose to keep using the site.

## Positioning

One place that follows a student across four areas of growth, from finding an activity, to going with a buddy, to logging it and reflecting on it, instead of separate sign-up channels and a reflection written from memory at the end.

## Operating Context

- **Four areas:** Service Learning, Outdoor Appreciation, Healthy Living, Community Leadership. Every activity belongs to one area.
- **Core features (all students):** browse activities by area and date; contact the organiser (a drafted message opened in email, WhatsApp or Telegram; the student presses send); find a buddy; activity journal with photos and optional start and end times; summary of hours and activities per area; reminders (sent by the bot); compile a reflection and a LinkedIn post.
- **Optional award tracker (off by default):** hour targets per area and progress, a goal per area with verifier and approver, a Community Leadership project write-up, and a log book export. Targets are settings. Example set: 60 hours Service Learning over 12 months, 36 hours Outdoor Appreciation, 48 hours Healthy Living over 18 months.
- **Admin:** add activities through a form or import a CSV copied from the school's activity portal (a Microsoft Power Apps app).
- **Sign-in:** two ways. The Telegram bot sends the student a personal link that signs them in, or the student signs in with their email. How email sign-in works (one-time code or password) is undecided.

## Capabilities and Constraints

- The back end is n8n; every read and write goes through its API. The front end must handle slow responses, errors and empty results, because the n8n host may be asleep or unreachable.
- No paid AI. Reflection drafting is template-based; any "polish with AI" step is optional.
- Nothing is sent on a student's behalf; LinkedIn posts are copied by the student.
- The project is not affiliated with any award body. The interface must not use an award's name or logo, and the award tracker presents itself as a personal tracker.
- Open: product name, endpoint contract, email sign-in method, hosting address.

## Evidence on Hand

No real activities, students or journal entries yet. Demo content must be made up and labelled as sample data. No partner organisations, statistics or testimonials may be invented as real.

## Product Principles

1. Activities come first: what is on, when, and whether it suits me, readable at a glance.
2. Everything the bot can do, the website can do, and better to look at.
3. The student's own words and photos are the record; templates only help shape them.
4. Privacy by default (PDPA): nobody sees a student unless they opted in, and contact details are shared only after both people accept.
5. It works whatever the back end is doing: slow, empty or failing responses are designed states, not blank screens.

## Accessibility & Inclusion

Used on phones and laptops; WCAG AA contrast as the baseline; usable by keyboard.
