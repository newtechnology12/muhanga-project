<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Icon from '@iconify/svelte';
	import { cn } from '../../utils/cn';
	import { createQuery } from '@tanstack/svelte-query';
	import { collection, getDocs } from 'firebase/firestore';
	import { firestore } from '../../config/firebase';
	import { authStore } from '../../stores/auth';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import Skeleton from '$lib/components/Skeleton.svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	$: authSession = $authStore;

	$: savedAdvertsQuery = createQuery({
		queryFn: () =>
			getDocs(collection(firestore, 'users', authSession.user.uid, 'saved_adverts')).then(
				(e): any => e.docs.map((e) => ({ ...e.data(), id: e.id }))
			),
		queryKey: ['saved_adverts', authSession?.user?.uid],
		enabled: Boolean(authSession?.user)
	});

	$: {
		if (browser) {
			if (!authSession?.loggedIn && !authSession?.loading) {
				goto('/login');
			}
		}
	}
</script>

<Seo title="Saved adverts" />

<div class="max-w-6xl space-y-8 mx-auto sm:pt-4 pt-8 pb-12 sm:px-3">
	<div
		class="flex items-start border-b border-slate-300 border-dashed pb-4 justify-start gap-3 flex-col"
	>
		<div
			class="flex items-center sm:flex-col sm:justify-start sm:items-start space-y-3 justify-between w-full"
		>
			<div class="space-y-2">
				<div class="flex items-center gap-2">
					<h4 class="font-semibold text-base">My Saved Adverts.</h4>
					<Icon icon="gg:arrow-down" class="text-lg animate-bounce" />
				</div>
				<p class="bg-grey-light text-[13px] leading-7 font-medium text-slate-600 w-full rounded-md">
					View and manage your the adverts that you have saved to view later.
				</p>
			</div>
			<div class="flex sm:hidden items-center gap-3">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-missing-attribute -->
				<a
					href="/"
					class={cn(
						'px-5 py-[8px] cursor-pointer flex items-center gap-2 bg-slate-200 rounded-[4px] text-slate-600 text-[12.5px] font-medium'
					)}
				>
					Go Back home
				</a>
			</div>
		</div>
	</div>

	<div>
		{#if $savedAdvertsQuery.status === 'pending'}
			<div class={`grid grid-cols-4 gap-3 mt-7 sm:gap-2 lg:grid-cols-2 sm:px-2 lg:px-4`}>
				{#each [1, 2, 3, 4, 5, 6, 7, 8] as _}
					<div class="bg-white p-[6px] rounded-md">
						<div>
							<Skeleton className="h-[200px] w-full" />
						</div>
						<div class="mt-3 flex items-center w-full justify-between">
							<Skeleton className="h-[20px] w-[60%]" />
							<Skeleton className="h-[15px] w-[30%]" />
						</div>
						<div class="mt-4 space-y-3">
							<Skeleton className="h-[15px] w-[80%]" />
							<Skeleton className="h-[15px] w-[50%]" />
						</div>
						<div
							class="mt-3 border-t border-opacity-10 pt-3 pb-1 flex items-center w-full justify-between"
						>
							<Skeleton className="h-[20px] w-[40%]" />
							<Skeleton className="h-[15px] w-[30%]" />
						</div>
					</div>
				{/each}
			</div>
		{/if}
		{#if $savedAdvertsQuery.status === 'success'}
			<div class={`grid grid-cols-4 gap-3 mt-7 sm:gap-2 lg:grid-cols-2 sm:px-0 lg:px-4`}>
				{#each $savedAdvertsQuery.data as item}
					<ItemCard
						image={item.images[0]}
						price={item.price}
						name={item.name}
						description={item.description}
						category={item.category}
						createdAt={item.createdAt}
						id={item.id}
						unSaveActionCompleted={() => {
							$savedAdvertsQuery.refetch();
						}}
						isSavedAlready={true}
						author={item.author}
					/>
				{/each}
			</div>

			{#if $savedAdvertsQuery?.data?.length === 0}
				<div class="max-w-xl mx-auto flex flex-col h-[50vh]">
					<div class="py-24">
						<div class="flex flex-col justify-center items-center gap-4 text-center">
							<p class="text-xs font-semibold text-orange-600 uppercase tracking-wide">Empty</p>
							<h1 class="mt-2 text-xl font-extrabold text-gray-900 tracking-tight sm:text-lg">
								You have no adverts saved.
							</h1>
							<p class="mt-2 text-sm font-medium text-gray-500">
								Next time When you save your adverts they will be displayed here.
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
		{/if}

		{#if $savedAdvertsQuery.status === 'error'}
			<div class="w-full flex items-center justify-center h-[500px]">
				<span class="text-[13.5px] font-medium text-slate-600">
					Some thing went wrong while fetcing your saved adverts
				</span>
			</div>
		{/if}
	</div>
</div>
