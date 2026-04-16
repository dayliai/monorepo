# Daily Living Labs Newsletter
## The Infinity Model — Content Strategy & Prototype

> "The loop never ends — Advocates re-enter as Capturers for new members, keeping the infinity model spinning."

---

## The Five Stages

The newsletter follows an infinity loop where each subscriber progresses through five stages. Every email serves a stage — and every stage feeds back into the next.

```
    CAPTURE -----> NURTURE -----> CULTIVATE
        ^                             |
        |                             v
    ADVOCATE <----- CONVERT <--------+
```

---

## Stage 1: CAPTURE
**Goal:** Draw in families, caregivers & people facing ADL challenges

**Audience:** New subscribers, landing page visitors, social referrals

**Content Pillars:**
- "What are ADLs?" explainer — meet people where they are
- Real family story spotlight — "We didn't know help existed"
- Quiz: which daily living challenge fits you?
- Partner intro (UNT, Clemson, Aperio) — credibility signals

**Subject Line Examples:**
- "Does daily life feel harder than it should? You're not alone."
- "What nobody tells you about Activities of Daily Living"
- "Maria's morning routine used to take 2 hours. Not anymore."

**CTA:** Explore solutions / Take the quiz / Read Maria's story

**Frequency:** Welcome sequence (3 emails over 10 days), then folded into regular cadence

**Mailchimp Implementation:**
- Tag: `stage:capture`
- Automation: Welcome series triggered on signup
- Merge field: `SOURCE` (landing page, referral, social, partner)

---

## Stage 2: NURTURE
**Goal:** Build trust with education & community before asking anything

**Audience:** Subscribers who opened 2+ Capture emails

**Content Pillars:**
- "Solution of the Week" — existing tools that actually work
- Behind the Lab: innovation stories from the DLL community
- Caregiver tips series — practical, non-salesy, empathetic
- Partner research spotlight — what universities are discovering

**Subject Line Examples:**
- "This $12 grab bar changed everything for Marcus."
- "5 dressing tips OTs wish every caregiver knew"
- "Behind the Lab: how a shower bench got redesigned by its users"

**CTA:** Read more / Save this tip / Share with someone who needs it

**Frequency:** Weekly (1x/week for 4-6 weeks)

**Mailchimp Implementation:**
- Tag: `stage:nurture`
- Automation: Triggered when subscriber opens 2+ Capture emails
- Segment: By ADL category interest (from click behavior)

---

## Stage 3: CULTIVATE
**Goal:** Deepen engagement — invite participation & co-creation

**Audience:** Engaged readers (opened 3+ Nurture emails, clicked links)

**Content Pillars:**
- "Submit your challenge" — Build What Doesn't Exist
- Prototype progress updates — "Here's what we're building"
- Community poll: vote on the next solution to tackle
- Event / university collaboration announcements

**Subject Line Examples:**
- "We're building something new — and we need your story."
- "Vote: which challenge should we solve next?"
- "Your feedback shaped this prototype. Here's the update."

**CTA:** Submit a challenge / Vote now / See the prototype / Join the call

**Frequency:** Bi-weekly, interspersed with Nurture content

**Mailchimp Implementation:**
- Tag: `stage:cultivate`
- Automation: Triggered by engagement score threshold
- Segment: Active participants vs. passive readers

---

## Stage 4: CONVERT
**Goal:** Move readers to action — sign up, collaborate, share

**Audience:** Cultivate-stage subscribers who have clicked participation CTAs

**Content Pillars:**
- Join the community CTA — create an account on dayliai.org
- Partner / collaboration inquiry form
- "Submit a challenge to solve" — direct pipeline to the Socratic agent
- Donate or sponsor a build

**Subject Line Examples:**
- "Ready to turn your challenge into a solution? Let's build."
- "Your challenge could be our next project."
- "3 ways to get involved with Daily Living Labs this month"

**CTA:** Create account / Submit challenge / Partner with us / Sponsor a build

**Frequency:** Triggered by behavior (clicked Cultivate CTAs), not calendar

**Mailchimp Implementation:**
- Tag: `stage:convert`
- Automation: Behavioral trigger (clicked submit/vote/join links)
- Goal: Track conversion to dayliai.org account creation

---

## Stage 5: ADVOCATE
**Goal:** Turn community members into mission ambassadors

**Audience:** Converted members who have submitted, contributed, or created accounts

**Content Pillars:**
- Success story features — "How [Name]'s solution helped 40 families"
- Refer a family / share the newsletter
- Volunteer & event participation opportunities
- Co-author a solution story with the DLL team

**Subject Line Examples:**
- "You helped us solve this. Would you share it with someone who needs it?"
- "Your solution story could change someone's morning."
- "Daily Living Labs wouldn't exist without people like you."

**CTA:** Share the newsletter / Refer a family / Co-author a story / Volunteer

**Frequency:** Monthly, plus milestone-triggered (e.g., "your solution was published")

**Mailchimp Implementation:**
- Tag: `stage:advocate`
- Automation: Triggered by account activity (submission published, challenge solved)
- Referral tracking: Unique share links per advocate

---

## The Infinity Loop in Practice

