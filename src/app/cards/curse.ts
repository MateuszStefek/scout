import { Card } from './card';

export class Curse extends Card {
  constructor() {
    super('Curse');
  }

  basicCost() { return 0; }
}
