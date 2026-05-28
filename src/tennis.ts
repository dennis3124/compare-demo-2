export type PlayerId = 'a' | 'b';

const POINT_LABELS = ['0', '15', '30', '40'];

export class TennisGame {
  private points: Record<PlayerId, number> = { a: 0, b: 0 };

  pointTo(player: PlayerId): void {
    this.points[player] += 1;
  }

  /** True once a player has won the game. */
  isOver(): boolean {
    const { a, b } = this.points;
    return (a >= 4 || b >= 4) && Math.abs(a - b) >= 2;
  }

  winner(): PlayerId | null {
    if (!this.isOver()) return null;
    return this.points.a > this.points.b ? 'a' : 'b';
  }

  /** Human-readable score line for the scoreboard. */
  score(): string {
    const { a, b } = this.points;

    if (a >= 3 && b >= 3) {
      if (a === b) return 'Deuce';
      const leader: PlayerId = a > b ? 'a' : 'b';
      if (Math.abs(a - b) === 1) return `Advantage ${leader.toUpperCase()}`;
      return `Game ${leader.toUpperCase()}`;
    }

    return `${POINT_LABELS[a]}-${POINT_LABELS[b]}`;
  }
}
