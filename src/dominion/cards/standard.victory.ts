import { Card } from '@dominion/card';

class StandardVictory extends Card {
  constructor(name: string, private vp: number, private cost: number) {
    super(name);
  }

  isVictory() {
    return true;
  }

  basicCost() {
    return this.cost;
  }

  scoreValue() {
    return this.vp;
  }
}

export class Estate extends StandardVictory {
  constructor() {
    super('Estate', 1, 2);
  }
}

export class Duchy extends StandardVictory {
  constructor() {
    super('Duchy', 3, 5);
  }
}

export class Province extends StandardVictory {
  constructor() {
    super('Province', 6, 8);
  }

}

export class Colony extends StandardVictory {
  constructor() {
    super('Colony', 10, 11);
  }

}
