import type { Nullable } from "../../interfaces";
import type { Game } from "../../Game";
import type { CityStructure } from "../structures/CityStructure";
import type { RocketStructure } from "../structures/RocketStructure";
import type { WaterSourceStructure } from "../structures/WaterStructure";
import type { Tile } from "../../Tile";
import { GameRenderer } from "../../GameRenderer";
import { constraints, distance, makeGraph, shorten, toPercents } from "../../utils";

export class Canvas2dgameRender extends GameRenderer {

    tileSize: number = CONFIG.tileSize;
    tileEdgeWidth: number = CONFIG.tileEdgeWidth;
    game: Game;
    canvas: HTMLCanvasElement;

    ghostSrcTile: Nullable<Tile>;
    ghostDstTile: Nullable<Tile>;

    initialize(game: Game, canvas: HTMLCanvasElement) {
        this.game = game;
        this.canvas = canvas;

        canvas.width = this.game.width * this.tileSize;
        canvas.height = this.game.height * this.tileSize;

        this.setupListeners(canvas, game);
    }

    cleanListeners: Nullable<() => void>;

    setupListeners(canvas: HTMLCanvasElement, game: Game) {

        const onMouseDownListener = (event: MouseEvent) => {
            const x = Math.floor(event.offsetX / this.tileSize);
            const y = Math.floor(event.offsetY / this.tileSize);
            const tile = game.getTile(x, y);
            this.ghostSrcTile = tile;
        };

        const onMouseUpListener = (event: MouseEvent) => {
            const x = Math.floor(event.offsetX / this.tileSize);
            const y = Math.floor(event.offsetY / this.tileSize);

            const tile = game.getTile(x, y);

            if (tile) {
                if (tile === this.ghostSrcTile || !this.ghostSrcTile) {
                    this.onClickTileDispatcher.emit({ tile });
                    this.choosenTile = tile;
                } else {
                    this.onLinkTileDispatcher.emit({ src: this.ghostSrcTile, dst: tile });
                }
            }

            this.ghostSrcTile = null;
            this.ghostDstTile = null;
        };

        const onMouseMoveListener = (event: MouseEvent) => {
            const x = Math.floor(event.offsetX / this.tileSize);
            const y = Math.floor(event.offsetY / this.tileSize);

            const tile = game.getTile(x, y);

            if (this.ghostSrcTile && tile) {
                this.ghostDstTile = (this.ghostSrcTile === tile) ? null : tile;
            }
        };

        const onMouseleaveListener = (event: MouseEvent) => {
            this.ghostSrcTile = null;
            this.ghostDstTile = null;
        };

        const onKeyUpListener = (event: KeyboardEvent) => {
            if (event.key !== ' ') return;
            switch (game.status) {
                case 'running': game.status = 'waiting'; break;
                case 'waiting': game.status = 'running'; break;
            }
        };


        canvas.addEventListener('mousedown', onMouseDownListener);
        canvas.addEventListener('mouseup', onMouseUpListener);
        canvas.addEventListener('mousemove', onMouseMoveListener);
        canvas.addEventListener('mouseleave', onMouseleaveListener);
        window.addEventListener('keyup', onKeyUpListener);

        this.cleanListeners = () => {
            canvas.removeEventListener('mousedown', onMouseDownListener);
            canvas.removeEventListener('mouseup', onMouseUpListener);
            canvas.removeEventListener('mousemove', onMouseMoveListener);
            canvas.removeEventListener('mouseleave', onMouseleaveListener);
            window.removeEventListener('keyup', onKeyUpListener);
        };
    }

    render() {
        this.canvas.width = this.game.width * this.tileSize;
        this.canvas.height = this.game.height * this.tileSize;

        const g = this.canvas.getContext('2d');

        this.game.tiles.forEach(tile => this.renderTerrain(tile, g));
        this.game.tiles.forEach(tile => this.renderTransportationLine(tile, g));
        this.game.tiles.forEach(tile => this.renderStructure(tile, g));

        this.renderChooseFrame(this.choosenTile, g);
        this.renderGhostTiles(this.ghostSrcTile, this.ghostDstTile, g);

        this.onRender.emit(this);
    }

