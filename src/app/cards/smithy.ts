import { Card } from './card';
import { GamePlayer } from '@scout/game';
import * as _ from 'lodash';

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
