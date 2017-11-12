import { GamePlayer, Game} from '@scout/game';

export class Player {
  constructor(public name: string) { }

  toString() {
    return '[' + this.name + ']';
  }

  *playActions(state: GamePlayer) {

  }

  *playTreasures(state: GamePlayer): IterableIterator<String> {
    yield('playing treasures:default');
    // default implementation does nothing
  }

  *buyCards(state: GamePlayer): IterableIterator<String> {
    yield('buying cards: default');
  }

}
