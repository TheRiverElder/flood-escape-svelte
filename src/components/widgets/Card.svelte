<script lang="ts">
    export let className: string = "";
    export let style: string = "";
    export let title: string = "";
</script>

<div class={className} {style}>
    {#if title}
        <h3>{title}</h3>
    {/if}
    <slot />
</div>

<style>
    div {
        padding: 1em;
        margin: 0;
        border-radius: 0.5em;
        background-color: #efefef;
    }

    h3 {
        margin-top: 0;
    }
</style>
