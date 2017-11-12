import { Game, Pile } from '@dominion/game';
import { Card, CardConstructor } from '@dominion/card';
import {
  CardCollection,
  Copper, Silver, Gold, Platinum,
  Estate, Duchy, Province, Colony,
  Smithy
} from 'dominion/cards';

export class KingdomGenerator {
  constructor(private cardCollection: CardCollection) {

  }

  *initializeGame(game: Game) {
    const kingdom: CardConstructor[] = new Array();

    const isColonyGame = false;

    game.addPile(Pile.generate(Copper, 60 - 7 * game.players.length))
    game.addPile(Pile.generate(Silver, 40));
    game.addPile(Pile.generate(Gold, 30));
    if (isColonyGame) {
      game.addPile(Pile.generate(Platinum, 12));
    }

    const victoryPileSize = game.players.length <= 2 ? 8 : 12;

    game.addPile(Pile.generate(Estate, victoryPileSize));
    game.addPile(Pile.generate(Duchy, victoryPileSize));
    const provincePile = Pile.generate(Province, victoryPileSize);
    provincePile.endGameOnEmpty = true;
    game.addPile(provincePile);
    if (isColonyGame) {
      const colonyPile = Pile.generate(Colony, victoryPileSize);
      game.addPile(colonyPile);
    }

    game.addPile(Pile.generate(Smithy, 10));

    for (let player of game.players) {
      for (var i = 0; i < 7; i++) {
        player.discard.push(new Copper());
      }
      for (var i = 0; i < 3; i++) {
        player.discard.push(new Estate());
      }
    }

    yield 'kindom generated';

    for (let player of game.players) {
      for (var i = 0; i < 5; i++) {
        yield* player.drawCard();
      }
    }

  }
}

