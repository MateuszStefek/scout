import { Card, CardConstructor, StandardPile } from '@dominion/card';
import { GamePlayer, Player } from '@dominion/game';
import * as _ from 'lodash';
import { CardRegistry } from '@dominion/cards/card.registry';
import { Curse } from './curse';
import { Copper } from '@dominion/cards';

export class Mountebank extends Card {
  constructor() {
    super("Mountebank");
  }

  basicCost() {
    return 5;
  }

  isAction() {
    return true;
  }

  *onPlay(playerState: GamePlayer) {
    for (let otherPlayer of playerState.eachOtherPlayer()) {
      const op: MountebankUnderstandingPlayer = <any>otherPlayer.owner;
      const revealed = yield*
        (op.mayRevealCurseOnMountebank || Mountebank.defaultMayRevealCurseOnMountebankBehavior)
          (playerState);

      if (!revealed) {
        yield* playerState.gain(Curse);
        yield* playerState.gain(Copper);
      }
    }
  }

  static *defaultMayRevealCurseOnMountebankBehavior(player: GamePlayer) {
    return false;
  }

}

export interface MayRevealCurseOnMountebank {
  (state: GamePlayer): IterableIterator<any>;
}

export interface MountebankUnderstandingPlayer extends Player {
  mayRevealCurseOnMountebank(state: GamePlayer): IterableIterator<any>;
}


