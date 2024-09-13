<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	//import mapStyles from './map-styles'; // optional

	export let globally = false;
	let map;
	export let onSelect;

	let src = '';
	const key = 'AIzaSyDVJ6NzgcCu96aJRnbCKXQpn5f9CzXt2us';

	// @ts-ignore
	let container;
	let zoom = 8;
	export let cords = undefined;
	let center = { lat: -2.0986247, lng: 29.970787 };
	let marker;

	onMount(() => {
		Object.assign(window, {
			mapLoaded: () => {
				// @ts-ignore
				map = new google.maps.Map(container, {
					zoom,
					center: cords || center
					// styles: mapStyles
				});
				dispatch('load', true);
				if (globally) {
					Object.assign(window, { map });
				}

				// @ts-ignore
				// marker = new google.maps.Marker({
				// 	map: map,
				// 	draggable: true // Make the marker draggable
				// });
				marker = new google.maps.Marker({
					position: cords || center,
					map: map
				});

				// Update marker position when marker is dragged
				// @ts-ignore
				google.maps.event.addListener(marker, 'dragend', function () {
					var markerPosition = marker.getPosition();
					alert('Latitude: ' + markerPosition.lat() + ', Longitude: ' + markerPosition.lng());
				});

				// Add a click event listener to the map
				// @ts-ignore
				google.maps.event.addListener(map, 'click', function (event) {
					// Get the clicked coordinates
					var clickedLocation = event.latLng;

					if (marker) {
						marker.setMap(null);
					}

					onSelect({
						lat: clickedLocation.lat(),
						lng: clickedLocation.lng()
					});

					// Add a marker at the clicked location

					// @ts-ignore
					marker = new google.maps.Marker({
						position: clickedLocation,
						map: map
					});

					// Display the coordinates
					// alert('Latitude: ' + clickedLocation.lat() + ', Longitude: ' + clickedLocation.lng());
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
