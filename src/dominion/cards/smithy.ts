import { Card, CardConstructor, StandardPile } from '@dominion/card';
import { GamePlayer } from '@dominion/game';
import { CardRegistry } from '@dominion/cards/card.registry';


export class Smithy extends Card {
  constructor() {
    super('Smithy');
  }

  basicCost() { return 4 }

  isAction() { return true; }

  *onPlay(player: GamePlayer) {
    for (var i = 0; i < 3; i++) {
      yield* player.drawCard();
    }
  }
}

CardRegistry.ALL.registerStandardPile(Smithy);
