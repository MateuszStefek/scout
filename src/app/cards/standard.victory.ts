import { Card } from './card'

export class Estate extends Card {
  constructor() {
    super('Estate');
  }

  basicCost() { return 2 }
}

export class Duchy extends Card {
  constructor() {
    super('Duchy');
  }

  basicCost() { return 5 }
}

export class Province extends Card {
  constructor() {
    super('Province');
  }

  basicCost() { return 8 }
}

export class Colony extends Card {
  constructor() {
    super('Colony');
  }

  basicCost() { return 11 }
}
