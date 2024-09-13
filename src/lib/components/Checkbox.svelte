<script lang="ts">
	export let checked: any = false;
	export let label: any = '';
</script>

<div class="flex my-2 items-center">
	<div>
		<input
			{checked}
			on:change
			type="checkbox"
			id={label}
			class="form-check-input appearance-none h-4 w-4 border border-slate-300 rounded-sm bg-transparent checked:bg-[#f0b111] checked:border-[#f0b111] focus:outline-none transition duration-200 my-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
		/>
	</div>

	{#if label}
		<label
			for={label}
			class="text-[12.5px] cursor-pointer capitalize font-medium text-slate-500 flex ml-1"
		>
			{label}
		</label>
	{/if}
</div>

<style scoped>
	.form-check-input:checked[type='checkbox'] {
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e");
	}
</style>
