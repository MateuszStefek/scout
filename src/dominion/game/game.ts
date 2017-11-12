import { Player } from '@dominion/game/player';
import { Pile } from '@dominion/game/pile';
import { KingdomGenerator } from '@dominion/game/generator';
import { Card, CardConstructor } from '@dominion/card';
import {
  Copper, Silver, Gold, Platinum,
  Curse,
  Estate, Duchy, Province, Colony,
  Smithy,
} from '@dominion/cards';
import * as arrayShuffle from 'array-shuffle';

export class GamePlayer {
  nextPlayer: GamePlayer;

  hand: Card[] = new Array();
  deck: Card[] = new Array();
  discard: Card[] = new Array();
  playArea: Card[] = new Array();

  actions: number = 0;
  buys: number = 0;
  coin: number = 0;

  constructor(public owner: Player, public game: Game) {

  }

  *eachOtherPlayer() {
    var other = this.nextPlayer;
    while (other !== this) {
      yield other;
      other = other.nextPlayer;
    }
  }

  *allOwnedCards() {
    yield* this.hand;
    yield* this.discard;
    yield* this.deck;
    yield* this.playArea;
  }

  score(): number {
    var c = 0;
    for (let card of this.allOwnedCards()) {
      c += card.scoreValue();
    }
    return c;
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

  canBuy(cardType: CardConstructor): boolean {
    if (this.buys <= 0) {
      return false;
    }
    let pile = this.game.pileOf(cardType);
    if (!pile) {
      return false;
    }
    if (pile.isEmpty()) {
      return false;
    }
    const topCard = pile.topCard();
    if (!(topCard instanceof cardType)) {
      return false;
    }
    if (this.game.buyCost(topCard) >= this.coin) {
      return false;
    }
    return true;
  }

  *buy(cardType: CardConstructor) {
    const pile = this.game.pileOf(cardType);
    if (!pile || pile.isEmpty() || !(pile.topCard() instanceof cardType)) {
      return;
    }
    const card = pile.topCard();
    this.coin -= this.game.buyCost(card);
    this.buys--;
    yield `Player ${this.owner} buys ${card}`;
    yield* this.gainFromPile(pile);
  }

  *gain(cardType: CardConstructor) {
    const pile = this.game.pileOf(cardType);
    if (pile) {
      yield* this.gainFromPile(pile);
    }
  }

  *gainFromPile(pile: Pile) {
    if (pile.isEmpty()) {
      return;
    }
    const card = pile.removeTop();
    this.discard.push(card);
    yield (`Player ${this.owner} gains ${card}`);
  }

}

export class Game {
  players: GamePlayer[];
  kingdomPiles: Pile[] = new Array();
  private pilesPerCard: Map<CardConstructor, Pile> = new Map();

  constructor(players: Player[]) {
    const numberOfPlayers = players.length;
    this.players = players.map(player => new GamePlayer(player, this))
    for (let i = 0; i < numberOfPlayers; i++) {
      this.players[i].nextPlayer = this.players[(i + 1) % numberOfPlayers];
    }
  }

  addPile(pile: Pile) {
    this.kingdomPiles.push(pile);
    for (let card of pile.allCards()) {
      this.pilesPerCard.set(<CardConstructor>card.constructor, pile);
    }
  }

  pileOf(cardType: CardConstructor): Pile {
    return this.pilesPerCard.get(cardType);
  }

  *play(generator: KingdomGenerator): IterableIterator<String> {
    yield* generator.initializeGame(this);
    yield* this.playGame();
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
          yield* this.countFinalScore();
          return;
        }
      }

      if (turnCounter > 26) {
        yield 'Game too long';
        return;
      }
    }
  }

  *countFinalScore() {
    for (let player of this.players) {
      yield `player ${player.owner} scores: ${player.score()}`
    }
  }

  buyCost(card: Card): number {
    return card.basicCost();
  }

}