    renderTerrain(tile: Tile, g: CanvasRenderingContext2D) {
        const { x, y, terrain: { altitude, water } } = tile;
        const pixelX = Math.floor(x * this.tileSize);
        const pixelY = Math.floor(y * this.tileSize);

        g.fillStyle = '#00' +
            Math.floor(constraints(altitude / 16 * 0x0100, 0, 0xff)).toString(16).padStart(2, '0') +
            Math.floor(constraints(water / CONFIG.maxWaterLevel * 0xbf + (water > 0 ? 0x40 : 0), 0, 0xff))
                .toString(16)
                .padStart(2, '0');
        g.fillRect(pixelX, pixelY, this.tileSize, this.tileSize);

        if (CONFIG.doDrawTileEdge) {
            g.fillStyle = '#ffffff';
            if (!tile.up || tile.up.terrain.altitude !== altitude) g.fillRect(pixelX, pixelY, this.tileSize, this.tileEdgeWidth);
            if (!tile.left || tile.left.terrain.altitude !== altitude) g.fillRect(pixelX, pixelY, this.tileEdgeWidth, this.tileSize);
            if (!tile.right || tile.right.terrain.altitude !== altitude) g.fillRect(pixelX + this.tileSize - this.tileEdgeWidth, pixelY, this.tileEdgeWidth, this.tileSize);
            if (!tile.down || tile.down.terrain.altitude !== altitude) g.fillRect(pixelX, pixelY + this.tileSize - this.tileEdgeWidth, this.tileSize, this.tileEdgeWidth);
        }
    }

    renderTransportationLine(tile: Tile, g: CanvasRenderingContext2D) {
        const { x, y, structure } = tile;

        if (!structure || structure.id !== 'city') return;

        const srcPixelCenterX = Math.floor((x + 0.5) * this.tileSize);
        const srcPixelCenterY = Math.floor((y + 0.5) * this.tileSize);

        const s = structure as CityStructure;
        for (const { target, pipe } of s.transportationLines) {
            const dstPixelCenterX = Math.floor((target.x + 0.5) * this.tileSize);
            const dstPixelCenterY = Math.floor((target.y + 0.5) * this.tileSize);
            const angle = Math.atan2(target.y - y, target.x - x);

            g.strokeStyle = '#ffffff';
            g.lineWidth = 0.1 * this.tileSize;
            g.beginPath();
            g.moveTo(srcPixelCenterX, srcPixelCenterY);
            g.lineTo(dstPixelCenterX, dstPixelCenterY);
            g.stroke();

            for (const { energy, progress } of pipe) {
                const radius = 0.1 * this.tileSize * (1 + Math.tanh(energy / 50));
                g.fillStyle = '#ffffff';
                g.beginPath();
                g.arc(
                    srcPixelCenterX + progress * Math.cos(angle) * this.tileSize,
                    srcPixelCenterY + progress * Math.sin(angle) * this.tileSize,
                    radius,
                    0,
                    2 * Math.PI,
                );
                g.fill();
            }
        }
    }

