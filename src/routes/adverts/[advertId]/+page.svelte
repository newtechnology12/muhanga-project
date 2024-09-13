<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import StartChatModal from '$lib/components/StartChatModal.svelte';
	import Icon from '@iconify/svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime.js';
	import { authStore } from '../../../stores/auth.js';
	import MakeOfferModal from '$lib/components/MakeOfferModal.svelte';
	import { marked } from 'marked';
	import Lightbox from '$lib/components/lightbox.client.svelte';
	import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
	import { firestore } from '../../../config/firebase.js';
	import toast from 'svelte-french-toast';
	import Loader from '$lib/components/Loader.svelte';
	import { fade } from 'svelte/transition';
	import MapPreview from '$lib/components/MapPreview.svelte';
	import ItemDetailsRight from '$lib/components/ItemDetailsRight.svelte';

	function truncateString(str, maxLength) {
		if (str.length > maxLength) {
			return str.slice(0, maxLength) + '...';
		} else {
			return str;
		}
	}

	dayjs.extend(relativeTime);

	export let data;

	const advert = data.advert;

	$: specifications = advert.specifications;

	$: images = advert.images;

	let currentImageIndex = 0;

	const handleLeftClick = () => {
		currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
	};

	const handleRightClick = () => {
		currentImageIndex = (currentImageIndex + 1) % images.length;
	};

	const handleOneCar = (index: number) => {
		currentImageIndex = index;
	};

	$: authSession = $authStore;

	let showLightbox = false;

	let controller: any;

	let isSaving = false;

	let isSaved = false;

	const handleSave = () => {
		isSaving = true;
		if (isSaved) {
			return deleteDoc(doc(firestore, 'users', authSession.user.uid, 'saved_adverts', advert.id))
				.then((e) => {
					isSaving = false;
					isSaved = false;
					toast.success('Advert unsaved sucessfully');
				})
				.catch((e) => {
					isSaving = false;
					toast.error(e.message);
				});
		} else {
			return setDoc(doc(firestore, 'users', authSession.user.uid, 'saved_adverts', advert.id), {
				images: advert.images,
				price: advert.price,
				name: advert.name,
				description: advert.description,
				category: advert.category,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp()
			})
				.then((e) => {
					isSaving = false;
					isSaved = true;
					toast.success('Advert saved sucessfully');
				})
				.catch((e) => {
					isSaving = false;
					toast.error(e.message);
				});
		}
	};

	let showMap = false;

	const requestCallBack = () => {};
</script>

<Lightbox
	images={images.map((image) => image)}
	bind:controller
	title={advert.name}
	open={showLightbox}
/>

<Seo title={advert?.name} description={advert?.description} />

