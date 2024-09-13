<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import Icon from '@iconify/svelte';
	import { cn } from '../../utils/cn';
	import Seo from '$lib/components/Seo.svelte';
	import { page } from '$app/stores';
	import {
		Timestamp,
		collection,
		getDocs,
		onSnapshot,
		orderBy,
		query,
		where
	} from 'firebase/firestore';
	import { firestore } from '../../config/firebase';
	import { authStore } from '../../stores/auth';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime.js';
	import Skeleton from '$lib/components/Skeleton.svelte';
	import { onDestroy } from 'svelte';
	import Chatbox from '$lib/components/Chatbox.svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { FileIcon, ImageIcon } from 'svelte-feather-icons';

	dayjs.extend(relativeTime);

	function formatDateTime(date) {
		const now = dayjs();
		const targetDate = dayjs(date);

		// Check if the date is within the same day
		if (now.isSame(targetDate, 'day')) {
			return targetDate.format('h:mm A'); // Display time if it's today
		} else if (now.diff(targetDate, 'day') === 1) {
			return 'Yesterday'; // Display 'Yesterday' if it's yesterday
		} else {
			return targetDate.format('MMM D'); // Display date if it's more than a day ago
		}
	}

	function truncateString(str, maxLength) {
		if (str.length > maxLength) {
			return str.slice(0, maxLength) + '...';
		} else {
			return str;
		}
	}

	$: authSession = $authStore;

	$: q = query(
		collection(firestore, 'chats'),
		where('partcipantsIds', 'array-contains', authSession?.user?.uid || ''),
		orderBy('last_activity_timestamp', 'asc')
	);
	let active: any = undefined;

	// $: messagesQuery = createQuery({
	// 	queryFn: () => getDocs(q).then((e) => e.docs.map((e): any => ({ ...e.data(), id: e.id }))),
	// 	queryKey: ['messages'],
	// 	enabled: Boolean(authSession?.user)
	// });

	let unsubscribe;

	// Watch for changes in q and subscribe/unsubscribe accordingly
	$: {
		if (authSession?.user?.uid) {
			trySubscribe();
		}
	}

	let chats = [];

	let loading = true;

	function trySubscribe() {
		if (authSession?.user?.uid && !unsubscribe) {
			unsubscribe = onSnapshot(q, (querySnapshot) => {
				try {
					loading = false;
					querySnapshot.docChanges().forEach((change) => {
						console.log('subed');
						if (change.type === 'added') {
							chats = [
								{
									...change.doc.data(),
									id: change.doc.id,
									last_activity_timestamp:
										change.doc.data()?.last_activity_timestamp || Timestamp.fromDate(new Date())
								},
								...chats
							];
						} else if (change.type === 'modified') {
							chats = chats.map((e) =>
								e.id === change.doc.id
									? {
											...change.doc.data(),
											id: change.doc.id,
											last_activity_timestamp:
												change.doc.data()?.last_activity_timestamp || Timestamp.fromDate(new Date())
									  }
									: e
							);
						} else if (change.type === 'removed') {
							chats = chats.filter((e) => e.id !== change.doc.id);
						}
					});
				} catch (error) {
					// Handle error, e.g., log it or perform necessary cleanup
					console.error('Error in onSnapshot:', error);
				}
			});
		} else if (!q && unsubscribe) {
			// q is not available, unsubscribe if previously subscribed
			try {
				console.log('uns');
				unsubscribe();
			} catch (error) {
				// Handle error during unsubscribe, if necessary
				console.error('Error during unsubscribe:', error);
			}
			unsubscribe = null;
		}
	}

	// Check if q is defined before setting up the subscription

	onDestroy(() => {
		// Check if unsubscribe is defined before calling it
		if (unsubscribe) {
			try {
				unsubscribe();
				console.log('uns2');
			} catch (error) {
				// Handle error during unsubscribe, if necessary
				console.error('Error during unsubscribe:', error);
			}
		}
	});

	let chatSearch;
	$: chatsToShow = chatSearch
		? chats.filter((e) =>
				e.partcipants.find((e) => e.id !== authSession.user.uid)?.username?.includes(chatSearch)
		  )
		: chats;

	$: {
		if (browser) {
			if (!authSession?.user && !authSession?.loading) {
				// goto('/login');
			}
		}
	}
</script>

<Seo title="Messages" />

