<script lang="ts">
    export let width: number | string = 0;
    export let height: number | string = 0;
    const style = `
        width: ${typeof width === 'number' ? width + 'px' : width};
        height: ${typeof height === 'number' ? height + 'px' : height};
    `;
</script>

<div {style}/>

<style>
    div {
        width: 100%;
        height: 100%;
    }
</style>