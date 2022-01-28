<script lang="ts">
    export let value: boolean = false;
</script>

<div class={`${value}`} on:click={() => (value = !value)}>
    <div class="dot" />
</div>

<style>
    div {
        width: 2em;
        height: 1em;
        padding: 0;
        margin: 0;
        border-radius: 1em;
        background-color: #ff2222;
        box-shadow: inset #000000 0 0 .1em;
        display: flex;
        align-items: center;
    }

    div.true {
        background-color: #2389ff;
        justify-content: flex-end;
    }

    div.false {
        background-color: #ffffff;
        justify-content: flex-start;
    }

    div > .dot {
        width: 1em;
        height: 1em;
        padding: 0;
        margin: 0;
        border-radius: 1em;
        background-color: #ffffff;
        box-shadow: #000000 0 0 .1em;
    }

    div.true > .dot {
        box-shadow: #0000003f -0.1em 0 .1em;
    }

    div.false > .dot {
        box-shadow: #0000003f 0.1em 0 .1em;
    }
</style>
