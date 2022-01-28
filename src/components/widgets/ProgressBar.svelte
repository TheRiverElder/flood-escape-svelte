<script lang="ts">
    import { onMount } from "svelte";
import { constraints } from "../../game/utils";

    // [颜色, 权重]
    export let items: [string, number][];
    export let total: number = 100;
    export let filler: string = "transparent";
    export let height: string | number = "1em";

    const heightStr = typeof height === "number" ? height + "px" : height;

    let bar: HTMLDivElement;
    let barTotalWidth = 0;

    onMount(() => {
        barTotalWidth = bar.offsetWidth;
    });

    function calcStyles(items: [string, number][]): string[] {
        const styles: string[] = [];
        let acc = 0;
        for (const item of items) {
            if (!item) continue;

            const [color, weight] = item;
            const start = acc;
            acc = constraints(acc + weight, 0, total);
            const end = acc;
            styles.push(`
                width: ${((end - start) / total) * barTotalWidth}px;
                background-color: ${color}; 
            `);
        }
        if (acc < total) {
            styles.push(`
                width: ${((total - acc) / total) * barTotalWidth}px;
                background-color: ${filler}; 
            `);
        }
        return styles;
    }

    $: styles = calcStyles(items);

</script>

<div bind:this={bar} style="height: {heightStr};">
    {#each styles as style}
        <div {style} />
    {/each}
</div>

<style>
    div {
        width: 100%;
        overflow: hidden;
    }
    div > * {
        height: 100%;
        display: inline-block;
    }
</style>
