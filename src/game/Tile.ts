import type { Game } from "./Game";
import type { Structure } from "./Structure";
import { Terrain } from "./Terrain";
import { constraints } from "./utils";

export class Tile {
    
    game: Game;
    x: number;
    y: number;
    terrain: Terrain;
    structure: Structure;

    constructor(game: Game, x: number, y: number) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.terrain = new Terrain(0);
        this.structure = null;
    }

    tick() {
        if (this.structure) {
            this.structure.tick(this);
        }
    }

    evenify() {
        const relativeTiles = [this.left, this.right, this.up, this.down].filter(it => !!it);
        if (relativeTiles.length === 0) return;

        relativeTiles.sort((a, b) => a.terrain.level - b.terrain.level)

        const costWater = constraints(this.terrain.level - relativeTiles[0].terrain.level, 0, this.terrain.water);
        let restWater = costWater;

        const finalDeltaWaters = relativeTiles.map(() => 0);
        let thisDeltaWater = 0;
        for (let i = 0; i < relativeTiles.length && restWater > 0; i++) {
            const tile = relativeTiles[i];
            const nextTile = relativeTiles[i + 1];
            let p = 0;
            if (nextTile) {
                const gap = nextTile.terrain.level - tile.terrain.level;
                const water = Math.min(gap * (i + 2), restWater);
                restWater -= water;
                p = water / (i + 2);
            } else {
                p = restWater / (i + 2);
                restWater = 0;
            }
            for (let j = 0; j <= i; j++) {
                finalDeltaWaters[j] += p;
            }
            thisDeltaWater += p;
        }

        relativeTiles.forEach((tile, i) => tile.terrain.water += finalDeltaWaters[i]);
        this.terrain.water = this.terrain.water - costWater + thisDeltaWater;
    }

    get left() { return this.game.getTile(this.x - 1, this.y) }
    get right() { return this.game.getTile(this.x + 1, this.y) }
    get up() { return this.game.getTile(this.x, this.y - 1) }
    get down() { return this.game.getTile(this.x, this.y + 1) }
}