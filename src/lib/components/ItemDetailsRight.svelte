<script>
	import Icon from '@iconify/svelte';
	import { authStore } from '../../stores/auth';
	import Button from './form/Button.svelte';
	import ButtonStroke from './form/ButtonStroke.svelte';
	import Loader from './Loader.svelte';
	import Avatar from './Avatar.svelte';
	import { deleteDoc, doc, getDoc } from 'firebase/firestore';
	import toast from 'svelte-french-toast';
	import { firestore } from '../../config/firebase';
	import { goto } from '$app/navigation';
	import StartChatModal from './StartChatModal.svelte';
	import MakeOfferModal from './MakeOfferModal.svelte';

	function truncateString(str, maxLength) {
		if (str.length > maxLength) {
			return str.slice(0, maxLength) + '...';
		} else {
			return str;
		}
	}

	export let advert;
	let showOfferModal;
	let showStartChatModal;
	$: authSession = $authStore;

	let whatsaping = false;

	let calling = false;

	const handleCall = async (reciever) => {
		calling = true;
		const reciever_profile = await getDoc(doc(firestore, 'users', reciever.id));
		if (!reciever_profile.data().phone) {
			calling = false;
			toast.error('Seller has no phone number');
			return;
		}
		calling = false;

		if (typeof window !== 'undefined') {
			// Client-side-only code
			window.location.href = `tel:${reciever_profile.data().phone}`;
		}
	};

	const handleWhatsap = async (reciever) => {
		whatsaping = true;
		const reciever_profile = await getDoc(doc(firestore, 'users', reciever.id));
		if (!reciever_profile.data().phone) {
			whatsaping = false;
			toast.error('Seller has no phone number');
			return;
		}
		whatsaping = false;
		let url = 'https://web.whatsapp.com/send';
		if (
			/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			)
		) {
			url = 'whatsapp://send';
		}
		const all =
			url +
			'?phone=' +
			(+reciever_profile.data().phone.startsWith('+25') ? '' : '+25') +
			reciever_profile.data().phone +
			`&text=${`Hello i would like to know more about this - ${advert.name}`}`;
		if (typeof window !== 'undefined') {
			// Client-side-only code
			window.location.href = all;
		}
	};

	let deleting = false;

	const handleDelete = (advert) => {
		if (confirm('Are you shure you want to delete this advert')) {
			deleting = true;
			return deleteDoc(doc(firestore, 'adverts', advert.id))
				.then((e) => {
					deleting = false;
					goto('/');
					toast.success('Advert deleted sucessfully');
				})
				.catch((e) => {
					deleting = false;
					toast.error(e.message);
				});
		}
	};
</script>

<StartChatModal
	{advert}
	reciever={advert.author}
	open={showStartChatModal}
	close={() => (showStartChatModal = false)}
/>

<MakeOfferModal
	advert_name={advert.name}
	current_price={parseInt(advert.price)}
	reciever={advert.author}
	open={showOfferModal}
	close={() => (showOfferModal = false)}
/>

