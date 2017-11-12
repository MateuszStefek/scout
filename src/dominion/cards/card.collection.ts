import { CardConstructor, CardPile, StandardPile } from "@dominion/card";
import * as Random from "random-js";

export class CardCollection {
  private selectablePiles: CardPile[] = new Array();

  registerStandardPile(cardType: CardConstructor) {
    this.selectablePiles.push(new StandardPile(cardType))
  }

  pickRandomPile(randomEngine: Random.Engine): CardPile {
    return Random.pick(randomEngine, this.selectablePiles);
  }
}


