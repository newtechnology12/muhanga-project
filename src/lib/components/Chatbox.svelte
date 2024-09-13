<script lang="ts">
	import Icon from '@iconify/svelte';
	import Avatar from './Avatar.svelte';
	import { authStore } from '../../stores/auth';
	import { onDestroy } from 'svelte';
	import {
		Timestamp,
		addDoc,
		collection,
		doc,
		getDoc,
		increment,
		onSnapshot,
		orderBy,
		query,
		serverTimestamp,
		updateDoc,
		writeBatch
	} from 'firebase/firestore';
	import { firestore, storage } from '../../config/firebase';
	import { marked } from 'marked';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime.js';
	import { createQuery } from '@tanstack/svelte-query';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Skeleton from './Skeleton.svelte';
	import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
	import toast from 'svelte-french-toast';
	import Loader from './Loader.svelte';
	import Lightbox from './lightbox.client.svelte';
	import { FileIcon } from 'svelte-feather-icons';
	import LocationPicker from './LocationPicker.svelte';
	import { clickOutside } from '../../directives/clickOutside';
	import { cn } from '../../utils/cn';

	let uploader: any;

	let chat_content;

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

	let controller: any;

	function urlify(text) {
		var urlRegex = /(https?:\/\/[^\s]+)/g;
		const d = text.replace(urlRegex, function (url) {
			return '<a href="' + url + '">' + url + '</a>';
		});
		console.log(text, '----');
		return d;
		// or alternatively
		// return text.replace(urlRegex, '<a href="$1">$1</a>')
	}
	$: authSession = $authStore;

	$: chatsQuery = createQuery({
		queryFn: () =>
			getDoc(doc(firestore, 'chats', $page.params.conversation_id)).then((e): any => ({
				...e.data(),
				id: e.id
			})),
		queryKey: ['chats', $page.params.conversation_id],
		enabled: Boolean(authSession?.user),
		staleTime: Infinity
	});

	$: if ($chatsQuery?.data?.id) {
		console.log('changed');
		if (unsubscribe) {
			unsubscribe();
			messages = [];
			handleSubscribe($chatsQuery?.data);
		} else {
			messages = [];
			handleSubscribe($chatsQuery?.data);
		}
	}

	let unsubscribe;

	let messages = [];

	function scrollToBottom() {
		console.log('--- going to bottom ---');

		// Scroll to the bottom with animation
		chat_content.scrollTop = chat_content?.scrollHeight;
	}

	$: {
		if (messages.length) {
			// handleUnreads(messages);
			setTimeout(() => {
				scrollToBottom();
			}, 200);
		}
	}

	let imageToShow;

	const handleSubscribe = (active) => {
		const q = query(
			query(collection(firestore, 'chats', active.id, 'messages'), orderBy('created_at', 'asc'))
		);
		unsubscribe = onSnapshot(q, (querySnapshot) => {
			try {
				querySnapshot.docChanges().forEach((change) => {
					if (change.type === 'added') {
						messages = [
							...messages,
							{
								...change.doc.data(),
								id: change.doc.id,
								last: change.doc.data()?.created_at || Timestamp.fromDate(new Date()),
								created_at: change.doc.data()?.created_at || Timestamp.fromDate(new Date())
							}
						];
					} else if (change.type === 'modified') {
						messages = messages.map((e) =>
							e.id === change.doc.id ? { ...change.doc.data(), id: change.doc.id } : e
						);
					} else if (change.type === 'removed') {
						messages = messages.filter((e) => e.id !== change.doc.id);
					}
				});
			} catch (error) {
				// Handle error, e.g., log it or perform necessary cleanup
				console.error('Error in onSnapshot:', error);
			}
		});
	};

	onDestroy(() => unsubscribe && unsubscribe());

	const handleUnreads = async (messages) => {
		const newMessages = messages.filter(
			(e) => e?.reciver?.id === authSession?.user?.uid && e.read_status === 'unread'
		);

		console.log(newMessages);

		const batch = writeBatch(firestore);
		newMessages.forEach((m) => {
			batch.update(doc(firestore, 'chats', $chatsQuery?.data.id, 'messages', m.id), {
				read_status: 'read'
			});
		});
		batch.update(doc(firestore, 'chats', $chatsQuery?.data.id), {
			[`unread_count_${authSession.user?.uid}`]: 0
		});
		await batch.commit();
	};

	$: {
		if (messages.length) {
			handleUnreads(messages);
			setTimeout(() => {
				scrollToBottom();
			}, 200);
		}
	}

	$: reciever = $chatsQuery?.data?.partcipants?.find((e) => e.id !== authSession.user.uid);

	let message = '';

	const handleSend = async (props?: any) => {
		if (props.message) {
			const data = {
				sender: {
					id: authSession.user.uid,
					username: authSession.user.displayName,
					photo: authSession.user?.photoURL || ''
				},
				reciver: {
					id: reciever.id,
					username: reciever.username,
					photo: reciever?.photo || ''
				},
				message: props.message,
				attachments: [],
				message_type: props.message_type || 'text',
				read_status: 'unread',
				created_at: serverTimestamp(),
				updatedAt: serverTimestamp()
			};

			const newChat = {
				[`unread_count_${reciever?.id}`]: increment(1),
				last_message: {
					message: data?.message || 'Empty message',
					message_type: props.message_type || 'text',
					sender: authSession?.user?.uid
				},
				last_activity_timestamp: serverTimestamp()
			};

			updateDoc(doc(firestore, 'chats', $chatsQuery?.data.id), newChat);

			message = '';
			return addDoc(collection(firestore, 'chats', $chatsQuery?.data.id, 'messages'), data);
		}
	};

	let uploadingAttachment = false;

	const handleAttachment = (e) => {
		const file = e.target.files[0];

		console.log(file);
		if (!file) return 'No file found';
		const fileType = file?.type;

		const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to megabytes

		if (fileSizeInMB > 5) {
			uploadingAttachment = false;
			return toast.error('File is larger than 5 MB');
		}

		console.log(fileType);

		let message_type;

		// Check if the file type is a document or an image
		if (fileType.startsWith('image/')) {
			message_type = 'image';
		} else if (
			fileType.startsWith('application/pdf') ||
			fileType.startsWith('application/vnd.ms-excel') || // Excel (CSV)
			fileType.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || // Excel (XLSX)
			fileType.startsWith(
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
			) || // Docs (Google Docs)
			fileType.startsWith('application/msword') // Word (DOC)
		) {
			message_type = 'document';
		} else {
			uploadingAttachment = false;
			return toast.error('File type is not supported');
		}
		uploadingAttachment = true;
		const photoRef = ref(storage, `users/${authSession.user.uid}/attachment_messages/${file.name}`);

		return uploadBytes(photoRef, file)
			.then(async (snapshot) => {
				const url = await getDownloadURL(snapshot.ref);

				handleSend({
					message_type: message_type,
					message: { url, size: file.size, name: file.name, type: fileType }
				});

				toast.success('Attachment uploaded sucessfully');

				uploadingAttachment = false;
				showAddons = false;

				console.log(url);
			})
			.catch((error) => {
				uploadingAttachment = false;
				toast.error(error.message);
				showAddons = false;
			});
	};

	function kbToMb(kilobytes) {
		console.log(kilobytes);
		const mb = parseInt(kilobytes) / (1024 * 1024);
		return parseFloat(mb.toFixed(2));
	}

	let whatsaping = false;

	const handleWhatsap = async (reciever) => {
		whatsaping = true;
		const reciever_profile = await getDoc(doc(firestore, 'users', reciever.id));
		if (!reciever_profile.data().phone) {
			whatsaping = false;
			showAddons = false;

			toast.error('Seller has no phone number');
			return;
		}
		whatsaping = false;
		showAddons = false;
		let url = 'https://web.whatsapp.com/send';
		if (
			/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			)
		) {
			url = 'whatsapp://send';
		}
		const all = url + '?phone=' + reciever_profile.data().phone + `&text=${'Hi there'}`;
		if (typeof window !== 'undefined') {
			// Client-side-only code
			window.open(all, '_blank');
			message = '';
		}
	};

	let showLocationChooser = false;

	let showAddons = false;
