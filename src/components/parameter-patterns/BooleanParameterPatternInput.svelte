<script lang="ts">
    import type { BooleanParameterPattern } from "../../game/interfaces";
    import Switch from "../widgets/Switch.svelte";

    export let pattern: BooleanParameterPattern;
    export let value: boolean = pattern.defaultValue;
</script>

<div>
    <Switch bind:value />
    <span>{value ? "开" : "关"}</span>
</div>

<style>
    div {
        display: flex;
        align-items: center;
    }
    span {
        margin-left: 1em;
    }
</style>