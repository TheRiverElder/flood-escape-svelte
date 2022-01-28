import type { Game } from "./Game";
import type { Nullable } from "./interfaces";
import { SimpleEventDispatcher } from "./SimpleEventDispatcher";
import type { Tile } from "./Tile";

export interface ClickTileEvent {
    tile: Tile;
}

export interface LinkTileEvent {
    src: Tile;
    dst: Tile;
}

export abstract class GameRenderer {

    choosenTile: Nullable<Tile>;

    private doDraw: boolean = false;

    onRender: SimpleEventDispatcher<GameRenderer> = new SimpleEventDispatcher();
    onLinkTileDispatcher: SimpleEventDispatcher<LinkTileEvent> = new SimpleEventDispatcher();
    onClickTileDispatcher: SimpleEventDispatcher<ClickTileEvent> = new SimpleEventDispatcher();
    
    abstract initialize(game: Game, canvas: HTMLCanvasElement, infoDOM: HTMLElement): void;

    start() {
        if (this.doDraw) return;
        this.doDraw = true;
        this.loop();
    }

    loop() {
        if (this.doDraw) {
            requestAnimationFrame(this.loop.bind(this));
            this.render();
        }
    }
    
    abstract render(): void;
    abstract dispose(): void;

    stop() {
        this.doDraw = false;
    }
}