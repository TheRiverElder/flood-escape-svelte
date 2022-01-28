import type { Game } from "../../Game";
import type { GameGenerator } from "../../TerrainGenerator";

export interface WallTerrainGeneratorParameters {
    wallAltitude: number;
    wallRadius: number;
}

export class WallTerrainGenerator implements GameGenerator {

    private parameters: WallTerrainGeneratorParameters;
    constructor(parameters: WallTerrainGeneratorParameters) {
        this.parameters = parameters;
    }

    generate(game: Game): void {
        const { wallAltitude, wallRadius } = this.parameters;

        const cx = Math.floor(game.width / 2);
        const cy = Math.floor(game.height / 2);
        // const r = Math.floor(wallRadius);

        game.tiles.forEach(({ x, y, terrain }) => {
            if (Math.abs(Math.round(Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2))) - wallRadius) < 0.01) {
                terrain.altitude = wallAltitude;
            }
        });
    }

}