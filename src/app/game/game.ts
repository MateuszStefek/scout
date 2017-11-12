import { Player } from '@scout/game/player';
import { Pile } from '@scout/game/pile';
import {
  Card, CardConstructor,
  Copper, Silver, Gold, Platinum,
  Curse,
  Estate, Duchy, Province, Colony,
  Smithy
} from '@scout/cards';

var arrayShuffle = require('array-shuffle');

export class GamePlayer {

  hand: Card[] = new Array();
  deck: Card[] = new Array();
  discard: Card[] = new Array();
  playArea: Card[] = new Array();

  actions: number = 0;
  buys: number = 0;
  coin: number = 0;

  constructor(public owner: Player, public game: Game) {

  }

  *drawCard() {
    if (this.deck.length == 0) {
      yield `Player ${this.owner} shuffles deck`;
      this.deck = arrayShuffle(this.discard);
      this.discard = new Array();
    }
    if (this.deck.length == 0) {
      yield 'Cannot draw as there are no more cards available';
      return;
    }
    const card = this.deck.pop();
    this.hand.push(card);
    yield `Player ${this.owner} draws ${card}`;
  }

  *addCoin(x: number) {
    this.coin += x;

    yield `Player ${this.owner} receives ${x} $`;
  }

  *playTurn() {
    this.actions = 1;
    this.buys = 1;
    this.coin = 0;

    yield* this.actionPhase();
    yield* this.buyPhase();
    yield* this.cleanupPhase();
  }

  *actionPhase() {
    yield* this.owner.playActions(this);
  }

  *buyPhase() {
    yield* this.owner.playTreasures(this);
    yield* this.owner.buyCards(this);
  }

  *cleanupPhase() {
    this.discard.push(...this.hand);
    this.hand = new Array();
    let cardsToCleanup = this.playArea.slice();

    for (let card of cardsToCleanup) {
      yield* card.cleanupFromPlay(this);
    }

    yield* this.endTurn();
  }

  *endTurn() {
    var cardsToDraw = 5;
    for (var i = 0; i < cardsToDraw; i++) {
      yield* this.drawCard();
    }
  }

  canBuy(cardType: CardConstructor): Pile {
    if (this.buys <= 0) {
      return undefined;
    }
    for (let pile of this.game.kingdomPiles) {
      if (pile.isEmpty()) {
        continue;
      }
      const topCard = pile.topCard();
      if (!(topCard instanceof cardType)) {
        continue;
      }
      if (this.game.buyCost(topCard) >= this.coin) {
        return undefined;
      }
      return pile;
    }
    return undefined;
  }

  *buy(pile: Pile) {
    const card = pile.removeTop();
    this.coin -= this.game.buyCost(card);
    this.buys--;
    yield `Player ${this.owner} buys ${card}`;
    yield* this.gain(card);
  }

  *gain(card: Card) {
    this.discard.push(card);
    yield(`Player ${this.owner} gains ${card}`);
  }

}

export class Game {
  players: GamePlayer[];
  kingdomPiles: Pile[] = new Array();

  constructor(players: Player[]) {
    this.players = players.map(player => new GamePlayer(player, this))
  }

  *play(): IterableIterator<String> {
    yield* this.selectKingdom();
    yield* this.playGame();
  }

  *selectKingdom() {
    const kingdom: CardConstructor[] = new Array();

    const isColonyGame = false;

    this.kingdomPiles.push(Pile.generate(Copper, 60 - 7 * this.players.length))
    this.kingdomPiles.push(Pile.generate(Silver, 40));
    this.kingdomPiles.push(Pile.generate(Gold, 30));
    if (isColonyGame) {
      this.kingdomPiles.push(Pile.generate(Platinum, 12));
    }

    const victoryPileSize = this.players.length <= 2 ? 8 : 12;

    this.kingdomPiles.push(Pile.generate(Estate, victoryPileSize));
    this.kingdomPiles.push(Pile.generate(Duchy, victoryPileSize));
    const provincePile = Pile.generate(Province, victoryPileSize);
    provincePile.endGameOnEmpty = true;
    this.kingdomPiles.push(provincePile);
    if (isColonyGame) {
      const colonyPile = Pile.generate(Colony, victoryPileSize);
      this.kingdomPiles.push(colonyPile);
    }

    this.kingdomPiles.push(Pile.generate(Smithy, 10));

    for (let player of this.players) {
      for (var i = 0; i < 7; i++) {
        player.discard.push(new Copper());
      }
      for (var i = 0; i < 3; i++) {
        player.discard.push(new Estate());
      }
    }

    yield 'kindom generated';

    for (let player of this.players) {
      for (var i = 0; i < 5; i++) {
        yield* player.drawCard();
      }
    }

  }

  isOver(): boolean {
    var emptyPiles = 0;
    for (let pile of this.kingdomPiles) {
      if (pile.isEmpty()) {
        emptyPiles++;
        if (emptyPiles >= 3) {
          return true;
        }
        if (pile.endGameOnEmpty) {
          return true;
        }
      }
    }
    return false;
  }

  *countScore() {

  }

  *playGame() {
    var turnCounter = 0;



    while (true) {
      turnCounter++;
      for (let player of this.players) {
        yield (`Player ${player.owner} turn ${turnCounter}`);
        yield* player.playTurn();

        if (this.isOver()) {
          yield `Game over in turn ${turnCounter}`;
          return;
        }
      }

      if (turnCounter > 26) {
        yield 'Game too long';
        return;
      }
    }


  }

  buyCost(card: Card): number {
    return card.basicCost();
  }

}