</script>

<div class="flex h-full sm:h-screen flex-col">
	<div class="border-b flex items-center justify-between border-slate-200 px-3 py-[8px]">
		<div class="flex items-center gap-3">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- svelte-ignore a11y-missing-attribute -->
			<a
				on:click={() => {
					goto('/messages');
				}}
				class="h-8 w-8 rounded-[4px] hidden sm:flex cursor-pointer items-center justify-center hover:bg-slate-100"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
					><path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20 12H4m0 0l6-6m-6 6l6 6"
					/></svg
				>
			</a>
			<div>
				{#if $chatsQuery?.status === 'pending'}
					<Skeleton className="w-[25px] h-[25px] rounded-full" />
				{/if}
				{#if $chatsQuery?.status === 'success'}
					<Avatar
						size="xs"
						rounded="full"
						src={$chatsQuery?.data?.partcipants?.find((e) => e.id !== authSession.user.uid).photo}
						name={$chatsQuery?.data?.partcipants?.find((e) => e.id !== authSession.user.uid)
							.username}
					/>
				{/if}
			</div>
			<h4 class="font-semibold text-[13.5px]">
				{#if $chatsQuery?.status === 'pending'}
					<Skeleton className="w-[150px] h-4" />
				{/if}
				{#if $chatsQuery?.status === 'success'}
					<a
						class="hover:underline"
						href={`/profile/${
							$chatsQuery?.data?.partcipants?.find((e) => e.id !== authSession.user.uid).id
						}`}
					>
						{$chatsQuery?.data?.partcipants?.find((e) => e.id !== authSession.user.uid)?.username}
					</a>
				{/if}
			</h4>
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-missing-attribute -->
		<a
			on:click={() => {
				goto('/messages');
			}}
			class="h-8 w-8 rounded-[4px] cursor-pointer flex items-center justify-center hover:bg-slate-100"
		>
			<Icon class="text-sm" icon="gg:close-r" />
		</a>
	</div>
	<div class="bg-slate-200 bg-opacity-40 sm:h-full sm:overflow-y-scroll flex-1">
		<div
			bind:this={chat_content}
			class=" h-[582px] sm:h-full scroll-smooth overflow-y-scroll bg-red-400-"
		>
			{#if $chatsQuery.status === 'success'}
				{#each messages as message}
					<div
						class={cn('px-3 py-3 my-2 hover:bg-slate-100- flex items-start gap-3', {
							'flex-row-reverse': message.sender.id === $authStore.user.uid
						})}
					>
						<div>
							<Avatar
								size="xs"
								rounded="full"
								src={message.sender.photo}
								name={message.sender.username}
							/>
						</div>
						<div
							class={cn({
								'bg-orange-50 p-3 border border-orange-200- rounded-[4px]':
									message.sender.id === $authStore.user.uid,
								'bg-white p-2 border rounded-md': message.sender.id !== $authStore.user.uid
							})}
						>
							<div class="flex items-center gap-1">
								<a
									href={`/profile/${message?.sender?.name}`}
									class="font-semibold capitalize hover:underline text-[12.5px]"
								>
									{message.sender.username}
								</a>
								<span class="text-[12px] font-medium text-slate-500">
									{formatDateTime(new Date(message.created_at.toDate()))}
								</span>
							</div>
							<div class="mt-2">
								<div
									class="text-[13px] prose-p:leading-7 prose prose-a:underline prose-a:text-blue-500 text-slate-500 font-medium"
								>
									{#if message.message_type === 'image'}
										<img
											on:click={() => {
												imageToShow = message?.message?.url;
												controller.openImage(0);
											}}
											class="border bg-white cursor-zoom-in border-slate-200 rounded-[3px] w-44"
											src={message?.message?.url}
											alt=""
										/>
									{:else if message.message_type === 'document'}
										<div class="flex items-center gap-3">
											<div
												class="border bg-slate-200 flex items-center w-[40px] h-[40px] justify-center border-l-slate-200 rounded-[4px]"
											>
												<svg
													height={25}
													width={25}
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
													><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
														id="SVGRepo_tracerCarrier"
														stroke-linecap="round"
														stroke-linejoin="round"
													/><g id="SVGRepo_iconCarrier">
														<path
															d="M4 6V19C4 20.6569 5.34315 22 7 22H17C18.6569 22 20 20.6569 20 19V9C20 7.34315 18.6569 6 17 6H4ZM4 6V5"
															stroke="#1C274D"
															stroke-width="1.5"
														/>
														<path
															d="M18 6.00002V6.75002H18.75V6.00002H18ZM15.7172 2.32614L15.6111 1.58368L15.7172 2.32614ZM4.91959 3.86865L4.81353 3.12619H4.81353L4.91959 3.86865ZM5.07107 6.75002H18V5.25002H5.07107V6.75002ZM18.75 6.00002V4.30604H17.25V6.00002H18.75ZM15.6111 1.58368L4.81353 3.12619L5.02566 4.61111L15.8232 3.0686L15.6111 1.58368ZM4.81353 3.12619C3.91638 3.25435 3.25 4.0227 3.25 4.92895H4.75C4.75 4.76917 4.86749 4.63371 5.02566 4.61111L4.81353 3.12619ZM18.75 4.30604C18.75 2.63253 17.2678 1.34701 15.6111 1.58368L15.8232 3.0686C16.5763 2.96103 17.25 3.54535 17.25 4.30604H18.75ZM5.07107 5.25002C4.89375 5.25002 4.75 5.10627 4.75 4.92895H3.25C3.25 5.9347 4.06532 6.75002 5.07107 6.75002V5.25002Z"
															fill="#1C274D"
														/>
														<path
															d="M8 12H16"
															stroke="#1C274D"
															stroke-width="1.5"
															stroke-linecap="round"
														/>
														<path
															d="M8 15.5H13.5"
															stroke="#1C274D"
															stroke-width="1.5"
															stroke-linecap="round"
														/>
													</g></svg
												>
											</div>
											<div class="flex-col flex gap-[6px]">
												<a
													href={message?.message?.url}
													target="_blank"
													class="!p-0 hover:text-blue-500 text-slate-600 hover:underline text-[12.5px] !m-0"
												>
													{message?.message?.name}
												</a>

												<span class="text-xs">
													{kbToMb(message?.message?.size)} MB
												</span>
											</div>
										</div>
									{:else}
										<div class="leading-7">
											{@html urlify(message?.message?.toString())}
										</div>
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>

	<form
		on:submit|preventDefault={() => handleSend({ message, message_type: 'text' })}
		class="flex w-full px-3 py-3 items-center sm:bg-slate-50 gap-3 bg-slate-100- border-t border-slate-200 rounded-md-"
	>
		<input type="file" class="hidden" on:change={handleAttachment} bind:this={uploader} />
		<div class="relative">
			{#if showAddons}
				<div
					use:clickOutside
					on:click_outside={() => {
						// showAddons = !showAddons;
					}}
					class="absolute bg-white border border-slate-200 p-[6px] rounded-md bottom-10 shadow-sm flex items-center gap-2"
				>
					<a
						on:click={uploader?.click()}
						class="h-8 w-8 rounded-[4px] cursor-pointer flex items-center justify-center hover:bg-slate-100"
					>
						{#if uploadingAttachment}
							<Loader />
						{:else}
							<Icon icon="icomoon-free:attachment" class="text-base" />
						{/if}
					</a>
					<a
						on:click={() => handleWhatsap(reciever)}
						target="_blank"
						class="h-8 w-8 rounded-[4px] cursor-pointer flex items-center justify-center hover:bg-slate-100"
					>
						{#if whatsaping}
							<Loader />
						{:else}
							<Icon icon="ic:twotone-whatsapp" class="text-base" />
						{/if}
					</a>

					<a
						on:click={() => (showLocationChooser = true)}
						target="_blank"
						class="h-8 w-8 rounded-[4px] cursor-pointer flex items-center justify-center hover:bg-slate-100"
					>
						<Icon icon="bx:map" class="text-base" />
					</a>
				</div>
			{/if}
			<a
				on:click={() => (showAddons = !showAddons)}
				target="_blank"
				class="h-8 w-8 rounded-[4px] cursor-pointer flex items-center justify-center hover:bg-slate-100"
			>
				<Icon icon="tabler:circle-plus" class="text-base" />
			</a>
		</div>
		<textarea
			rows={1}
			bind:value={message}
			placeholder="Type a message here..."
			class="flex-1 text-slate-600 focus:border-[#f0b111] rounded-md border-slate-200 border-opacity-50 border bg-slate-50 resize-none py-[10px] px-3 text-[13px] font-medium outline-none"
		/>
		<button
			class="h-8 w-8 bg-[#f0b111] text-white flex justify-center items-center rounded-full"
			type="submit"
		>
			<Icon icon="iconamoon:send" class="text-xl" />
		</button>
	</form>
</div>

<LocationPicker
	onChoose={(e) => {
		handleSend({ message: e });
	}}
	close={() => {
		showAddons = false;

		showLocationChooser = false;
	}}
	open={showLocationChooser}
/>

<Lightbox images={[imageToShow]} bind:controller title={'Image'} open={Boolean(imageToShow)} />
