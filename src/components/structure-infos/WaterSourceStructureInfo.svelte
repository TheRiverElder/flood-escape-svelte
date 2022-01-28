<script lang="ts">
    import type { WaterSourceStructure } from "../../game/builtin/structures/WaterStructure";
    import type { Tile } from "../../game/Tile";
    import Row from "../widgets/Row.svelte";

    export let tile: Tile;

    const structure = tile.structure;
    const waterSource = structure as WaterSourceStructure;
</script>

<Row>
    <span slot="name">出水速度</span>
    <span slot="value">{waterSource.speed}</span>
</Row>
