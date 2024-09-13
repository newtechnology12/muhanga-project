<script lang="ts">
	import Icon from '@iconify/svelte';
	export let icon: string = '';
	export let title: string;
</script>

<button
	on:click
	class="grid border px-3 py-2 rounded-[4px] border-orange-300 hover:bg-orange-50 text-[#f0b111] w-full"
>
	<div class="m-auto flex items-center gap-3">
		{#if icon}
			<Icon {icon} class="text-lg" />
		{/if}
		<p class="capitalize font-semibold text-[12px]">{title}</p>
	</div>
</button>
