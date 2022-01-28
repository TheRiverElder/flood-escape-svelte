<script lang="ts">
    import type { RocketStructure } from "../../game/builtin/structures/RocketStructure";
    import type { Tile } from "../../game/Tile";
    import { shorten } from "../../game/utils";
    import ProgressBar from "../widgets/ProgressBar.svelte";
    import Row from "../widgets/Row.svelte";

    export let tile: Tile;

    $: rocket = tile.structure as RocketStructure;

    $: progressBarItems = [["#ffff00", rocket.energy]] as [string, number][];
</script>

<ProgressBar
    items={progressBarItems}
    filler="#7f7f00"
    total={rocket.targetEnergy}
/>

<Row>
    <span slot="name">状态</span>
    <span slot="value">{rocket.ruined ? "已毁坏" : "完好"}</span>
</Row>
<Row>
    <span slot="name">能量</span>
    <span slot="value">{shorten(rocket.energy)}</span>
</Row>
<Row>
    <span slot="name">目标能量</span>
    <span slot="value">{shorten(rocket.targetEnergy)}</span>
</Row>
