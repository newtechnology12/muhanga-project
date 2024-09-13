<script lang="ts">
	import Icon from '@iconify/svelte';
	import categories from '../../data/categories';
	import slugify from '../../utils/slugify';
	import { ChevronDownIcon, SearchIcon } from 'svelte-feather-icons';
	import { goto } from '$app/navigation';

	let search_text;

	let category = 'all';

	const handleSubmit = (e) => {
		e.preventDefault();
		if (search_text) goto(`/search?category=${category}&q=${search_text}`);
	};
</script>

<div class=" max-w-7xl px-3 md:hidden pt-4 mx-auto">
	<div class=" h-fit mx-auto pt-10 lg:h-fit relative mt-0 rounded-[4px] overflow-hidden">
		<div class="bg-black w-full h-full z-10 grid inset-0 absolute opacity-40" />
		<div
			class="relative z-30 py-14 h-fit flex-col bg-slate-300- flex justify-center max-w-2xl sm:px-4 px-12 lg:px-8 lg:pb-14 lg:mt-12"
		>
			<h2
				class="text-white -mt-12 text-3xl lg:text-xl leading-[50px] lg:leading-[31px] font-bold capitalize"
			>
				Buy and sell Land plots in Rwanda, Kigali and other cities.
			</h2>
			<p
				class="text-slate-100 sm:line-clamp-3 line-clamp-3 leading-10 sm:mt-4 mt-6 capitalize font-medium- text-[16px] lg:text-[15px]"
			>
				Find the best deals of land plots in Rwanda, Kigali and other cities. We have a wide range
				of land plots.
			</p>
			<div class="mt-5">
				<form
					on:submit={handleSubmit}
					class="relative bg-white border-orange-300 focus-within:border-[#f0b111] rounded-[2px] px-2 py-1 flex border flex-1 items-center"
				>
					<!-- svelte-ignore a11y-missing-attribute -->
					<a class="cursor-pointer gap-2 px-2 p-2 transform flex items-center">
						<select
							bind:value={category}
							class="text-[12.5px] w-28 capitalize outline-none font-medium text-slate-600"
						>
							<option value="all">All categories </option>
							{#each categories as category}
								<option value={slugify(category.slug)}>
									{category.text}
								</option>
							{/each}
						</select>
					</a>
					<div class="h-5 w-[0.2px] bg-[#f0b111] flex items-center mx-2" />
					<input
						bind:value={search_text}
						class="flex-1 font-normal outline-none placeholder:text-[13px] text-[13px] text-slate-500 px-2 py-2"
						placeholder="I am looking for..."
						type="text"
					/>
					<button class="cursor-pointer p-2">
						<SearchIcon class="text-sm text-gray-600" size={'16'} />
					</button>
				</form>
			</div>
		</div>
		<img
			src={'https://www.justlead.in/upload/propertyimages/JL_1606889256plot2.jpg'}
			alt=""
			class="h-full w-full top-0 absolute object-cover object-left"
		/>
	</div>
</div>
