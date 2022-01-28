import type { Game } from "./Game";

export interface GameGenerator {
    generate(game: Game): void;
}