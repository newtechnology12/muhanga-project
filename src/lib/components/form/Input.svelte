<script lang="ts">
	export let label: string = '';
	export let error: string;
	export let value;
</script>

<div class="space-y-1">
	<label class="text-[12.7px] text-gray-500 capitalize font-medium" for="">{label}</label>
	<input
		on:keyup
		on:blur
		bind:value
		placeholder="Type here"
		{...$$restProps}
		class={` ${
			error ? 'border-red-500' : ''
		} w-full border-gray-300 py-[10px] font-medium- rounded-[3px] border focus:border-[#f0b111] px-4 outline-none placeholder:text-gray-400 text-[13px] placeholder:text-[13px] text-gray-600`}
	/>
	<label for="name" class="label">
		{#if error}
			<span class="text-red-500 font-medium- capitalize-first text-[12px]">{error}</span>
		{/if}
	</label>
</div>
