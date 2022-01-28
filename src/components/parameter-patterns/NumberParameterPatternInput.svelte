<script lang="ts">
    import type { NumberParameterPattern } from "../../game/interfaces";

    export let pattern: NumberParameterPattern;
    export let value = pattern.defaultValue;
</script>

<div>
    <input
        type="number"
        min={pattern.min}
        max={pattern.max}
        step={pattern.step}
        bind:value
    />
    <input
        type="range"
        bind:value
        min={pattern.min}
        max={pattern.max}
        step={pattern.step}
    />
</div>

<style>
    div {
        display: flex;
        align-items: center;
    }

    input {
        margin: 0;
    }

    input[type="number"] {
        width: 5em;
        padding: 0 0 0 1em;
        margin-right: 1em;
        text-align: right;
    }
    
    input[type="range"] {
        padding: 0;
        margin: 0;
    }
</style>
