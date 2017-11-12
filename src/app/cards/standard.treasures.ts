import { Card } from './card';
import { GamePlayer, Game } from '@scout/game';

export abstract class StandardTreasure extends Card {
  constructor(name: string, private payment: number) {
    super(name);
  }

  isTreasure() {
    return true;
  }

  *onPlay(player: GamePlayer) {
    yield* player.addCoin(this.payment);
  }
}

export class Copper extends StandardTreasure {
  constructor() {
    super('Copper', 1);
  }

  basicCost() { return 0 }
}

export class Silver extends StandardTreasure {
  constructor() {
    super('Silver', 2);
  }
  basicCost() { return 3 }
}

export class Gold extends StandardTreasure {
  constructor() {
    super('Gold', 3);
  }

  basicCost() { return 6 }
}

export class Platinum extends StandardTreasure {
  constructor() {
    super('Platinum', 5);
  }

  basicCost() { return 9 }
}
