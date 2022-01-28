<script lang="ts">
    import { getContext, setContext } from "svelte";
    import { manifest } from "../game/builtin/manifest";
    import type { Game } from "../game/Game";
    import { KEY_SET_PARAMETER, KEY_START_GAME } from "../values";
    import NumberParameterPattern from "./parameter-patterns/NumberParameterPatternInput.svelte";
    import ParameterPatternRow from "./ParameterPatternRow.svelte";
    import Spacer from "./widgets/Spacer.svelte";

    const gameStart: (game: Game) => void = getContext(KEY_START_GAME);

    const PATTERNS = {
        number: NumberParameterPattern,
    };

    const parameterPatterns = manifest.getParameterPatterns();

    const parameters = Object.fromEntries(
        parameterPatterns.map(({ name, defaultValue }) => [name, defaultValue])
    );

    setContext(
        KEY_SET_PARAMETER,
        (name: string, value: any) => (parameters[name] = value)
    );

    function startGame() {
        const game = manifest.createGame(parameters);
        gameStart(game);
    }
</script>

<main>
    <h1>参数设置</h1>
    <div class="parameters">
        {#each parameterPatterns as pattern, i}
            {#if i > 0}
                <Spacer height="0.5em" />
            {/if}
            <ParameterPatternRow
                {pattern}
                nameStyle="text-align: right;"
                nameWeight={6}
                valueWeight={6}
            />
        {/each}
    </div>
    <button on:click={startGame}>开始</button>
</main>

<style>
    main {
        width: 100%;
        max-width: 50em;
        height: 100%;
        padding: 1em;
        margin: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        background-color: #475085;
        color: #ffffff;
    }

    main > * {
        width: 100%;
    }

    h1 {
        text-align: center;
    }

    .parameters {
        margin: 2em 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        overflow-y: auto;
        color: #ffffff;
    }

    button {
        width: 100%;
        max-width: 20em;
        margin: 2em auto;
        text-align: center;
        font-size: 3vh;
        font-family: "Microsoft Yahei";
        letter-spacing: .6em;
    }
</style>
