<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import ItemCard from './ItemCard.svelte';
	import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
	import { ArrowLeftIcon, ArrowRightIcon } from 'svelte-feather-icons';
	export let adverts;

	let emblaApi;

	function onInit(event) {
		emblaApi = event.detail;
		console.log(emblaApi.slideNodes()); // Access API
	}

	const next = () => {
		emblaApi.scrollNext();
	};

	const prev = () => {
		emblaApi.scrollPrev();
	};
</script>

<div class="max-w-7xl px-2 mx-auto relative">
	<div
		class="embla bg-yellow-500- mx-auto max-w-7xl mt-4 relative overflow-hidden"
		use:emblaCarouselSvelte={{
			plugins: [WheelGesturesPlugin()],
			options: { slidesToScroll: 4 }
		}}
		on:emblaInit={onInit}
	>
		<div class="embla__container px-3- mx-auto">
			{#each adverts as item}
				<div class="embla__slide">
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
				</div>
			{/each}
		</div>
	</div>
	<button
		on:click={prev}
		class="embla__prev sm:h-7 sm:w-7 bg-white lg:!left-3 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-lg hover:bg-accent hover:text-accent-foreground absolute h-9 w-9 touch-manipulation rounded-full -left-7 top-[40%] -translate-y-1/2"
	>
		<ArrowLeftIcon size="14" />
	</button>
	<button
		on:click={next}
		class="embla__next sm:h-7 sm:w-7 inline-flex lg:!right-3 bg-white items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-lg hover:bg-accent hover:text-accent-foreground absolute h-9 w-9 touch-manipulation rounded-full -right-7 top-[40%] -translate-y-1/2"
	>
		<ArrowRightIcon size="14" />
	</button>
</div>
