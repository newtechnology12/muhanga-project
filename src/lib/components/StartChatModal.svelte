<script lang="ts">
	import Icon from '@iconify/svelte';
	import Modal from './Modal.svelte';
	import {
		addDoc,
		collection,
		doc,
		getDoc,
		increment,
		serverTimestamp,
		setDoc,
		updateDoc
	} from 'firebase/firestore';
	import { authStore } from '../../stores/auth';
	import { firestore } from '../../config/firebase';
	import toast from 'svelte-french-toast';
	import Loader from './Loader.svelte';

	export let open: any;
	export let close: any;
	export let reciever: any;
	export let hideSuggestions = false;
	export let advert: any = undefined;

	const suggestions = [
		{ message: 'Make an offer', addon: `- Advert: ${advert?.name}` },
		{ message: 'Is this available?', addon: `- Advert: ${advert?.name}` },
		{ message: 'What is the last price?', addon: `- Advert: ${advert?.name}` }
	];

	let message = '';

	$: auth = $authStore;

	const getOrCreateChat = async ({ message, current_user, reciever, chat_id }) => {
		const chat = await getDoc(doc(firestore, 'chats', chat_id));
		if (chat.exists()) return { ...chat.data(), id: chat.id };
		const data = {
			partcipants: [
				{
					id: current_user.uid,
					username: current_user.displayName,
					photo: current_user?.photoURL || ''
				},
				{
					id: reciever.id,
					username: reciever.first_name + ' ' + reciever.last_name,
					photo: reciever?.photo || ''
				}
			],
			partcipantsIds: [current_user.uid, reciever.id],
			is_archived: false,
			created_at: serverTimestamp(),
			updatedAt: serverTimestamp(),
			last_activity_timestamp: serverTimestamp()
		};
		await setDoc(doc(firestore, 'chats', chat_id), data);

		return { ...data, id: chat_id };
	};

	let sending = false;

	const handleSendMessage = async () => {
		if (message) {
			try {
				sending = true;
				const chat = await getOrCreateChat({
					message: message,
					current_user: auth.user,
					chat_id: `${auth.user.uid}_${reciever.id}`,
					reciever
				});

				await updateDoc(doc(firestore, 'chats', chat.id), {
					last_message: {
						sender: auth?.user?.uid,
						message: message
					},
					last_activity_timestamp: serverTimestamp(),
					[`unread_count_${reciever?.id}`]: increment(1)
				});
				await addDoc(collection(firestore, 'chats', chat.id, 'messages'), {
					sender: {
						id: auth.user.uid,
						username: auth.user.displayName,
						photo: auth.user?.photoURL || ''
					},
					reciver: {
						id: reciever.id,
						username: reciever.first_name + ' ' + reciever.last_name,
						photo: reciever?.photo || ''
					},
					message: message,
					attachments: [],
					message_type: 'text',
					read_status: 'unread',
					created_at: serverTimestamp(),
					updatedAt: serverTimestamp()
				});
				sending = false;
				toast.success('Message sent sucessfully');
				close();
			} catch (error) {
				console.log(error);
				sending = false;
				toast.error('Failed to send a message, try again');
			}
		}
	};
</script>

<div id="clipboard" />
<Modal size="md" noFooter showDividers={true} {open} {close} title="Start chat by new message">
	<div slot="body">
		<div>
			{#if !hideSuggestions}
				<div class="mb-2">
					<p class="font-medium text-[12.5px] mb-2 uppercase text-left text-slate-500">
						Suggested messages
					</p>
					<div class="flex items-center justify-start gap-3 flex-wrap">
						{#each suggestions as suggestion}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<!-- svelte-ignore a11y-missing-attribute -->
							<a
								class="bg-slate-50 border border-orange-400 cursor-pointer hover:bg-orange-50 text-[12.5px] px-3 py-[6px] font-medium rounded-[4px] text-[#f0b111]"
								on:click={() => (message = `${suggestion.message} \n${suggestion.addon}`)}
							>
								{suggestion.message}
							</a>
						{/each}
					</div>
				</div>
			{/if}
			<div>
				<form
					on:submit|preventDefault={handleSendMessage}
					class="flex w-full py-3 items-center gap-3"
				>
					<textarea
						bind:value={message}
						rows={2}
						placeholder="Type a message here..."
						class="flex-1 text-slate-600 leading-7 focus:border-[#f0b111] rounded-md border-slate-200 border-opacity-50 border bg-slate-50 resize-none py-[10px] px-3 text-[13px] font-medium outline-none"
					/>
					<button
						class="h-8 w-8 bg-[#f0b111] text-white flex justify-center items-center rounded-full"
						type="submit"
					>
						{#if sending}
							<Loader />
						{:else}
							<Icon icon="iconamoon:send" class="text-xl" />
						{/if}
					</button>
				</form>
			</div>
		</div>
	</div>
	<span slot="footer" />
</Modal>
