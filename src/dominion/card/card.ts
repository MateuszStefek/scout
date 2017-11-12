import { GamePlayer, Game, Pile } from '@dominion/game';
import * as _ from 'lodash';
import { CardPile } from './card.pile';

export abstract class Card {

  constructor(private _name: string) {}

  abstract basicCost(): number;

  isTreasure() : boolean {
    return false;
  }

  isAction() : boolean {
    return false;
  }

  isVictory() : boolean {
    return false;
  }

  scoreValue(): number {
    return 0;
  }

  *play(playerState: GamePlayer) {
    yield* this.preparePlay(playerState);

    playerState.playArea.push(this);

    yield* this.onPlay(playerState);
  }

  *preparePlay(playerState: GamePlayer) {
    yield('player ' + playerState.owner + ' plays ' + this);
    _.remove(playerState.hand, x => x === this);
    if (this.isAction()) {
      playerState.actions--;
    }
  }

  *onPlay(playerState: GamePlayer) {

  }

  *cleanupFromPlay(playerState: GamePlayer) {
    let self = playerState.playArea.find(x => x === this);
    if (self) {
      _.remove(playerState.playArea, x => x == this);
      playerState.discard.push(self);
      yield(`Player ${playerState.owner} discards ${self} from play`);
    } else {
      yield(`Player ${playerState.owner} lost track of ${self}, not cleaning up`);
    }
  }

  name() {
    return this._name;
  }

  toString() {
    return this.name();
  }
}

export interface CardConstructor {
  new() : Card;
}
