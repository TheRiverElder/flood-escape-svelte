import type { Handler, Nullable } from "./interfaces";
import { Tile } from "./Tile";

export class Game {

    width: number;
    height: number;
    status: string;
    ticks: number;
    tiles: Tile[];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.status = 'waiting';
        this.ticks = 0;
        this.tiles = Array.from(Array(width * height), (_, i) => new Tile(this, i % width, Math.floor(i / width)));
        // this.TEST_tickCounter = 0;
    }

    getTile(x: number, y: number): Nullable<Tile> {
        return this.contains(x, y) ? this.tiles[y * this.width + x] : null;
    }

    contains(x: number, y: number): boolean {
        return (x >= 0 && x < this.width && y >= 0 && y < this.height);
    }

    tick() {
        if (this.status !== 'running') return;
        
        this.ticks++;
        this.tiles.forEach(tile => tile.tick());
        this.tiles.forEach(tile => tile.evenify());
    }

    initialize(initializer: Handler<Game>) {
        initializer(this);
    }

    private pid: Nullable<NodeJS.Timeout> = null;

    start(period: number) {
        if (this.pid !== null) return;
        this.pid = setInterval(this.tick.bind(this), period);
    }

    stop() {
        if (this.pid === null) return;
        clearInterval(this.pid);
        this.pid = null
    }


}