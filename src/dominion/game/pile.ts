import { Card, CardConstructor } from '@dominion/card';

export class Pile {
  private cards: Card[] = new Array();
  endGameOnEmpty: boolean = false;

  static generate(cardType: CardConstructor, size: number) {
    const pile = new Pile();
    for (var i = 0; i < size; i++) {
      pile.put(new cardType())
    }
    return pile;
  }

  allCards() {
    return this.cards;
  }

  put(card: Card) {
    this.cards.push(card);
  }

  removeTop(): Card {
    return this.cards.pop();
  }

  isEmpty(): boolean {
    return this.cards.length == 0;
  }

  topCard() {
    if (this.cards.length == 0) {
      return undefined;
    } else {
      return this.cards[this.cards.length - 1];
    }
  }
}