<div class="border bg-white mb-4 rounded-md px-3 py-4 space-y-2">
	<div class="mb-4">
		<div class="mb-3 space-y-1">
			<div class="font-semibold">
				<span> {parseInt(advert.price).toLocaleString()} </span>
				<span> FRW </span>
			</div>
			<div class="text-[11.5px] text-slate-500 font-medium">Total price to pay.</div>
		</div>
		<div>
			{#if advert?.author?.id !== authSession?.user?.uid}
				<Button
					on:click={() => {
						authSession?.user?.uid ? (showOfferModal = true) : goto('/login');
					}}>Make offer</Button
				>
			{/if}
		</div>
	</div>
	<div class="border-t border-t-slate-300 border-dashed pt-4">
		<h4 class="font-medium flex mb-4 items-center gap-3 text-[13px]">
			<Icon icon="icon-park:list" />
			Safety tips
		</h4>
		<div class="mt-2">
			<ul class="space-y-3">
				{#each ["Remember, don't send any pre-payments", 'Meet the seller at a safe public place', 'Inspect the goods to make sure they meet your needs', "Check all documentation and only pay if you're satisfied"] as tip}
					<li class="flex items-start gap-3">
						<div>
							<div
								class="bg-orange-100 rounded-full h-5 w-5 text-orange-600 flex items-center justify-center"
							>
								<Icon class="text-[10px]" icon="mingcute:check-fill" />
							</div>
						</div>
						<span class="font-medium text-slate-600 leading-6 text-[12.5px]">
							{tip}
						</span>
					</li>
				{/each}
			</ul>
		</div>

		{#if authSession?.user?.uid && advert?.author?.id === authSession?.user?.uid}
			<div class="mt-5">
				<ButtonStroke
					on:click={() => goto(`/adverts/${advert.id}/edit`)}
					title="Update advert"
					icon="bx:edit"
				/>
			</div>
			<button
				on:click={() => handleDelete(advert)}
				class="grid border px-3 py-2 rounded-[4px] mt-4 border-red-500 bg-red-50 hover:bg-red-100 text-red-500 w-full"
			>
				<div class="m-auto flex items-center gap-3">
					{#if !deleting}
						<Icon icon={`octicon:trash-16`} class="text-lg" />
					{:else}
						<Loader />
					{/if}
					<p class="capitalize font-semibold text-[12px]">Delete advert</p>
				</div>
			</button>
		{/if}
	</div>
</div>
<!-- Second devision -->
<div class="border bg-white px-4 py-6 space-y-2">
	<div class="flex flex-col gap-4 items-center pb-3">
		<div class="border-[2px] border-dashed border-[#f0b111] w-fit p-1 rounded-full">
			<Avatar
				size="xl"
				rounded="full"
				src={advert.author?.photo}
				name={advert?.author?.first_name + ' ' + advert?.author?.last_name}
			/>
		</div>
		<div class="text-xs text-center space-y-4 text-gray-900">
			<div class="mb-6 mt-2">
				<div class="flex items-center capitalize justify-center gap-2">
					<a href={`/profile/${advert?.author?.id}`} class="font-bold text-[15px]"
						>{advert?.author?.first_name + ' ' + advert?.author?.last_name}</a
					>
					<Icon icon="material-symbols:verified" class="text-[#f0b111] text-base" />
				</div>
			</div>
			<div class="space-y-1 flex-col gap-4 mt-3 flex justify-center items-center">
				<p class="flex gap-2 text-[12.5px] font-medium text-slate-600 items-center">
					<Icon icon="humbleicons:clock" class="text-slate-500 text-base" />
					<span>
						{new Date(advert.author?.createdAt).toLocaleDateString('en-US', {
							day: '2-digit',
							month: 'long',
							year: 'numeric'
						})}</span
					>
				</p>
				<p class="flex gap-2 text-[12.5px] font-medium text-slate-600 items-center">
					<Icon icon="material-symbols:location-on-outline" class="text-slate-500 text-base" />
					<span class="truncate">
						{truncateString(advert?.author?.address || 'No address available', 30)}</span
					>
				</p>
				<a
					href={`tel:${advert.author?.phone}`}
					class="flex gap-2 text-[12.5px] font-medium text-slate-600 items-center"
				>
					<Icon icon="uil:phone" class="text-slate-500 text-base" />
					<span class="hover:underline">
						{advert.author?.phone || 'Not Phone available'}
					</span>
				</a>
			</div>
		</div>
	</div>
	{#if advert?.author?.id !== authSession?.user?.uid}
		<div class="space-y-4 gap-3 grid">
			<ButtonStroke
				on:click={() => (authSession?.user?.uid ? (showStartChatModal = true) : goto('/login'))}
				title="Start chat"
				icon="tabler:message"
			/>
		</div>
	{/if}

	<div class="flex items-center gap-2">
		{#if advert?.author?.id !== authSession?.user?.uid}
			<div class="space-y-4 w-full gap-3 grid">
				<button
					on:click={() => handleWhatsap(advert?.author)}
					class="grid border px-3 py-2 rounded-[4px] border-green-500 bg-green-50 hover:bg-green-100 text-green-500 w-full"
				>
					<div class="m-auto flex items-center gap-3">
						{#if !whatsaping}
							<Icon icon={`ic:round-whatsapp`} class="text-lg" />
						{:else}
							<Loader />
						{/if}
						<p class="capitalize font-semibold text-[12px]">Whatsap</p>
					</div>
				</button>
			</div>
		{/if}

		{#if advert?.author?.id !== authSession?.user?.uid}
			<div class="space-y-4 gap-3 w-full grid">
				<button
					on:click={() => handleCall(advert?.author)}
					class="grid border px-3 py-2 rounded-[4px] border-blue-500 bg-blue-50 bg-opacity-50 hover:bg-blue-100 text-blue-500 w-full"
				>
					<div class="m-auto flex items-center gap-3">
						{#if !calling}
							<Icon icon={`tabler:phone`} class="text-lg" />
						{:else}
							<Loader />
						{/if}
						<p class="capitalize font-semibold text-[12px]">Contact</p>
					</div>
				</button>
			</div>
		{/if}
	</div>
</div>
<!-- Second devision -->
