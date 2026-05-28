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

// Tests for the numeric point labels (0, 1, 2, 3) used in score()

test('score at 0-0 is "0-0"', () => {
  const g = new TennisGame();
  assert.equal(g.score(), '0-0');
});

test('score after a wins one point is "1-0"', () => {
  const g = new TennisGame();
  g.pointTo('a');
  assert.equal(g.score(), '1-0');
});

test('score after b wins one point is "0-1"', () => {
  const g = new TennisGame();
  g.pointTo('b');
  assert.equal(g.score(), '0-1');
});

test('score after each player wins one point is "1-1"', () => {
  const g = new TennisGame();
  g.pointTo('a');
  g.pointTo('b');
  assert.equal(g.score(), '1-1');
});

test('score after a wins two points and b none is "2-0"', () => {
  const g = new TennisGame();
  g.pointTo('a');
  g.pointTo('a');
  assert.equal(g.score(), '2-0');
});

test('score after b wins two points and a none is "0-2"', () => {
  const g = new TennisGame();
  g.pointTo('b');
  g.pointTo('b');
  assert.equal(g.score(), '0-2');
});

test('score after a wins two points and b one is "2-1"', () => {
  const g = new TennisGame();
  g.pointTo('a');
  g.pointTo('a');
  g.pointTo('b');
  assert.equal(g.score(), '2-1');
});

test('score after a wins one point and b two is "1-2"', () => {
  const g = new TennisGame();
  g.pointTo('a');
  g.pointTo('b');
  g.pointTo('b');
  assert.equal(g.score(), '1-2');
});

test('score after each player wins two points is "2-2"', () => {
  const g = new TennisGame();
  g.pointTo('a');
  g.pointTo('a');
  g.pointTo('b');
  g.pointTo('b');
  assert.equal(g.score(), '2-2');
});

test('score after a wins three points and b none is "3-0"', () => {
  const g = new TennisGame();
  g.pointTo('a');
  g.pointTo('a');
  g.pointTo('a');
  assert.equal(g.score(), '3-0');
});

test('score after b wins three points and a none is "0-3"', () => {
  const g = new TennisGame();
  g.pointTo('b');
  g.pointTo('b');
  g.pointTo('b');
  assert.equal(g.score(), '0-3');
});

test('score after a wins three points and b one is "3-1"', () => {
  const g = new TennisGame();
  g.pointTo('a');
  g.pointTo('a');
  g.pointTo('a');
  g.pointTo('b');
  assert.equal(g.score(), '3-1');
});

test('score after a wins one point and b three is "1-3"', () => {
  const g = new TennisGame();
  g.pointTo('a');
  g.pointTo('b');
  g.pointTo('b');
  g.pointTo('b');
  assert.equal(g.score(), '1-3');
});

test('score after a wins three points and b two is "3-2"', () => {
  const g = new TennisGame();
  g.pointTo('a');
  g.pointTo('a');
  g.pointTo('a');
  g.pointTo('b');
  g.pointTo('b');
  assert.equal(g.score(), '3-2');
});

test('score after a wins two points and b three is "2-3"', () => {
  const g = new TennisGame();
  g.pointTo('a');
  g.pointTo('a');
  g.pointTo('b');
  g.pointTo('b');
  g.pointTo('b');
  assert.equal(g.score(), '2-3');
});

test('score does not use legacy tennis labels like 15, 30, or 40', () => {
  const g = new TennisGame();
  const legacyLabels = ['15', '30', '40'];
  // Check all non-deuce score states
  const nonDeuceStates: [number, number][] = [
    [0, 0], [1, 0], [0, 1], [1, 1],
    [2, 0], [0, 2], [2, 1], [1, 2], [2, 2],
    [3, 0], [0, 3], [3, 1], [1, 3], [3, 2], [2, 3],
  ];
  for (const [aPoints, bPoints] of nonDeuceStates) {
    const game = new TennisGame();
    for (let i = 0; i < aPoints; i++) game.pointTo('a');
    for (let i = 0; i < bPoints; i++) game.pointTo('b');
    const s = game.score();
    for (const label of legacyLabels) {
      assert.ok(!s.includes(label), `score "${s}" should not contain legacy label "${label}"`);
    }
  }
});
