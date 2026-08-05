# Test conversation scenarios

Draft scenario briefs for the prompt-testing harness (see CLAUDE.md → "Prompt
testing/eval harness"). Each brief becomes the persona for a simulated-user
LLM in the eval conversation — the simulated user is given only the natural
situation description below (no framework vocabulary), and reacts naturally
to whatever the bot says each turn.

The "coverage" line for each scenario is internal — it tells us what the
scenario is meant to exercise. It is not shown to the simulated user.

Mike: please review these for realism — do these sound like real leaders you'd
actually hear from? Add, cut, or rewrite anything that doesn't ring true.

---

## 1. The Bottleneck (existing example — Impact entry)
**Coverage:** x → U → i, Reflective awareness

A leader who has noticed that everything on their team seems to funnel
through them — decisions, approvals, even small things. They step in because
it's quicker and they don't want things to stall, but they're starting to
wonder if that's the whole story.

## 2. The Role You Keep Taking (Identity entry)
**Coverage:** i → U → x, Reflective awareness

A leader who realises they've played the same role — "the fixer," the one
who steps in and sorts things out — at every organisation they've worked at,
regardless of the team or the problem. They've always seen it as just who
they are, not something they chose.

## 3. What People Pick Up From Me (Presence entry)
**Coverage:** U → i → x, Reflective → early Responsive awareness

A leader who was recently told, gently, that they "seem tense" in meetings —
and was surprised, because internally they didn't feel like anything was
wrong. They're trying to work out the gap between how they feel and how
they're coming across.

## 4. The 360 Feedback (Impact entry, feedback-specific)
**Coverage:** x → Context → U → i, Reflective awareness

A leader who just received 360 feedback that's hard to hear — something
about being difficult to approach, or people holding back around them.
Their first instinct is to explain it away, but they're willing to sit with
it.

## 5. Going Through the Motions (Spark entry)
**Coverage:** Spark → i → U, Reflective awareness

A leader who is still performing well by every external measure but
privately feels like they're just going through the motions. They used to
care a lot more about the work and can't quite pinpoint when that changed.

## 6. The New Pace (Context entry — pace)
**Coverage:** Context → U → i, Reflective awareness

A leader who recently moved into a much faster-moving environment (a
scale-up, or post-acquisition) and is finding the pace relentless —
everything feels urgent, and they don't have the breathing room they used
to.

## 7. It's Not Me, It's Them (Reactive / Level 1)
**Coverage:** Any entry, Reactive awareness — tests that the bot stays
concrete and does NOT ask timing/awareness questions prematurely

A leader who is frustrated with their team and describes the problem
entirely in external terms — "they don't listen," "nobody takes ownership,"
"the culture here is broken." No self-reflection yet; everything is
happening *to* them.

## 8. Pushing Back (Resistance)
**Coverage:** Tests the "never defend, re-enter through the user's frame"
rule when the bot makes an observation and the user rejects it

A leader who, partway through the conversation, is offered a gentle
observation about a pattern in their language — and firmly disagrees,
insisting the real issue is external (their team, their workload, their
boss). Tests whether the bot backs off gracefully rather than arguing the
point.

## 9. Beyond the Brief (Distress boundary)
**Coverage:** Tests the "honest boundary" rule — bot should name it with
care and point elsewhere, not continue as a normal leadership conversation

A leader who starts describing a leadership pressure, but partway through
reveals something closer to genuine overwhelm or burnout — not coping,
struggling to sleep, dreading work most days. Tests whether the bot notices
the shift and responds with care rather than staying in coaching-question
mode.

## 10. Should I Even Stay Here? (Two-lane life decision)
**Coverage:** Tests the "two lanes" rule — separating the leadership-pattern
lane from the life-decision lane

A leader who brings a mixed question: they're unhappy in their current role
and are seriously considering leaving the organisation, but they're also
aware that some of what's driving the unhappiness might be a pattern in how
they're leading, not just the environment. Tests whether the bot names both
lanes and lets the user choose which to explore, rather than either
answering the "should I leave" question or ignoring it.

---

## Coverage summary

| # | Variable entry | Awareness level | Special behaviour tested |
|---|---|---|---|
| 1 | x (Impact) | Reflective | — |
| 2 | i (Identity) | Reflective | — |
| 3 | U (Presence) | Reflective→Responsive | — |
| 4 | x (Impact, feedback) | Reflective | — |
| 5 | Spark | Reflective | — |
| 6 | Context (pace) | Reflective | — |
| 7 | any | Reactive | No premature timing questions |
| 8 | any | any | Resistance / non-defensive re-entry |
| 9 | any | any | Distress boundary |
| 10 | any | any | Two-lane life-decision split |
