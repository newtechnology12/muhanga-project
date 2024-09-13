<script lang="ts">
	import { cn } from '../../../utils/cn';
	import Loader from '../Loader.svelte';

	export const label: string = '';
	export let type: any = '';
	export let customClass: any = '';
	export let loading = false;
	export let disabled = false;
</script>

<button
	{type}
	on:click
	class={cn(
		'text-center text-[14px] flex items-center justify-center gap-3 py-[9px] px-6 bg-[#f0b111] text-white font-medium w-full hover:opacity-95 duration-300 rounded-[4px]',
		customClass,
		{ 'opacity-60 pointer-events-none': disabled },
		{ 'opacity-70 pointer-events-none': loading }
	)}
>
	{#if loading}
		<Loader />
	{/if}
	<slot />
</button>