    renderStructure(tile: Tile, g: CanvasRenderingContext2D) {
        const { x, y, structure } = tile;

        if (!structure) return;

        const pixelX = Math.floor(x * this.tileSize);
        const pixelY = Math.floor(y * this.tileSize);

        let fillStyle = '#ff0000';
        switch (structure.id) {
            case 'water-source': fillStyle = '#00ffff'; break;
            case 'rocket': fillStyle = (structure as RocketStructure) ? '#8f8f8f' : '#ffffff'; break;
            case 'city': {
                const city = structure as CityStructure;
                if (city.ruined) {
                    fillStyle = '#8f8f8f';
                } else {
                    fillStyle = city.active ? '#ffff00' : '#afaf00';
                }
            } break;
        }

        g.fillStyle = fillStyle;
        g.beginPath();
        g.arc(pixelX + this.tileSize / 2, pixelY + this.tileSize / 2, this.tileSize / 2 * 0.6, 0, 2 * Math.PI);
        g.fill();

        if (structure.id === 'city' || structure.id === 'rocket') {
            g.strokeStyle = '#000000';
            g.lineWidth = 0.1 * this.tileSize;
            g.stroke();

            g.strokeStyle = '#ffffff';
            let v = 0;
            if (structure.id === 'city') {
                const city = structure as CityStructure;
                v = city.active
                    // ? Math.tanh(structure.energy / 500)
                    ? (city.energy / city.maxEnergy)
                    : (city.energy / city.activeValve);
            } else if (structure.id === 'rocket') {
                const rocket = structure as RocketStructure;
                v = constraints(rocket.energy / rocket.targetEnergy, 0, 1);
            }
            g.beginPath();
            g.arc(
                pixelX + this.tileSize / 2,
                pixelY + this.tileSize / 2,
                this.tileSize / 2 * 0.6,
                -0.5 * Math.PI,
                (v * 2 - 0.5) * Math.PI,
                false
            );
            g.stroke();
        }
    }

    renderGhostTiles(src: Tile, dst: Tile, g: CanvasRenderingContext2D) {
        const tileSize = this.tileSize;

        if (src && dst && src !== dst) {
            let strokeStyle = '#ffff00';
            if (src.structure && src.structure.id === 'city') {
                const city = src.structure as CityStructure;
                if (distance(src, dst) * CONFIG.lineCost <= city.energy) {
                    strokeStyle = '#7fff7f';
                } else {
                    strokeStyle = '#ff0000';
                }
            }
            g.strokeStyle = strokeStyle;
            g.beginPath();
            g.moveTo((src.x + 0.5) * tileSize, (src.y + 0.5) * tileSize);
            g.lineTo((dst.x + 0.5) * tileSize, (dst.y + 0.5) * tileSize);
            g.stroke();
        }

        this.renderGhostTile(src, g, "#0066FF");
        this.renderGhostTile(dst, g, "#FFCC33");
    }

    renderGhostTile(tile: Tile, g: CanvasRenderingContext2D, color: string) {
        if (!tile) return;

        const { x, y } = tile;
        const tileSize = this.tileSize;
        const tileEdgeWidth = this.tileEdgeWidth;
        const cx = (x + 0.5) * tileSize;
        const cy = (y + 0.5) * tileSize;
        const outer = tileSize / 2 - tileEdgeWidth;
        const inner = tileSize / 2 - 2 * tileEdgeWidth;

        g.fillStyle = color;
        g.fillRect(cx - outer, cy - outer, 2 * outer, tileEdgeWidth);
        g.fillRect(cx - outer, cy + inner, 2 * outer, tileEdgeWidth);
        g.fillRect(cx - outer, cy - outer, tileEdgeWidth, 2 * outer);
        g.fillRect(cx + inner, cy - outer, tileEdgeWidth, 2 * outer);
    }

    renderChooseFrame(tile: Tile, g: CanvasRenderingContext2D) {
        if (!tile) return;
        const { x, y, terrain: { altitude, water, level }, structure } = tile;
        const pixelX = Math.floor(x * this.tileSize);
        const pixelY = Math.floor(y * this.tileSize);

        const tileSize = this.tileSize;
        const tileEdgeWidth = this.tileEdgeWidth;

        g.fillStyle = '#ffffff';
        g.fillRect(pixelX, pixelY, tileSize, tileEdgeWidth);
        g.fillRect(pixelX, pixelY, tileEdgeWidth, tileSize);
        g.fillRect(pixelX + tileSize - tileEdgeWidth, pixelY, tileEdgeWidth, tileSize);
        g.fillRect(pixelX, pixelY + tileSize - tileEdgeWidth, tileSize, tileEdgeWidth);
    }

    dispose() {
        if (this.cleanListeners) {
            this.cleanListeners();
            this.cleanListeners = null;
        }
        [this.onRender, this.onClickTileDispatcher, this.onLinkTileDispatcher].forEach(it => it.clear());
    }
}