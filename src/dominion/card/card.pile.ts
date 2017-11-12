import { Card, CardConstructor } from './card';
import { Pile, Game } from '@dominion/game';

/**
 * Represents a pile of cards you can initialize your game.
 *
 * Most of the time a pile is just defined by a Card itself, but for special cases, like Knights, the logic can be more complex;
 */
export abstract class CardPile {
  abstract name(): string;
  abstract initializePile(numberOfPlayers: number): Pile;
  abstract postInitialize(game: Game): IterableIterator<any>;
};

export class StandardPile implements CardPile {
  constructor(private cardType: CardConstructor) {
  }

  name() {
    return null;
  }

  initializePile(numberOfPlayers: number) {
    const p = new Pile();
    for (var i = 0; i < this.initialPileSize(numberOfPlayers); i++) {
      p.put(new this.cardType());
    }
    return p;
  }

  initialPileSize(numberOfPlayers: number): number {
    const exampleCard = new this.cardType();
    if (exampleCard.isVictory()) {
      return numberOfPlayers > 2 ? 12 : 8;
    } else {
      return 10;
    }
  }

  *postInitialize(game: Game) {

  }
}