<section class="px-5 sm:px-3 lg:px-5 sm:pb-20 py-5 lg:my-0">
	<div
		class="mx-auto max-w-7xl gap-4 md:gap-0 md:gap-y-3 grid grid-cols-4 md:grid-cols-1 items-start"
	>
		<div class="col-span-3 relative">
			<div
				class="overflow-hidden rounded-t-md rounded-sm lg:h-[500px] h-[600px] md:h-[300px] relative"
			>
				<button
					on:click={handleLeftClick}
					class="  cursor-pointer font-bold absolute top-1/2 transform"
				>
					<Icon icon="iconamoon:arrow-left-2-bold" class="text-5xl text-white md:text-4xl" />
				</button>
				<img
					on:click={() => {
						controller.openImage(currentImageIndex);
					}}
					src={images[currentImageIndex]
						? images[currentImageIndex]
						: 'https://gwc.jumpoffcampus.com/packs/media/images/no_image_found-9e0d3041.png'}
					alt="img"
					class="w-full h-full bg-white cursor-zoom-in border border-slate-200 object-contain object-center-"
				/>
				<button
					on:click={handleRightClick}
					class="ursor-pointer text-white font-bold absolute top-1/2 right-0 transform"
				>
					<Icon icon="iconamoon:arrow-right-2-bold" class="text-5xl md:text-4xl c" />
				</button>
			</div>

			<div class="mt-[6px]">
				{#if images.length > 1}
					<div class="grid grid-cols-4 gap-[6px] mt-0">
						{#each images.slice(0, 4) as image, index}
							<button
								on:click={() => handleOneCar(index)}
								class=" h-full lg:h-full relative sm:h-20 rounded-sm border border-slate-100 bg-slate-50 cursor-pointer mt-0 first-of-type:rounded-bl-md last-of-type:rounded-br-md overflow-hidden"
							>
								<div class={`${index === 3 && images.length > 4 ? 'block' : 'hidden'}`}>
									<div class="bg-gray-900 w-full h-full z-10 grid inset-0 absolute opacity-50" />
									<div class="w-full h-full grid absolute z-50">
										<div
											class="text-white flex bg-yellow-50- items-center justify-center gap-1 flex-col capitalize"
										>
											<span class="text-lg">+2</span>
											<span class="text-[12px] font-medium">Images</span>
										</div>
									</div>
								</div>
								<img
									src={image}
									alt=""
									class="h-full w-full bg-white border border-slate-200 object-contain aspect-video object-center"
								/>
							</button>
						{/each}
					</div>
				{/if}

				<div class="space-y-3- md:block mt-4 hidden lg:order-1">
					<ItemDetailsRight {advert} />
				</div>
				<div class="border border-gray-200 bg-white mt-4 rounded-[4px] lg:px-5 px-7 sm:px-3 pb-10">
					<div class="border-b border-b-slate-300 border-dashed pb-2 pt-3 space-y-2">
						<div class="flex justify-between items-center">
							<div>
								<p class="text-lg sm:text-base !leading-8 font-bold">{advert.name}</p>
							</div>
							<div class=" flex items-center gap-1">
								<!-- svelte-ignore a11y-missing-attribute -->
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<a
									on:click={() => handleSave()}
									class="p-3 rounded-full cursor-pointer bg-orange-50 hover:bg-orange-100"
								>
									{#if isSaving}
										<Loader />
									{:else if isSaved}
										<svg
											class="text-base text-[#f0b111] font-bold"
											width="17"
											height="17"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											><path
												fill="currentColor"
												fill-rule="evenodd"
												d="M21 11.098v4.993c0 3.096 0 4.645-.734 5.321c-.35.323-.792.526-1.263.58c-.987.113-2.14-.907-4.445-2.946c-1.02-.901-1.529-1.352-2.118-1.47a2.225 2.225 0 0 0-.88 0c-.59.118-1.099.569-2.118 1.47c-2.305 2.039-3.458 3.059-4.445 2.945a2.238 2.238 0 0 1-1.263-.579C3 20.736 3 19.188 3 16.091v-4.994C3 6.81 3 4.666 4.318 3.333C5.636 2 7.758 2 12 2c4.243 0 6.364 0 7.682 1.332C21 4.665 21 6.81 21 11.098ZM8.25 6A.75.75 0 0 1 9 5.25h6a.75.75 0 0 1 0 1.5H9A.75.75 0 0 1 8.25 6Z"
												clip-rule="evenodd"
											/></svg
										>
									{:else}
										<svg
											class="text-base text-[#f0b111] font-bold"
											xmlns="http://www.w3.org/2000/svg"
											width="17"
											height="17"
											viewBox="0 0 24 24"
											><g fill="none" stroke="currentColor" stroke-width="1.5"
												><path
													d="M21 16.09v-4.992c0-4.29 0-6.433-1.318-7.766C18.364 2 16.242 2 12 2C7.757 2 5.636 2 4.318 3.332C3 4.665 3 6.81 3 11.098v4.993c0 3.096 0 4.645.734 5.321c.35.323.792.526 1.263.58c.987.113 2.14-.907 4.445-2.946c1.02-.901 1.529-1.352 2.118-1.47c.29-.06.59-.06.88 0c.59.118 1.099.569 2.118 1.47c2.305 2.039 3.458 3.059 4.445 2.945c.47-.053.913-.256 1.263-.579c.734-.676.734-2.224.734-5.321Z"
												/><path stroke-linecap="round" d="M15 6H9" opacity=".5" /></g
											></svg
										>
									{/if}
								</a>
							</div>
						</div>
						<div class="flex lg:flex-col justify-between items-center pb-3 lg:items-start">
							<!-- first div -->
							<div class="flex gap-3 items-center">
								<div class="flex gap-2 text-slate-500 font-medium items-center">
									<Icon icon="akar-icons:location" class="text-base font-bold" />
									<p class="text-xs capitalize">{advert.city}</p>
								</div>
							</div>
						</div>
					</div>
					<!-- more info parts -->
					<div class="border-b border-dashed pb-7 border-gray-300">
						<div class="pt-3 gap-6 grid-cols-2 grid">
							{#each specifications as specification}
								<div class="space-y-4">
									<p class="text-[13px] font-semibold">{specification.key}</p>
									<p class="text-xs font-medium text-gray-500">{specification.value}</p>
								</div>
							{/each}
						</div>
					</div>
					<div class="py-5 flex flex-col">
						<div class="">
							<div class="flex items-center gap-3">
								<div class="">
									<Icon icon="lucide:store" class="text-base font-bold" />
								</div>
								<p class="text-gray-900 capitalize font-bold text-[13px]">Store address</p>
							</div>
							<div class="pt-6 space-y-4">
								<div class="flex gap-3 mt-2 items-start">
									<div>
										<Icon icon="akar-icons:location" class="text-base font-bold" />
									</div>
									<div>
										<div class="space-y-3">
											<p class="text-xs text-slate-700 font-medium capitalize underline">
												Kigali, Rwanda
											</p>
										</div>
										<!-- <div class="mt-3 space-y-2">
											<p class="text-[13px] font-medium underline">More Info:</p>
											<p class="text-[13px] leading-7 font-medium text-slate-600 mt-1">
												Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis,
												aspernatur.
											</p>
										</div> -->
									</div>
								</div>
								<div class="flex gap-4 pt-4 items-center px-1">
									<Icon icon="octicon:clock-16" class="text-md text-slate-600" />
									<div class="flex font-medium items-center gap-2">
										<p class="text-[13px] capitalize text-[#f0b111]">Open</p>
										<p class="text-[13px] text-slate-600 capitalize">Monday-Sunday: 24/7</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="border-t mt-4 py-4 border-dashed border-gray-300">
						<div class="flex items-center pt-2 gap-3">
							<div class="">
								<Icon icon="majesticons:checkbox-list-detail-line" class="text-base font-bold" />
							</div>
							<p class="text-gray-900 capitalize font-bold text-[13px]">Description</p>
						</div>
						<div class="mt-4 prose">
							<div
								class="text-[13px] font-medium text-slate-600 leading-8 prose-a:cursor-pointer prose-a:text-[#f0b111]"
							>
								{@html marked.parse(advert?.description?.toString())}
							</div>
						</div>
					</div>

					<!-- <div class="border-t mt-4 py-4 border-dashed border-gray-300">
						<div class="flex items-center pt-2 gap-3">
							<div class="">
								<Icon icon="tdesign:location" class="text-base font-bold" />
							</div>
							<p class="text-gray-900 capitalize font-bold text-[13px]">Location on map</p>
						</div>
						<div class="mt-4 w-full">
							<div class="h-[300px] relative rounded-[3px] border border-slate-200 w-full">
								{#if !showMap}
									<img
										class="h-full object-contain w-full"
										src="https://staticmapmaker.com/img/google-placeholder.png"
										alt=""
									/>
								{:else if advert.location}
									<MapPreview cords={advert.location} />
								{:else}
									<div
										class="flex items-center bg-slate-50 text-slate-600 h-full justify-center text-[13px] font-medium"
									>
										<span>No Location available</span>
									</div>
								{/if}
								{#if !showMap}
									<div
										transition:fade={{ delay: 100, duration: 250 }}
										class="absolute select-none h-full w-full backdrop-blur-md flex justify-center items-center bg-white bg-opacity-50 inset-0 transition-opacity"
									>
										<a
											on:click={() => (showMap = true)}
											class="flex cursor-pointer items-center gap-2 font-medium border text-[13px] bg-white rounded-full px-5 py-2"
										>
											<Icon icon="tdesign:location" class="text-base font-bold" />
											<span>Show on map</span>
										</a>
									</div>
								{/if}
							</div>
						</div>
					</div> -->
				</div>
			</div>
		</div>
		<div class="space-y-3- md:hidden lg:order-1">
			<ItemDetailsRight {advert} />
		</div>
	</div>
</section>
