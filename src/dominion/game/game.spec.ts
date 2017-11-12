import { Game } from './game'
import { Player } from './player'
import { BigMoneyAI } from '@dominion/ai';
import { KingdomGenerator } from '@dominion/game/generator';
import { CardRegistry } from '@dominion/cards/card.registry';

describe("Game", () => {
  it("Should simulate game (not really a test)", () => {
    const p1 = new BigMoneyAI('A');
    const p2 = new BigMoneyAI('B');
    const g = new Game([p1, p2]);

    const generator = new KingdomGenerator(CardRegistry.ALL);

    var c = 0;

    const gameLog = new Array();

    for (let d of g.play(generator)) {
      gameLog.push(d);
      c++;
      if (c > 5000) {
        //Probably an infinite loop
        break;
      }
    }

    console.log(gameLog);
  })
})
