<script lang="ts">
    export let nameWeight: number = 4;
    export let valueWeight: number = 8;
    export let nameStyle: string = "";
    export let valueStyle: string = "";
</script>

<div class="row">
    <span class="name" style={`flex: ${nameWeight}; ${nameStyle}`}>
        <slot name="name" />
    </span>
    <span class="value" style={`flex: ${valueWeight}; ${valueStyle}`}>
        <slot name="value" />
    </span>
</div>

<style>
    .row {
        width: 100%;
        display: flex;
        align-items: baseline;
    }

    .row > .name {
        flex: 4;
        margin-right: 2em;
    }

    .row > .value {
        flex: 8;
    }
</style>
