import { test } from 'node:test';
import assert from 'node:assert/strict';
import { creditForBasis, proratedCredit } from './billing.ts';

test('a full cycle remaining returns the full price', () => {
  assert.equal(creditForBasis(3000, 30, 30), 3000);
});

test('half a cycle remaining returns half the price', () => {
  assert.equal(creditForBasis(3000, 15, 30), 1500);
});

test('no days remaining returns no credit', () => {
  assert.equal(creditForBasis(3000, 0, 30), 0);
});

test('days remaining beyond the basis are clamped to the full price', () => {
  assert.equal(creditForBasis(3000, 90, 30), 3000);
});

test('proratedCredit returns a non-negative credit within the full price for any tier', () => {
  for (const tier of ['enterprise', 'smb'] as const) {
    const credit = proratedCredit(tier, 3000, 10);
    assert.ok(credit >= 0 && credit <= 3000);
  }
});
