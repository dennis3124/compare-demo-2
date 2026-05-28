export type Tier = 'enterprise' | 'smb';

/** Number of days in the calendar month containing `when` (defaults to now). */
export function daysInCurrentCalendarMonth(when: Date = new Date()): number {
  return new Date(when.getFullYear(), when.getMonth() + 1, 0).getDate();
}

/**
 * Prorated credit, in cents, for `daysRemaining` unused days of a cycle whose
 * full term is `basisDays` long and whose full price is `monthlyCents`.
 */
export function creditForBasis(
  monthlyCents: number,
  daysRemaining: number,
  basisDays: number,
): number {
  const clamped = Math.max(0, Math.min(daysRemaining, basisDays));
  return Math.round((monthlyCents * clamped) / basisDays);
}

/** Credit owed when a subscription on `tier` is cancelled with days left in the cycle. */
export function proratedCredit(
  tier: Tier,
  monthlyCents: number,
  daysRemaining: number,
): number {
  const basisDays = tier === 'enterprise' ? 30 : daysInCurrentCalendarMonth();
  return creditForBasis(monthlyCents, daysRemaining, basisDays);
}
