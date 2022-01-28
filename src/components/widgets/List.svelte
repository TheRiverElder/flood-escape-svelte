<script lang="ts">
    // export let gap: string | number = "1em";
</script>

<div class="list">
    <slot />
</div>

<style>
    div.list > * {
        margin-top: 1em;
    }
    div.list > *:first-child {
        margin-top: 0;
    }
</style>
