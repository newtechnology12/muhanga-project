<script lang="ts">
	import Map from './Map.svelte';
	import Modal from './Modal.svelte';
	import Button from './form/Button.svelte';

	export let open: any;
	export let close: any;

	let location_cords;

	export let onChoose;

	$: link = `http://www.google.com/maps/place/${location_cords?.lat},${location_cords?.lng}`;
</script>

<div id="clipboard" />
<Modal size="xl" showDividers={true} {open} {close} title="Choose a location">
	<div slot="body">
		<div class="h-[500px]">
			<Map
				globally
				onSelect={(e) => {
					console.log(e);
					location_cords = e;
				}}
				on:load={() => {
					console.log('MAP SAYS IM LOADED');
				}}
			/>
		</div>
		{#if location_cords}
			<div
				class="border border-slate-200 rounded-[3px] px-3 py-2 my-3 bg-slate-50 text-left text-[13px] underline"
			>
				<a target="_blank" href={link}>
					{link}
				</a>
			</div>
		{/if}
	</div>
	<span slot="footer">
		<div class="flex items-center gap-2 w-full justify-end">
			<Button
				on:click={() => {
					location_cords = undefined;
				}}
				disabled={!location_cords}
				customClass="w-fit text-slate-600 bg-slate-200">Reset</Button
			>
			<Button
				on:click={() => {
					onChoose(link);
					close();
				}}
				disabled={!location_cords}
				customClass="w-fit">Share location</Button
			>
		</div>
	</span>
</Modal>
