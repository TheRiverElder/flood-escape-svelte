<script lang="ts">
	import { setContext } from "svelte";
	import MenuPage from "./components/MenuPage.svelte";
	import type { Game } from "./game/Game";
	import { KEY_START_GAME } from "./values";
	import GamePage from "./components/GamePage.svelte";

	let game: Game = null;

	const gameStart = (g: Game) => (game = g);

	setContext(KEY_START_GAME, gameStart);
</script>

<main>
	{#if !game}
		<MenuPage />
	{:else}
		<GamePage game={game} />
	{/if}
</main>

<style>
	main {
		width: 100%;
		height: 100%;
        background-color: #2a315a;
	}
</style>
