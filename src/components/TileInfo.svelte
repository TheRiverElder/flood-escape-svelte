<script lang="ts">
    import type { Tile } from "../game/Tile";
    import { shorten } from "../game/utils";
    import ProgressBar from "./widgets/ProgressBar.svelte";
    import Row from "./widgets/Row.svelte";
    import CityStructureInfo from "./structure-infos/CityStructureInfo.svelte";
    import RocketStructureInfo from "./structure-infos/RocketStructureInfo.svelte";
    import WaterSourceStructureInfo from "./structure-infos/WaterSourceStructureInfo.svelte";
    import Card from "./widgets/Card.svelte";
    import Spacer from "./widgets/Spacer.svelte";

    const STRUCTURE_INFOS = {
        "water-source": WaterSourceStructureInfo,
        city: CityStructureInfo,
        rocket: RocketStructureInfo,
    };

    export let tile: Tile;

    $: progressBarItems = [
        ["#00ff00", tile.terrain.altitude],
        ["#0000ff", tile.terrain.water],
    ] as [string, number][];
</script>

<Card title="图格" style="background-color: #ffffff;">
    <Row>
        <span slot="name">位置</span>
        <span slot="value">({tile.x}, {tile.y})</span>
    </Row>
</Card>
<Spacer height="0.5em" />

<Card title="地形" style="background-color: #ffffff;">
    <!-- svelte-ignore missing-declaration -->
    <ProgressBar
        items={progressBarItems}
        filler="#00ccff"
        total={CONFIG.maxWaterLevel}
    />
    <Row>
        <span slot="name">海拔</span>
        <span slot="value">{shorten(tile.terrain.altitude)}</span>
    </Row>
    <Row>
        <span slot="name">水位</span>
        <span slot="value">{shorten(tile.terrain.water)}</span>
    </Row>
    <Row>
        <span slot="name">水平面</span>
        <span slot="value">{shorten(tile.terrain.level)}</span>
    </Row>
</Card>
<Spacer height="0.5em" />

<Card title="建筑" style="background-color: #ffffff;">
    <Row>
        <span slot="name">ID</span>
        <span slot="value">{tile.structure?.id || "N/A"}</span>
    </Row>
    {#if tile.structure}
        <svelte:component this={STRUCTURE_INFOS[tile.structure.id]} {tile} />
    {/if}
</Card>
