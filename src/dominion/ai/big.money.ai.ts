import { Player } from '@dominion/game';
import {
  Silver, Gold,
  Province,
  Smithy,
  Curse
} from '@dominion/cards';
import { GamePlayer, Game } from '@dominion/game';
import { MayRevealCurseOnMountebank, MountebankUnderstandingPlayer } from '@dominion/cards/mountebank';

export class BigMoneyAI extends Player implements MountebankUnderstandingPlayer {
  private boughtSmithy = false;
  constructor(name: string) {
    super(name);
  }

  *playActions(state: GamePlayer) {
    while (state.actions > 0) {
      let smithy = state.hand.find(c => c instanceof Smithy);
      if (smithy) {
        yield* smithy.play(state);
      } else {
        return;
      }
    }
  }

  *playTreasures(state: GamePlayer) {
    while (true) {
      let treasure = state.hand.find(c => c.isTreasure());
      if (treasure) {
        yield* treasure.play(state);
      } else {
        break;
      }
    }
  }

  *buyCards(state: GamePlayer) : IterableIterator<string> {

    while (state.buys > 0) {
      yield (`Thinking. Buys: ${state.buys}, coins: ${state.coin}`);

      if (!this.boughtSmithy) {
        if (state.canBuy(Smithy)) {
          yield* state.buy(Smithy);
          this.boughtSmithy = true;
          continue;
        }
      }

      if (state.canBuy(Province)) {
        yield* state.buy(Province);
      } else if (state.canBuy(Gold)) {
        yield* state.buy(Gold);
      } else if (state.canBuy(Silver)) {
        yield* state.buy(Silver);
      } else {
        break;
      }
    }
  }

  *mayRevealCurseOnMountebank(state: GamePlayer) {
    if (state.hand.findIndex(x => x instanceof Curse)) {
      yield `Player ${this} reveals Curse`;
      return true;
    } else {
      yield `Player ${this} doesn't reveal Curse`;
      return false;
    }
  }

}