<div class="pb-6 sm:pb-6 py-4 sm:p-0 sm:h-full lg:px-5">
	<div
		class="max-w-7xl h-[700px] sm:h-full grid grid-cols-7 sm:border-0 lg:grid-cols-1 rounded-[4px] white border bg-white mx-auto"
	>
		<div
			class={cn('col-span-2 border-r', {
				'lg:hidden': Boolean($page?.params?.conversation_id),
				'lg:block': !Boolean($page?.params?.conversation_id)
			})}
		>
			<div class="flex h-full flex-col">
				<div class="flex py-2 px-3 border-b items-center justify-between">
					<h4 class="font-medium text-[13.5px]">Messages</h4>
					<a
						class="h-8 w-8 pointer-events-none rounded-[4px] flex items-center justify-center hover:bg-slate-100"
						href="/"
					>
						<Icon class="text-sm" icon="octicon:plus-circle-16" />
					</a>
				</div>
				<div class="px-3 py-2">
					<div
						class="bg-slate-100 focus-within:border-blue500 rounded-[4px] border-slate-200 border flex items-center gap-3 py-2 px-4"
					>
						<Icon class="text-base text-slate-500" icon="iconamoon:search-bold" />
						<input
							class="bg-transparent py-[2px] font-medium- text-slate-600 outline-none w-full text-[12.5px]"
							placeholder="Search here.."
							type="text"
							bind:value={chatSearch}
							name=""
							id=""
						/>
					</div>
				</div>
				<div class="bg-white overflow-y-auto border-t flex-1">
					{#if loading}
						<div class="px-3 py-1">
							{#each [1, 2, 3, 4, 5, 6] as l}
								<div class="flex py-2 items-center gap-2">
									<div>
										<Skeleton className="w-[40px] h-[40px] rounded-full" />
									</div>
									<div class="flex flex-col gap-3">
										<Skeleton className="w-[150px] h-3" />
										<Skeleton className="w-[110px] h-2" />
									</div>
								</div>
							{/each}
						</div>
					{/if}
					{#if chatsToShow.length === 0 && !loading}
						<div class="h-[300px] flex items-center justify-center">
							<span class="text-[13px] font-medium text-slate-500">
								You don't have any messages yet.
							</span>
						</div>
					{/if}
					<div>
						{#each chatsToShow as chat}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<!-- svelte-ignore a11y-missing-attribute -->
							<a
								href={`/messages/${chat.id}`}
								class={cn(
									'flex relative hover:bg-slate-100 cursor-pointer px-4 py-2 my-1 first-of-type:mt-0 w-full items-center gap-4',
									{
										'bg-slate-100': $page.url.pathname === `/messages/${chat?.id}`
									}
								)}
							>
								{#if $page.url.pathname === `/messages/${chat?.id}`}
									<div class="h-full w-[3px] rounded-r-md absolute left-0 bg-[#f0b111]" />
								{/if}
								<div class="flex">
									<Avatar
										rounded="full"
										src={chat?.partcipants?.find((e) => e?.id !== authSession?.user?.uid)?.photo}
										name={chat?.partcipants?.find((e) => e?.id !== authSession?.user?.uid)
											?.username}
									/>
								</div>
								<div class="w-full flex items-center gap-4 space-y-2">
									<div class="flex w-full flex-col gap-2">
										<div class="flex items-center justify-between">
											<h4 class="font-semibold capitalize text-[12.8px]">
												{chat?.partcipants?.find((e) => e?.id !== authSession?.user?.uid)?.username}
											</h4>
											<span class="font-medium truncate text-slate-500 text-[11.5px]">
												{formatDateTime(new Date(chat.last_activity_timestamp.toDate()))}
											</span>
										</div>
										<div class="flex items-center justify-between gap-3">
											<p class="font-medium truncate flex items-center text-xs text-slate-500">
												{chat?.last_message?.sender === authSession?.user?.uid ? 'You:' : ''}
												{#if chat?.last_message.message_type === 'image'}
													<div class="flex ml-2 items-center gap-1">
														<ImageIcon size={'12'} />
														<span class="text-[12px]">Image</span>
													</div>
												{:else if chat?.last_message.message_type === 'document'}
													<div class="flex ml-2 items-center gap-1">
														<FileIcon size={'12'} />
														<span class="text-[12px]">Document</span>
													</div>
												{:else}
													{truncateString(chat?.last_message?.message, 35)}
												{/if}
											</p>
											{#if chat[`unread_count_${authSession?.user?.uid}`]}
												<div
													class="h-4 w-4 rounded-full text-[10px] font-medium text-white flex items-center justify-center bg-[#f0b111]"
												>
													{chat[`unread_count_${authSession?.user?.uid}`]}
												</div>
											{/if}
										</div>
									</div>
								</div>
							</a>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<div class={cn('col-span-5')}>
			<slot />

			{#if !$page?.params?.conversation_id}
				<div
					class="h-full sm:hidden gap-4 text-center max-w-xl mx-auto flex items-center justify-center flex-col w-full"
				>
					<img class="h-14" src="/chat.png" alt="" />
					<h4 class="font-medium text-base">Select a chat to view conversation</h4>
					<p class="text-[14px] font-medium- text-slate-500 leading-7">
						Use the left side menu to select existing chats <br /> or start a new one.
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
