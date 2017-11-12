import { Game } from './game'
import { Player } from './player'
import { BigMoneyAI } from '@scout/ai';

describe("Game", () => {
  it("sss", () => {
    const p1 = new BigMoneyAI('A');
    const p2 = new BigMoneyAI('B');
    const g = new Game([p1, p2]);

    var c = 0;
    for (let d of g.play()) {
      console.log(d);
      c++;
      if (c > 1900) {
        break;
      }
    }
  })
})
