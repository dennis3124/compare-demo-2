# scoring-billing-utils

A small TypeScript utility library used by our scheduling and billing services.

## Modules

- **`src/tennis.ts`** — `TennisGame`, a stateful scorer for a single game. Tracks
  points for two players and renders the current score for display.
- **`src/billing.ts`** — `proratedCredit`, computes the prorated credit owed when a
  subscription changes mid-cycle.

## Develop

```bash
npm install
npm test        # run the unit tests
npm run build   # type-check
```
