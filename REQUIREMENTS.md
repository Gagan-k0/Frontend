# whatboutme: requirements from the Brain Matters brochure

What the brochure promises, and whether the website (frontend) and the
platform (backend API, admin, student portal) deliver it today.

Status: **Done**, **Partial**, or **Missing**. Checked against the code on
1 Oct 2026. Nothing here has been built as part of writing this document.

## 1. The four offerings

| Brochure | Website | Backend |
|---|---|---|
| 11 Steps to You: 3 days, 6 hrs/day, in person or online, 25 CPD hours | **Done.** Banner, step line, syllabus, certification steps, course page | **Partial.** Programmes exist, but there is no "11 Steps" programme in the database, and no fields for duration, delivery mode or CPD hours |
| Resilience Speaker + Activity: 2 hrs in person / 1 hr online | **Done.** Shown as a course with timings and what the room walks through | **Missing.** Not a programme in the database; shown from website content |
| Vision Board Workshop: 2–3 hrs / 1 hr, up to 20 people, kit provided | **Done** in website content | **Partial.** Group size can be set per batch (capacity). No kit tracking |
| One-Day Corporate Workshop: certificate of participation, no exam, no CPD | **Done** in website content | **Missing.** No "participation only" certificate type |

## 2. How certification works (brochure page 6)

| Brochure rule | Website | Backend |
|---|---|---|
| 11 modules, each closing with a short quiz | **Done** (described) | **Done.** Steps numbered 1 to 11, one quiz per step, pass mark 75% by default |
| A final exam drawn from the full programme | **Done** (described) | **Missing.** No final exam exists; it is only mentioned in screen text |
| Modules unlock in sequence, no skipping ahead | **Done** (described) | **Partial.** The student portal locks later steps on screen, but the API does not enforce it |
| Attendance across all three days is tracked | **Done** (described) | **Done.** Live sessions with attendance records and a manual override |
| A closing 1:1 call with Roweena before certification | **Done** (described) | **Missing.** Nothing records or schedules the call |
| 25 CPD hours awarded on completion | **Done** (described) | **Partial.** Certificates can be requested and approved by an admin, but CPD hours are not stored, and nothing checks quizzes, exam, attendance or the 1:1 before a request is accepted |

## 3. Content on the website

| Brochure content | Website |
|---|---|
| Cover: "Brain matters", licensed UAE & India, CPD accredited | **Done.** Hero |
| Facilitator story and credentials (page 2) | **Done.** About page |
| The idea: brain health vs mental health, brain drain vs brain train, four ideas (page 3) | **Missing.** Removed when the page was simplified |
| Three ways to bring it into your room, plus the 25 / 18 / 02 / 11 figures (page 4) | **Partial.** Courses are shown; the figures appear on the About page only |
| What you leave with (page 5) | **Missing.** Removed when the page was simplified |
| Who it changes things for (page 6) | **Missing.** Only in one FAQ answer |
| Speaker: timings, what the room walks through, where it fits (page 7) | **Partial.** Timings and walk-through are on the course page; "where it fits" is not |
| Vision Board: timings, kit, quarterly or monthly check-ins (page 8) | **Partial.** On the course page as bullet points |
| Every format at a glance, and how engagements usually run (page 9) | **Missing.** Removed when the page was simplified |
| Organisations and conferences (page 10) | **Done.** Logo marquee, all 17 logos |
| Contact: website, email, two phone numbers, social handle | **Done.** Footer |
| Testimonials | **Not in the brochure.** The section holds placeholders and must not go live as is |

## 4. Enquiring, enrolling, paying

| Need | Website | Backend |
|---|---|---|
| "Start with a conversation" enquiry | **Partial.** Buttons open an email; there is no form | **Partial.** A table for enquiries exists, but there is no endpoint to save one |
| Enrol in a course | **Done.** "Enrol Now" links to the student portal checkout | **Partial.** Checkout is a mock payment only |
| Prices | **Done.** Shown from the admin | **Partial.** US dollars only; the brochure markets to the UAE and India |
| Travel and accommodation excluded; check-ins at additional cost | **Done** (stated on course pages) | **Missing.** No add-ons |
| Sign in | **Done.** Login page, profile menu, LMS Portal button | **Done**, but the rate limit of 5 requests a minute blocks sign-ins (see section 6) |
| Verify a certificate | **Missing** | **Missing.** No public verification endpoint |

## 5. Managing content from the admin

| Need | Status |
|---|---|
| Add, edit and remove courses | **Done.** Title, price, description, duration, audience, in-person and online timings, cover image link, checklist |
| Show or hide a course | **Partial.** Can be set when creating, not when editing (API limitation) |
| Upload a course photo | **Missing.** Only a web link can be pasted |
| Edit FAQ, testimonials, hero and About text | **Missing.** These live in the website's code |
| Build the 11 steps, lessons and quizzes | **Partial.** The API supports it; the admin's curriculum editor screen is a static mock-up |

## 6. Problems to fix before launch

1. **Rate limit.** The API allows 5 requests a minute per address across every
   endpoint. It was meant for login only. It blocks sign-ins and makes the
   admin and student portal unreliable.
2. **Test logins on the login pages.** The admin and student portal login pages
   have buttons that fill in working accounts and a shared password.
3. **Secrets in git.** The website's `.env` holds the database password and is
   tracked by git in this project.
4. **Placeholder testimonials** on the landing page.
5. **Stock photos** on courses; the brochure has no course photos.
6. **Localhost addresses.** Links between the website, portal and admin point
   to `localhost` and need real addresses for deployment.

## 7. Backend work needed to match the brochure

Each of these changes the API or database, so none has been started.

- Course fields: duration, delivery mode, CPD hours, certificate type
  (CPD or participation).
- Final exam per programme.
- Enforce step order in the API, not only on screen.
- Record the closing 1:1 call and require it before certification.
- Check quizzes, exam, attendance and the 1:1 before a certificate request
  is accepted; store CPD hours on the certificate.
- Endpoint to save website enquiries.
- Prices in AED and INR.
- Public certificate verification.
- Fix the rate limit.