```
Week 1:  [CAPTURE]   Welcome email — "What are ADLs?"
Week 2:  [CAPTURE]   Family story — "Meet the Garcias"
Week 3:  [CAPTURE]   Quiz — "Which challenge fits you?"
Week 4:  [NURTURE]   Solution of the Week — grab bars
Week 5:  [NURTURE]   Caregiver tips — dressing independence
Week 6:  [NURTURE]   Behind the Lab — shower bench redesign
Week 7:  [NURTURE]   Partner spotlight — UNT research
Week 8:  [CULTIVATE]  "Submit your challenge" invitation
Week 9:  [NURTURE]   Solution of the Week — adaptive utensils
Week 10: [CULTIVATE]  Community poll — vote on next build
Week 11: [NURTURE]   Caregiver tips — kitchen safety
Week 12: [CULTIVATE]  Prototype update + feedback request
Week 13: [CONVERT]   "Ready to join? Here's what's next."
Week 14: [NURTURE]   Solution of the Week (loop continues)
  ...
Week 20: [ADVOCATE]  "Your story could help someone else"
```

> Note: Subscribers don't rigidly move through stages on a calendar. Mailchimp automations advance them based on BEHAVIOR (opens, clicks, submissions). A highly engaged subscriber might reach Convert by Week 6.

---

## Newsletter Design Specs

**Consistent with DLL brand:**
- Header: Butterfly logo + "Daily Living Labs" in Fraunces
- Body: DM Sans
- Primary CTA: Vibrant Purple (#9230E3) rounded button
- Accent highlights: Cyan (#1FEEEA)
- Background: Pale Purple (#F1E1FF) content cards on white
- Footer: Deep Purple (#461F65) with unsubscribe + privacy links

**Template Structure:**
```
+------------------------------------------+
|  [Butterfly Logo]  Daily Living Labs     |
|  Tagline based on stage                  |
+------------------------------------------+
|                                          |
|  HERO SECTION                            |
|  Headline (Fraunces, Deep Purple)        |
|  1-2 sentence hook (DM Sans)            |
|                                          |
+------------------------------------------+
|                                          |
|  MAIN CONTENT                            |
|  Story / Tip / Update                    |
|  (Pale Purple card background)           |
|                                          |
|  [ Primary CTA Button ]                  |
|    (Vibrant Purple, rounded)             |
|                                          |
+------------------------------------------+
|                                          |
|  SECONDARY CONTENT (optional)            |
|  Quick link or community stat            |
|  Cyan accent underline                   |
|                                          |
+------------------------------------------+
|                                          |
|  FOOTER (Deep Purple background)         |
|  Unsubscribe | Privacy | Share           |
|  (c) Daily Living Labs                   |
|                                          |
+------------------------------------------+
```

---

## Mailchimp Setup Checklist

### Audience Configuration
- [ ] Create audience: "Daily Living Labs Community"
- [ ] Merge fields: `FNAME`, `SOURCE`, `ADL_INTEREST`, `ROLE` (caregiver/self/professional)
- [ ] Tags: stage tags (`stage:capture` through `stage:advocate`)
- [ ] Tags: interest tags (bathing, dressing, eating, mobility, etc.)

### Automations to Build
- [ ] Welcome series (3 emails, Capture stage)
- [ ] Nurture drip (weekly, behavior-triggered advancement)
- [ ] Cultivate invitations (bi-weekly, engagement-triggered)
- [ ] Convert nudges (behavioral trigger)
- [ ] Advocate activation (milestone trigger)

### Templates to Design
- [ ] Master template matching DLL brand
- [ ] Capture variant (warm, exploratory tone)
- [ ] Nurture variant (educational, trustworthy tone)
- [ ] Cultivate variant (participatory, exciting tone)
- [ ] Convert variant (action-oriented, clear tone)
- [ ] Advocate variant (celebratory, grateful tone)

### Integration Points (Future)
- [ ] Supabase edge function → Mailchimp API (landing page signup)
- [ ] Socratic agent completion → Mailchimp with tags (post-chat signup)
- [ ] dayliai.org account creation → update Mailchimp contact to `stage:convert`
- [ ] Solution published → trigger Advocate email to submitter

---

## Content Calendar — Month 1 Launch

| Week | Email | Stage | Subject Line |
|------|-------|-------|-------------|
| 1 | Welcome #1 | Capture | "Welcome to Daily Living Labs — here's what we're about" |
| 1 | Welcome #2 (day 3) | Capture | "What are ADLs? (And why they matter more than you think)" |
| 2 | Welcome #3 (day 7) | Capture | "Meet Rosa — how one $8 tool gave her mornings back" |
| 2 | First regular | Nurture | "Solution of the Week: the grab bar that installs in seconds" |
| 3 | Regular | Nurture | "3 dressing tips that changed everything for one caregiver" |
| 4 | Regular | Nurture | "Behind the Lab: students redesigning the shower experience" |

---

## Measuring Success

**Capture Stage:**
- Open rate on welcome series (target: 50%+)
- Quiz completion rate

**Nurture Stage:**
- Weekly open rate (target: 35%+)
- Click-through to solution stories

**Cultivate Stage:**
- Challenge submissions from newsletter readers
- Poll participation rate
- Event/call registrations

**Convert Stage:**
- dayliai.org account creation from newsletter CTAs
- Challenge submissions through Socratic agent

**Advocate Stage:**
- Referral signups (tracked via unique share links)
- Story co-authoring participation
- Newsletter shares / forwards

---

*This plan is a living document. As the community grows and the Socratic agent integration comes online, the stages will become increasingly automated — subscribers will flow through the infinity loop based on their actual behavior, not a fixed calendar.*
