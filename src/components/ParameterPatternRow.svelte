<script lang="ts">
    import { getContext } from "svelte";
    import Row from "./widgets/Row.svelte";

    import type {
        BooleanParameterPattern,
        ParameterPattern,
    } from "../game/interfaces";
    import { KEY_SET_PARAMETER } from "../values";
    import BooleanParameterPatternInput from "./parameter-patterns/BooleanParameterPatternInput.svelte";
    import NumberParameterPatternInput from "./parameter-patterns/NumberParameterPatternInput.svelte";

    export let pattern: ParameterPattern<any>;
    export let nameWeight: number = 4;
    export let valueWeight: number = 5;
    export let nameStyle: string = "";
    export let valueStyle: string = "";

    const setParameter: (name: string, value: any) => void =
        getContext(KEY_SET_PARAMETER);

    const PATTERNS = {
        number: NumberParameterPatternInput,
        boolean: BooleanParameterPatternInput,
    };

    let value: any;
    $: {
        setParameter(pattern.name, value);
    }

    function getSubPatterns(pattern: ParameterPattern<any>, value: any) {
        if (pattern.id !== "boolean") return [];
        const bpp = pattern as BooleanParameterPattern;
        if (value === true) return bpp.subParameters || [];
        return [];
    }

    $: subPatterns = getSubPatterns(pattern, value);
</script>

<Row {nameStyle} {valueStyle} {nameWeight} {valueWeight}>
    <span slot="name">{pattern.display || pattern.name}</span>
    <span slot="value">
        <svelte:component this={PATTERNS[pattern.id]} {pattern} bind:value />
    </span>
</Row>
{#each subPatterns as subPat}
    <svelte:self pattern={subPat} {nameStyle} {valueStyle} {nameWeight} {valueWeight} />
{/each}
