<script lang="ts">
    import type { CityStructure } from "../../game/builtin/structures/CityStructure";
    import type { Tile } from "../../game/Tile";
    import { constraints, shorten, toPercents } from "../../game/utils";
    import ProgressBar from "../widgets/ProgressBar.svelte";
    import Row from "../widgets/Row.svelte";

    export let tile: Tile;

    $: city = tile.structure as CityStructure;

    $: activeStatus = city.active
        ? "已激活"
        : `未激活(${shorten(city.energy)}/${shorten(
              city.activeValve
          )}=${toPercents(city.energy / city.activeValve)})`;

    $: progressBarItems = [
        ["#ffff00", city.energy],
        ["#7f0000", city.active ? 0 : constraints(city.activeValve - city.energy, 0, city.maxEnergy)],
    ] as [string, number][];
</script>

<ProgressBar items={progressBarItems} filler="#7f7f00" total={city.maxEnergy} />

<Row>
    <span slot="name">状态</span>
    <span slot="value">{city.ruined ? "已毁坏" : "完好"}</span>
</Row>
<Row>
    <span slot="name">激活状态</span>
    <span slot="value">{activeStatus}</span>
</Row>
<Row>
    <span slot="name">能量</span>
    <span slot="value">{shorten(city.energy)}</span>
</Row>
<Row>
    <span slot="name">最大能量</span>
    <span slot="value">{shorten(city.maxEnergy)}</span>
</Row>
