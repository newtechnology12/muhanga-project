<script lang="ts">
	export let label: string = '';
	export let error: string;
	export let placeholder: string;
	export let options = [];
	export let value;
</script>

<div class="space-y-1">
	<label class="text-[12.7px] text-gray-500 capitalize font-medium" for="">{label}</label>
	<select
		{...$$restProps}
		on:blur
		on:change
		bind:value
		class={`${
			error ? 'border-red-500' : ''
		} w-full border-gray-300 py-[10px] font-medium- rounded-[3px] border focus:border-[#f0b111] px-3 outline-none placeholder:text-gray-400 text-[13px] placeholder:text-[13px] text-gray-500`}
	>
		<option disabled selected value={placeholder}> {placeholder} </option>
		{#each options as option}
			<option value={option.value}>
				{option.label}
			</option>
		{/each}
	</select>
	<label for="name" class="label">
		{#if error}
			<span class="text-red-500 text-sm">{error[0]}</span>
		{/if}
	</label>
</div>
