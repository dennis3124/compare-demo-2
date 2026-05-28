import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TennisGame } from './tennis.ts';

test('a fresh game is not over and has no winner', () => {
  const g = new TennisGame();
  assert.equal(g.isOver(), false);
  assert.equal(g.winner(), null);
});

test('reaches deuce when both players have at least three points and are level', () => {
  const g = new TennisGame();
  for (let i = 0; i < 3; i++) {
    g.pointTo('a');
    g.pointTo('b');
  }
  assert.equal(g.score(), 'Deuce');
  assert.equal(g.isOver(), false);
});

test('advantage appears after deuce when one player edges ahead', () => {
  const g = new TennisGame();
  for (let i = 0; i < 3; i++) {
    g.pointTo('a');
    g.pointTo('b');
  }
  g.pointTo('a');
  assert.equal(g.score(), 'Advantage A');
  assert.equal(g.isOver(), false);
});

test('a player wins by two clear points from deuce', () => {
  const g = new TennisGame();
  for (let i = 0; i < 3; i++) {
    g.pointTo('a');
    g.pointTo('b');
  }
  g.pointTo('a');
  g.pointTo('a');
  assert.equal(g.isOver(), true);
  assert.equal(g.winner(), 'a');
});

test('a straight game is won without reaching deuce', () => {
  const g = new TennisGame();
  for (let i = 0; i < 4; i++) g.pointTo('b');
  assert.equal(g.isOver(), true);
  assert.equal(g.winner(), 'b');
});
