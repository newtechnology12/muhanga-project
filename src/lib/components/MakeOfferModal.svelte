<script lang="ts">
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
	export let current_price: any;
	export let advert_name: any;

	function generatePriceOffers(basePrice) {
		const discountPercentage = [5, 10, 15, 20]; // Adjust these percentages based on your preference
		const priceOffers = [];

		discountPercentage.forEach((percentage) => {
			const offerPrice = basePrice - (basePrice * percentage) / 100;
			priceOffers.push(offerPrice);
		});

		return priceOffers;
	}

	const suggestions = generatePriceOffers(current_price);

	let price = '';

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
		if (price) {
			const offerMessage = `I would by this(${advert_name}) at ${parseInt(
				price
			).toLocaleString()} FRW`;
			try {
				sending = true;
				const chat = await getOrCreateChat({
					message: price,
					current_user: auth.user,
					chat_id: `${auth.user.uid}_${reciever.id}`,
					reciever
				});

				await updateDoc(doc(firestore, 'chats', chat.id), {
					last_message: {
						sender: auth?.user?.uid,
						message: offerMessage
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
					message: offerMessage,
					attachments: [],
					message_type: 'text',
					read_status: 'unread',
					created_at: serverTimestamp(),
					updatedAt: serverTimestamp()
				});
				price = '';
				sending = false;
				toast.success('Message sent sucessfully');
				close();
			} catch (error) {
				console.log(error);
				toast.error('Failed to send a message, try again');
			}
		}
	};
</script>

<div id="clipboard" />
<Modal size="md" noFooter showDividers={true} {open} {close} title="Make an offer">
	<div slot="body">
		<div>
			<p class="font-medium text-[12.5px] mb-2 uppercase text-left text-slate-500">
				Suggested Prices
			</p>
			<div class="flex items-center justify-start gap-3 flex-wrap">
				{#each suggestions as suggestion}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<!-- svelte-ignore a11y-missing-attribute -->
					<a
						class="bg-slate-50 border border-orange-400 cursor-pointer hover:bg-orange-50 text-[12.5px] px-3 py-[6px] font-medium rounded-[4px] text-[#f0b111]"
						on:click={() => (price = suggestion)}
					>
						{suggestion.toLocaleString()} FRW
					</a>
				{/each}
			</div>
			<div class="mt-2">
				<form
					on:submit|preventDefault={handleSendMessage}
					class="flex w-full py-3 items-center gap-3"
				>
					<input
						type="number"
						bind:value={price}
						placeholder="Enter your price"
						class="flex-1 text-slate-600 focus:border-[#f0b111] rounded-md border-slate-200 border-opacity-50 border bg-slate-50 resize-none py-[10px] px-3 text-[13px] font-medium outline-none"
					/>
					<button
						class="px-5 bg-[#f0b111] text-white text-[13px] py-[10px] flex justify-center items-center rounded-[4px]"
						type="submit"
					>
						{#if sending}
							<Loader />
						{:else}
							<span> Send offer </span>
						{/if}
					</button>
				</form>
			</div>
		</div>
	</div>
	<span slot="footer" />
</Modal>
