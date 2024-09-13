<script lang="ts">
	import relativeTime from 'dayjs/plugin/relativeTime.js';
	import dayjs from 'dayjs';
	import categories from '../../data/categories';
	import { ClockIcon } from 'svelte-feather-icons';
	import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
	import { firestore } from '../../config/firebase';
	import { authStore } from '../../stores/auth';
	import toast from 'svelte-french-toast';
	import Loader from './Loader.svelte';

	export let unSaveActionCompleted = undefined;

	dayjs.extend(relativeTime);

	function truncateString(str, maxLength) {
		if (str.length > maxLength) {
			return str.slice(0, maxLength) + '...';
		} else {
			return str;
		}
	}

	export let image = '';
	export let id = '';
	export let name = '';
	export let price: any = 0;
	export let category = '';
	export let description = '';
	export let author;
	export let createdAt = undefined;

	let isSaving = false;

	export let isSavedAlready = false;

	let isSaved = Boolean(isSavedAlready);

	$: authSession = $authStore;

	const handleSave = () => {
		isSaving = true;
		if (isSaved) {
			return deleteDoc(doc(firestore, 'users', authSession.user.uid, 'saved_adverts', id))
				.then((e) => {
					isSaving = false;
					isSaved = false;
					unSaveActionCompleted();
					toast.success('Advert unsaved sucessfully');
				})
				.catch((e) => {
					isSaving = false;
					toast.error(e.message);
				});
		} else {
			return setDoc(doc(firestore, 'users', authSession.user.uid, 'saved_adverts', id), {
				images: [image],
				price: price,
				name: name,
				description: description,
				category: category,
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
</script>

<div
	class="border border-slate-200 border-opacity-90 bg-white flex overflow-hidden flex-col rounded-md"
>
	<div class="h-48 md:h-40 lg:h-60 overflow-hidden relative m-[6px]- cursor-pointer rounded-md-">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-missing-attribute -->
		<a
			on:click={() => handleSave()}
			class="cursor-pointer bg-white text-[#f0b111] h-8 w-8 rounded-full flex items-center justify-center absolute top-2 right-2"
		>
			{#if isSaving}
				<Loader customClass={'text-[#f0b111]'} />
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
		<a href={`/adverts/${id}`}>
			<img
				src={image}
				alt=""
				class="h-full bg-slate-50 duration-300 w-full object-contain object-center"
			/>
		</a>
	</div>
	<div
		class="group flex flex-col justify-between h-fit flex-1 bg-slate-100- cursor-pointer text-start"
	>
		<div class="space-y-2 mt-[8px] pb-2">
			<a
				href={`/adverts/${id}`}
				class="font-semibold capitalize truncate sm:line-clamp-2 sm:text-[12px] leading-7 line-clamp-1 hover:text-[#f0b111] block px-2 mt-1 text-[13px]"
			>
				{name}
			</a>
			<a
				href={`/adverts/${id}`}
				class="font-medium px-2 sm:hidden line-clamp-2 text-gray-500 leading-6 text-[12.5px]"
			>
				{description}
			</a>
		</div>
		<div
			class="flex gap-1 px-2 justify-between items-center py-2 border-slate-100 border-t sm:flex-col lg:items-start"
		>
			<p class="font-semibold text-[12.8px] text-[#f0b111]">
				{parseInt(price).toLocaleString()} FRW
			</p>

			<div class="flex items-center sm:hidden gap-2 text-slate-500">
				<ClockIcon size={'13'} class="text-[13px]" />
				<span class="text-[11.5px] capitalize font-medium">
					{dayjs(new Date(createdAt)).fromNow()}</span
				>
			</div>
		</div>
	</div>
</div>
