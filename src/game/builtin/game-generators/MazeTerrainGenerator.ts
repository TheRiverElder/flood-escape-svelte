import type { Game } from "../../Game";
import type { Nullable } from "../../interfaces";
import type { GameGenerator } from "../../TerrainGenerator";
import { array, constraints, randInt, shuffle } from "../../utils";

const DIRECTIONS = [
    [0, -2],
    [0, 2],
    [-2, 0],
    [2, 0],
];

interface Node {
    x: number;
    y: number;
    visited: boolean;
    nexts: Node[];
}

type Point = [number, number];

export class MazeTerrainGenerator implements GameGenerator {

    private grid: number[][];

    generate(game: Game): void {
        this.setupGrid(game);

        game.tiles.forEach(({ x, y, terrain }) => (terrain.altitude = this.getGridValueAt(x, y)));

        this.clearGrid();
    }

    setupGrid(game: Game) {

        const startX = randInt(0, game.width);
        const startY = randInt(0, game.height);

        const nodes: Node[][] = array(game.height, y => array(game.width, x => ({
            x, y,
            visited: false,
            nexts: [],
        })));
        let queue: [Point, Nullable<Node>][] = [[[startX, startY], null]];
        while (queue.length > 0) {
            queue = shuffle(queue);
            const [[x, y], prior] = queue.shift();
            if (!game.contains(x, y)) continue;
            const node = nodes[y][x];
            if (!node || node.visited) continue;
            node.visited = true;

            if (prior) {
                prior.nexts.push(node);
                const { x: px, y: py } = prior;
                if (px === x) {
                    const mid = nodes[Math.round((y + py) / 2)][x].visited = true;
                } else if (py === y) {
                    const mid = nodes[y][Math.round((x + px) / 2)].visited = true;
                }
            }

            shuffle(DIRECTIONS).forEach(([dx, dy]) => queue.push([[x + dx, y + dy], node]));
        }

        const grid = array(game.height, y => array(game.width, x => {
            const prev = game.getTile(x, y).terrain.altitude;
            return nodes[y][x].visited ? constraints(Math.floor(prev / 2), 1, CONFIG.maxWaterLevel) : prev;
        }));
        this.grid = grid;
    }

    getGridValueAt(x: number, y: number): number {
        return this.grid[y][x];
    }

    clearGrid() {
        this.grid = null;
    }

}