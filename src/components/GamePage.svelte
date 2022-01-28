<script lang="ts">
    import type { Nullable } from "../game/interfaces";
    import type { Game } from "../game/Game";
    import type { NumberParameterPattern as NPP } from "../game/interfaces";
    import type { ClickTileEvent } from "../game/GameRenderer";
    import type { Tile } from "../game/Tile";
    import { onDestroy, onMount } from "svelte";
    import { handleLinkTile } from "../game/games";
    import { Canvas2dgameRender } from "../game/builtin/game-renderers/Canvas2dRenderer";
    import NumberParameterPattern from "./parameter-patterns/NumberParameterPatternInput.svelte";
    import TileInfo from "./TileInfo.svelte";
    import Row from "./widgets/Row.svelte";
    import Card from "./widgets/Card.svelte";
    import List from "./widgets/List.svelte";
    import Spacer from "./widgets/Spacer.svelte";

    let canvas: HTMLCanvasElement;

    export let game: Nullable<Game> = null;
    let choosenTile: Nullable<Tile> = null;
    let renderer = new Canvas2dgameRender();
    let distoryHandler: () => void;

    const handleClickTile = ({ tile }: ClickTileEvent) => (choosenTile = tile);
    const handleRender = () => {
        choosenTile = choosenTile;
        game = game;
    };

    onMount(() => {
        if (!game) throw new Error("No game!");

        renderer.onLinkTileDispatcher.add(handleLinkTile);
        renderer.onClickTileDispatcher.add(handleClickTile);
        renderer.onRender.add(handleRender);
        renderer.initialize(game, canvas);
        renderer.start();
        game.status = "running";
        game.start(100);

        distoryHandler = () => {
            if (game.status === "running") {
                game.status = "waiting";
            }
            renderer.stop();
            renderer.dispose();
            game.stop();
            game = null;
        };
    });

    onDestroy(() => {
        if (distoryHandler) {
            distoryHandler();
        }
    });

    const patTileSize: NPP = {
        id: "number",
        name: "tileSize", // 该参数的名字
        display: "瓦片边长(px)", // 该参数显示在界面上的名字
        defaultValue: 20, // 该参数的默认值
        min: 1, // 最小值
        max: 1000, // 最大值
        step: 1, // 步长
        integer: true, // 是否必须是整数
    };

    const canvasCardStyle = `
        width: 100%;
        height: 100%;
        overflow: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ffffff;
    `;
</script>

<main>
    <div class="canvas-wrapper">
        <Card style={canvasCardStyle}>
            <canvas bind:this={canvas} />
        </Card>
    </div>

    <div class="info">
        <List>
            <Card style="background-color: #ffffff;">
                <span>{patTileSize.display || patTileSize.name}</span>
                <NumberParameterPattern
                    pattern={patTileSize}
                    bind:value={renderer.tileSize}
                />
            </Card>
            <Spacer height="0.5em" />

            <Card title="游戏" style="background-color: #ffffff;">
                <Row>
                    <span slot="name">状态</span>
                    <span slot="value">{game.status}</span>
                </Row>
            </Card>
            <Spacer height="0.5em" />

            {#if choosenTile}
                <TileInfo tile={choosenTile} />
            {/if}
        </List>
    </div>
</main>

<style>
    main {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }

    canvas {
        margin: auto;
        background-color: #475085;
    }

    .canvas-wrapper {
        height: 100%;
        border-radius: 0.5em;
        padding: 1em;
        overflow: auto;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .info {
        width: 20em;
        height: 100%;
        padding: 1em;
        background-color: #efefef;
        font-family: "Consolas";
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        overflow: auto;
    }
</style>
