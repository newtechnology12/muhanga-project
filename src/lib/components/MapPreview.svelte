<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	//import mapStyles from './map-styles'; // optional

	let globally = false;
	let map;

	let src = '';
	const key = 'AIzaSyDVJ6NzgcCu96aJRnbCKXQpn5f9CzXt2us';

	// @ts-ignore
	let container;
	let zoom = 10;
	export let cords;

	onMount(() => {
		Object.assign(window, {
			mapLoaded: () => {
				// @ts-ignore
				map = new google.maps.Map(container, {
					zoom,
					center: cords
					// styles: mapStyles
				});
				dispatch('load', true);
				if (globally) {
					Object.assign(window, { map });
				}

				// @ts-ignore
				marker = new google.maps.Marker({
					position: cords,
					map: map
				});
			}
		});

		//Assign
		src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=mapLoaded`;
	});
</script>

<!-- This is tailwind css class change with whatever fits to your case. -->
<div class="w-full h-full" bind:this={container} />
<svelte:head>
	{#if src}
		<script {src}></script>
	{/if}
</svelte:head>
