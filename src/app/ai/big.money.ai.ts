import { Player } from '@scout/game';
import { Card, CardConstructor } from '@scout/cards';
import {
  Silver, Gold,
  Province,
  Smithy

} from '@scout/cards';
import { GamePlayer, Game } from '@scout/game';

export class BigMoneyAI extends Player {
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
      var selectedPile;

      if (!this.boughtSmithy) {
        selectedPile = state.canBuy(Smithy);
        if (selectedPile) {
          yield* state.buy(selectedPile);
          this.boughtSmithy = true;
          continue;
        }
      }

      selectedPile = state.canBuy(Province) || state.canBuy(Gold) || state.canBuy(Silver);
      if (selectedPile) {
        yield* state.buy(selectedPile);
      } else {
        break;
      }
    }
  }



}
