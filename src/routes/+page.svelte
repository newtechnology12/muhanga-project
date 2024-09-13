<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Icon from '@iconify/svelte';
	import Seo from '$lib/components/Seo.svelte';
	export let data;
	const { popular } = data;
	import ItemCard from '$lib/components/ItemCard.svelte';
</script>

<Seo />
<section>
	<Hero />

	<div class="mx-auto pb-12 pt-0 sm:pb-20 max-w-7xl gap-10">
		<div class="lg:mt-2- pt-1">
			<div class="mt-4 px-3 relative max-w-7xl mx-auto">
				<div
					class="border-b pb-4 border-dashed border-gray-300 md:gap-4 flex justify-between items-center"
				>
					<div class="flex items-center gap gap-3">
						<h1 class="text-sm sm:text-xs- capitalize font-bold tracking-wide">Trending Plots</h1>
						<Icon icon="gg:arrow-down" class="text-lg sm:text-sm animate-bounce" />
					</div>
					<div class="">
						<div class="flex gap-3 items-center">
							<p class="text-[13px] sm:hidden font-medium- capitalize text-gray-700">Sort By</p>
							<div>
								<select
									class=" bg-white border border-gray-300 px-2 py-1 rounded-[4px] text-[13px] font-medium-"
								>
									<option value="newest">Popular</option>
									<option value="newest">Newest</option>
									<option value="oldest">Oldest</option>
									<option value="price">Price</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class={`grid grid-cols-5 gap-3 mt-4 sm:gap-2 lg:grid-cols-2 sm:px-2 px-3`}>
				<!-- <ItemsCarousel adverts={popular} /> -->
				{#each popular as item}
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
			<div class="flex hidden- items-center justify-center py-8">
				<!-- svelte-ignore a11y-missing-attribute -->
				<a
					class="inline-flex pointer-events-none bg-white gap-2 outline-none items-center truncate justify-center relative my-1 cursor-pointer select-none transition-all active:scale-95 bg-opacity-50 hover:bg-opacity-75 border border-dashed px-4 py-[8px] font-medium text-[12.5px] text-slate-700 border-slate-300 rounded-full"
				>
					<Icon icon="charm:refresh" class="text-sm" />
					Load More
				</a>
			</div>
		</div>
	</div>
</section>
