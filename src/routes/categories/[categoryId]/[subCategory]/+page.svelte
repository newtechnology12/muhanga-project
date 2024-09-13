<script>
	import ItemCard from '$lib/components/ItemCard.svelte';
	import Icon from '@iconify/svelte';
	import { clickOutside } from '../../../../directives/clickOutside';
	import Seo from '$lib/components/Seo.svelte';

	export let data;
	const adverts = data.adverts;
	const category = data.category;

	const sorts = [
		{ name: 'most popular', value: 'popular' },
		{ name: 'high price', value: 'high_price' },
		{ name: 'low price', value: 'low_price' }
	];

	$: activeSort = sorts[0].value;

	let showSortDropdown = false;
</script>

<Seo title={category.text} />

<section class="px-5 sm:px-3 pb-10">
	<div class="mx-auto pt-4 max-w-7xl">
		<div
			class="flex md:flex-col md:justify-start md:items-start md:gap-4 items-end justify-between"
		>
			<div class="flex items-start justify-start gap-3 flex-col">
				<h4 class="font-semibold text-base">
					{category.text}
				</h4>
				<p class="text-[13px] font-medium text-slate-500">
					This listing includes adverts related to {category.text}
				</p>
			</div>
			<div>
				<div class="flex relative items-center gap-2">
					<span class="font-medium capitalize text-sm text-slate-500">Sort by:</span>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-missing-attribute -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<a
						on:click={() => {
							showSortDropdown = !showSortDropdown;
						}}
						class="px-4 py-[8px] flex gap-3 bg-white hover:bg-slate-100 cursor-pointer items-center font-medium border border-slate-200 rounded-[3px] text-[13.5px] text-slate-700 capitalize"
					>
						<span>{sorts.find((e) => e.value === activeSort)?.name}</span>
						<Icon
							icon="fluent:chevron-down-12-filled"
							class={showSortDropdown ? 'rotate-180 transition-all' : ''}
						/>
					</a>
					{#if showSortDropdown}
						<ul
							use:clickOutside
							on:click_outside={() => {
								showSortDropdown = false;
							}}
							class="bg-white z-50 right-0 group-hover:block border border-slate-200 rounded-[3px] top-11 shadow-lg w-[200px] px-2 py-1 absolute"
						>
							{#each sorts as sort}
								<li>
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-missing-attribute -->
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<a
										class="text-[13px] {activeSort === sort.value
											? 'bg-slate-100 '
											: ''} rounded-[3px] cursor-pointer capitalize px-2 hover:bg-slate-100 my-[2px] text-slate-600 py-2 flex font-medium"
										on:click={() => {
											showSortDropdown = false;
										}}
									>
										{sort.name}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		</div>

		{#if adverts.length === 0}
			<div class="max-w-xl mx-auto sm:px-3 flex flex-col h-[50vh]">
				<div class="py-24">
					<div class="flex flex-col justify-center items-center gap-4 text-center">
						<p class="text-xs font-semibold text-orange-600 uppercase tracking-wide">
							Not available
						</p>
						<h1 class="mt-2 sm:text-base text-xl font-extrabold text-gray-900 tracking-tight">
							No adverts found in {category.text}
						</h1>
						<p class="mt-2 text-sm leading-7 font-medium text-gray-500">
							Sorry, we couldn’t find any advert associated with {category.text}
						</p>
						<div class="mt-6">
							<a
								href="/"
								class="text-sm gap-3 flex items-center font-medium text-orange-600 hover:text-[#f0b111]"
								>Go back home<span aria-hidden="true"> &rarr;</span></a
							>
						</div>
					</div>
				</div>
			</div>
		{/if}
		<div class="mt-4">
			<div class="grid md:grid-cols-2 grid-cols-5 gap-3">
				{#each adverts as item}
					<ItemCard
						image={item.images[0]}
						price={item.price}
						name={item.name}
						description={item.description}
						category={item.category}
						createdAt={item.createdAt}
						id={item.id}
						author={item.author}
					/>
				{/each}
			</div>
		</div>

		{#if adverts.length !== 0}
			<div class="flex- hidden items-center justify-center py-8">
				<!-- svelte-ignore a11y-missing-attribute -->
				<a
					class="inline-flex bg-white gap-2 outline-none items-center truncate justify-center relative my-1 cursor-pointer select-none transition-all active:scale-95 bg-opacity-50 hover:bg-opacity-75 border border-dashed px-4 py-[8px] font-medium text-[12.5px] text-slate-700 border-slate-300 rounded-full"
				>
					<Icon icon="charm:refresh" class="text-sm" />
					Load More
				</a>
			</div>
		{/if}
	</div>
</section>
