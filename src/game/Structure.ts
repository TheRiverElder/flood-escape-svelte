import type { Tile } from "./Tile";

export interface Structure {
    readonly id: string;

    tick(tile: Tile): void;
}