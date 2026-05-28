# FOY-18 Scorecard: business-invariant gap validation

Fill in this table as you run the RUNBOOK. The decision criteria below interpret the result.

---

## Results

### Invariant A — Tennis scoring (`0/15/30/40` → `0/1/2/3`)

| Tool | Caught the regression? | Notes / verbatim quote |
|---|---|---|
| CodeRabbit | | |
| Greptile | | |
| Cursor Bugbot | | |
| Foyer — silent intent | | scope_alignment: ? / code_review: ? |
| Foyer — stated intent | | scope_alignment: ? / code_review: ? |

### Invariant B — Proration basis swap (enterprise↔SMB bases silently swapped)

| Tool | Caught the regression? | Notes / verbatim quote |
|---|---|---|
| CodeRabbit | | |
| Greptile | | |
| Cursor Bugbot | | |
| Foyer — silent intent | | scope_alignment: ? / code_review: ? |
| Foyer — stated intent | | scope_alignment: ? / code_review: ? |

---

## Decision criteria

**CodeRabbit / Greptile / Bugbot miss B →** Gap validated.
The proprietary rule lives only in domain knowledge; no public corpus helps.
Take the demo to the QA engineer + 3 peers. That's FOY-18's "Next action."

**CodeRabbit catches A but misses B →** It only had famous-domain heuristics (tennis), not real business-logic context.
The proprietary gap stands. Still validates the bet.

**All tools catch both A and B →** Premise is weaker than assumed.
Investigate *how* they caught B — did they infer from context or guess? Revisit before committing to the build.

**Foyer silent = miss, Foyer stated = catch →** (Expected)
Confirms today's blind spot AND that the judge mechanism already works.
FOY-18 reduces to "make the invariant *standing* so the author doesn't have to restate it every PR."

---

## What "caught" means

A tool **caught** the regression if it explicitly flags that the change breaks a
business rule / semantic invariant / expected behavior — not just that the code changed
or that a constant was modified. A comment like "you changed a constant value" is a
**miss**. A comment like "this changes the displayed score labels, which may break user
expectations if 0/15/30/40 is the correct tennis scoring sequence" is a **catch**.
