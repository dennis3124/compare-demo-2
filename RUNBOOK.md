# FOY-18 Runbook: Business-invariant regression demo

This runbook walks through the FOY-18 premise-validation experiment.
The goal is to confirm whether AI PR-review tools (CodeRabbit, Greptile, Cursor Bugbot)
catch business-logic regressions when the rule is **not written down anywhere in the
repo** — no test, no comment, no config file.

## Two invariants under test

| # | Rule (lives only in domain knowledge) | Breaking change |
|---|---|---|
| A | Tennis points display as `0 / 15 / 30 / 40` | Labels rewritten to `0 / 1 / 2 / 3` |
| B | Enterprise subscriptions prorate on **calendar-month** basis; SMB on **30-day rolling** | The two bases are silently swapped |

Invariant A uses public domain knowledge (tennis); a frontier model might flag it just
because it *knows* tennis. **Invariant B is the decisive test**: the per-tier basis is
completely proprietary — no public corpus can rescue a reviewer here.

---

## Step 1 — Push the demo repo to GitHub

```bash
cd ~/Desktop/projects/foy-18-invariant-demo

# Create a public repo on GitHub (GitHub CLI)
gh repo create foy-18-invariant-demo --public --source=. --remote=origin --push

# Or manually:
#   git remote add origin git@github.com:<you>/foy-18-invariant-demo.git
#   git push -u origin main
```

---

## Step 2 — Install the review bots

For each tool you want to compare:

**CodeRabbit** (free for public repos)
- Go to https://coderabbit.ai → Install GitHub App → select `foy-18-invariant-demo`
- Do **NOT** create a `.coderabbit.yaml` — the point is intrinsic knowledge, not configured rules

**Greptile** (free trial)
- Go to https://greptile.com → Connect GitHub → select the repo

**Cursor Bugbot**
- Enable in Cursor settings → GitHub integration

---

## Step 3 — Open the breaking PRs

For each invariant, open a PR with an innocuous refactor title. The PR body says nothing about the rule.

### Invariant A: tennis scoring

```bash
git checkout -b demo/tennis-labels
git apply diffs/tennis-scoring.diff
git add src/tennis.ts
git commit -m "Simplify point label formatting"
git push -u origin demo/tennis-labels
gh pr create --title "Simplify point label formatting" \
  --body "Minor cleanup to how point labels are stored in the scoring module." \
  --base main
```

### Invariant B: proration basis swap

```bash
git checkout main
git checkout -b demo/proration-basis
git apply diffs/proration-swap.diff
git add src/billing.ts
git commit -m "Refactor proration basis selection"
git push -u origin demo/proration-basis
gh pr create --title "Refactor proration basis selection" \
  --body "Simplifies the conditional logic in the proration calculator." \
  --base main
```

---

## Step 4 — Capture each tool's review

Wait for each bot to post its review (usually 1–5 minutes). For each PR × tool:

1. Screenshot the bot's review comment
2. Copy the exact text of the comment into `SCORECARD.md` under the relevant cell
3. Note: did it flag **the semantic regression**, a **different nit**, or **nothing**?

Close / delete the PRs when done (they're throwaway; the branches can be deleted too).

---

## Step 5 — Foyer baseline via eval:diff

Run the existing `eval:diff` harness against each diff, twice per diff: once with
**silent intent** (the PR body says nothing about the rule) and once with **stated
intent** (the rule is explicit in the PR body).

From `~/Desktop/projects/foyer/api`:

### Invariant A — silent intent (mirrors the real CodeRabbit PR)
```bash
yarn eval:diff \
  --path ../../foy-18-invariant-demo/diffs/tennis-scoring.diff \
  --no-workspace \
  --pr-title "Simplify point label formatting" \
  --pr-body "Minor cleanup to how point labels are stored in the scoring module." \
  --json 2>/dev/null | jq '{scope_alignment: .signals[] | select(.key=="scope_alignment") | {status, summary}, code_review: .signals[] | select(.key=="code_review") | {status, summary}}'
```

### Invariant A — stated intent (proves the mechanism works)
```bash
yarn eval:diff \
  --path ../../foy-18-invariant-demo/diffs/tennis-scoring.diff \
  --no-workspace \
  --pr-title "Simplify point label formatting" \
  --pr-body "Tennis points must display as 0, 15, 30, 40. This refactor preserves those labels." \
  --json 2>/dev/null | jq '{scope_alignment: .signals[] | select(.key=="scope_alignment") | {status, summary}, code_review: .signals[] | select(.key=="code_review") | {status, summary}}'
```

### Invariant B — silent intent
```bash
yarn eval:diff \
  --path ../../foy-18-invariant-demo/diffs/proration-swap.diff \
  --no-workspace \
  --pr-title "Refactor proration basis selection" \
  --pr-body "Simplifies the conditional logic in the proration calculator." \
  --json 2>/dev/null | jq '{scope_alignment: .signals[] | select(.key=="scope_alignment") | {status, summary}, code_review: .signals[] | select(.key=="code_review") | {status, summary}}'
```

### Invariant B — stated intent
```bash
yarn eval:diff \
  --path ../../foy-18-invariant-demo/diffs/proration-swap.diff \
  --no-workspace \
  --pr-title "Refactor proration basis selection" \
  --pr-body "Enterprise subscriptions must prorate on a calendar-month basis. SMB subscriptions use a fixed 30-day window. This refactor must preserve that distinction." \
  --json 2>/dev/null | jq '{scope_alignment: .signals[] | select(.key=="scope_alignment") | {status, summary}, code_review: .signals[] | select(.key=="code_review") | {status, summary}}'
```

> **Note:** if `eval:diff` needs `--repo-url` / `--head-sha` under `--no-workspace`, pass
> any valid values:
> `--repo-url https://github.com/you/foy-18-invariant-demo --head-sha HEAD`

Record the `scope_alignment.status` and `code_review.status` (passed / failed / unavailable)
in `SCORECARD.md`.

---

## Step 6 — Read the scorecard

Fill in `SCORECARD.md` and let the decision criteria interpret the result.
