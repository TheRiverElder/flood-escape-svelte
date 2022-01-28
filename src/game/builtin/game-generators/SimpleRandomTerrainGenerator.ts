import type { Game } from "../../Game";
import type { GameGenerator } from "../../TerrainGenerator";
import { array, rand } from "../../utils";

export interface SimpleRandomTerrainGeneratorParameters {
    initGridSize: number;
    initMaxWaterLevel: number;
}

export class SimpleRandomTerrainGenerator implements GameGenerator {

    private grid: number[][];

    private parameters: SimpleRandomTerrainGeneratorParameters;
    constructor(parameters: SimpleRandomTerrainGeneratorParameters) {
        this.parameters = parameters;
    }

    generate(game: Game): void {
        this.setupGrid(game.width, game.height);

        game.tiles.forEach(({ x, y, terrain}) => (terrain.altitude = this.getGridValueAt(x, y)));

        this.clearGrid();
    }

    setupGrid(gameMapWidth: number, gameMapHeight: number) {
        const { initGridSize, initMaxWaterLevel } = this.parameters;

        const gridWidth = Math.floor(gameMapWidth / initGridSize) + 2;
        const gridheight = Math.floor(gameMapHeight / initGridSize) + 2;
        this.grid = array(gridheight, () => array(gridWidth, () => rand(1, 0.8 * initMaxWaterLevel)));
    }

    getGridValueAt(x: number, y: number): number {
        const gridSize = this.parameters.initGridSize;

        const gridX0 = Math.floor(x / gridSize);
        const gridY0 = Math.floor(y / gridSize);
        const gridX1 = gridX0 + 1;
        const gridY1 = gridY0 + 1;
        const dx0 = x % gridSize / gridSize;
        const dx1 = 1 - dx0;
        const dy0 = y % gridSize / gridSize;
        const dy1 = 1 - dy0;

        const altitude = Math.floor(
            dx1 * (dy1 * this.grid[gridY0][gridX0] + dy0 * this.grid[gridY1][gridX0]) +
            dx0 * (dy1 * this.grid[gridY0][gridX1] + dy0 * this.grid[gridY1][gridX1])
        );
        return altitude;
    }

    clearGrid() {
        this.grid = null;
    }

}