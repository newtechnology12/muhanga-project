<script>
	import Avatar from '$lib/components/Avatar.svelte';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ButtonStroke from '$lib/components/form/ButtonStroke.svelte';
	import Icon from '@iconify/svelte';
	import { authStore } from '../../../stores/auth';
	import StartChatModal from '$lib/components/StartChatModal.svelte';

	export let data;
	const profile = data.profile;
	const adverts = data.adverts;

	$: authSession = $authStore;

	let showStartChatModal = false;
</script>

<Seo title={profile?.first_name + ' ' + profile?.last_name} />

<StartChatModal
	hideSuggestions
	reciever={profile}
	open={showStartChatModal}
	close={() => (showStartChatModal = false)}
/>

<div class="max-w-7xl mx-auto px-3 py-4">
	<div class="bg-white border px-3 py-6 border-slate-200 rounded-md">
		<div class="px-3 flex md:flex-col md:justify-center md:text-center gap-5 items-center">
			<div class="border-[2px] border-dashed border-[#f0b111] w-fit p-1 rounded-full">
				<Avatar
					size="2xl"
					rounded="full"
					src={profile?.photo}
					name={profile?.first_name + ' ' + profile?.last_name}
				/>
			</div>
			<div class="space-y-3">
				<div class="flex items-center md:justify-center gap-3">
					<h4 class="font-bold capitalize text-sm">
						{profile?.first_name + ' ' + profile?.last_name}
					</h4>
					<Icon icon="material-symbols:verified" class="text-[#f0b111]" />
				</div>
				<p class="text-[13px] md:line-clamp-2 leading-7 max-w-2xl text-slate-600 font-medium">
					{profile?.bio || ''}
				</p>
				<div
					class="grid grid-cols-2 md:flex md:justify-center md:flex-wrap md:mt-3 md:items-center max-w-md gap-5"
				>
					<p class="flex gap-2 text-[12.5px] font-medium text-slate-600 items-center">
						<Icon icon="humbleicons:clock" class="text-slate-500 text-base" />
						<span>
							{profile.createdAt
								? new Date(profile.createdAt).toLocaleDateString('en-US', {
										day: '2-digit',
										month: 'long',
										year: 'numeric'
								  })
								: 'N/A'}
						</span>
					</p>
					<p class="flex gap-2 text-[12.5px] font-medium text-slate-600 items-center">
						<Icon icon="material-symbols:location-on-outline" class="text-slate-500 text-base" />
						<span> {profile.address || 'No address available'} </span>
					</p>
					<p class="flex gap-2 text-[12.5px] font-medium text-slate-600 items-center">
						<Icon icon="uil:phone" class="text-slate-500 text-base" />
						{#if profile.phone}
							<a href={`tel:${profile.phone}`} class="hover:underline">{profile.phone}</a>
						{:else}
							Not available
						{/if}
					</p>
				</div>
				<div class="sm:flex sm:items-center sm:justify-center">
					{#if authSession?.user?.uid && profile?.id !== authSession?.user?.uid}
						<div class="mt-3 sm:mt-0 w-fit">
							<div class="mt-6 sm:mt-3 gap-3 grid">
								<ButtonStroke
									on:click={() => (showStartChatModal = true)}
									title="Send a Message"
									icon="lets-icons:message"
								/>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
		<div />
	</div>
	<div class="mx-auto max-w-7xl gap-10">
		<div class="lg:mt-2">
			<div class="mt-4 relative">
				<div
					class="border-b pb-4 pt-2 border-dashed border-gray-300 md:gap-4 flex lg:flex-col justify-between items-center"
				>
					<div class="flex items-center gap gap-3 lg:order-2">
						<h1 class="text-sm capitalize font-bold tracking-wide">
							Browse all listings from ntwali edson
						</h1>
						<Icon icon="gg:arrow-down" class="text-lg animate-bounce" />
					</div>
					<div class="lg:order-1">
						<div class="flex gap-3 items-center">
							<p class="text-[13px] font-medium capitalize text-gray-700">
								Have something to sell?
							</p>
							<a
								href="/new-advert"
								class="text-[#f0b111] text-sm hover:no-underline underline flex items-center gap-1"
							>
								<span>Post for free</span>
							</a>
						</div>
					</div>
				</div>
			</div>
			<div class={`grid grid-cols-5 gap-3 mt-7 sm:gap-2 lg:grid-cols-2 sm:px-0 lg:px-4`}>
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

			{#if adverts?.length === 0}
				<div class="max-w-xl mx-auto flex flex-col h-[50vh]">
					<div class="py-24">
						<div class="flex flex-col justify-center items-center gap-4 text-center">
							<p class="text-xs font-semibold text-orange-600 uppercase tracking-wide">Empty</p>
							<h1 class="mt-2 text-xl font-extrabold text-gray-900 tracking-tight sm:text-lg">
								You have no adverts yet.
							</h1>
							<p class="mt-2 text-sm max-w-lg font-medium- leading-8 text-gray-500">
								You can start by posting your first advert, it's free and easy, click the button
								below to get started.
							</p>
							<div class="mt-6">
								<a
									href="/new-advert"
									class="text-sm gap-3 flex items-center font-medium text-orange-600 hover:text-[#f0b111]"
									>Post your ad<span aria-hidden="true"> &rarr;</span></a
								>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<div class="flex- hidden items-center justify-center py-8">
				<!-- svelte-ignore a11y-missing-attribute -->
				<a
					class="inline-flex bg-white gap-2 outline-none items-center truncate justify-center relative my-1 cursor-pointer select-none transition-all active:scale-95 bg-opacity-50 hover:bg-opacity-75 border border-dashed px-4 py-[8px] font-medium text-[12.5px] text-slate-700 border-slate-300 rounded-full"
				>
					<Icon icon="charm:refresh" class="text-sm" />
					Load More
				</a>
			</div>
		</div>
	</div>
</div>
