<script lang="ts">
	// @ts-nocheck
	import { XIcon } from 'svelte-feather-icons';
	import { scale } from 'svelte/transition';
	import { linear } from 'svelte/easing';
	import Button from './form/Button.svelte';
	import { clickOutside } from '../../directives/clickOutside';
	let show = false;

	let message = '';

	const openLink = (e: any) => {
		e?.preventDefault();
		if (message) {
			let url = 'https://web.whatsapp.com/send';
			if (
				/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					navigator.userAgent
				)
			) {
				url = 'whatsapp://send';
			}
			const all = url + '?phone=' + '+250787320675' + `&text=${message}`;
			if (typeof window !== 'undefined') {
				// Client-side-only code
				window.open(all, '_blank');
				message = '';
			}
		}
	};
</script>

{#if show}
	<div
		use:clickOutside
		on:click_outside={() => {
			show = false;
		}}
		transition:scale={{
			duration: 100,
			delay: 0,
			opacity: 0,
			start: 0.95,
			easing: linear
		}}
		class="fixed w-[350px] border z-50 sm:right-0 border-slate-300 shadow-xl bottom-24 bg-white rounded-md overflow-hidden right-4"
	>
		<div class="bg-[#095e54] px-3 py-2 flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="h-10 w-10 flex items-center justify-center bg-white rounded-full">
					<svg
						stroke="currentColor"
						fill="currentColor"
						stroke-width="0"
						viewBox="0 0 24 24"
						height="1em"
						width="1em"
						xmlns="http://www.w3.org/2000/svg"
						><path
							d="M12,2C6.486,2,2,6.486,2,12v0.714V16v0.143C2,17.167,2.897,18,4,18h1c0.553,0,1-0.448,1-1v-5.143c0-0.552-0.447-1-1-1 H4.092C4.648,6.987,7.978,4,12,4s7.352,2.987,7.908,6.857H19c-0.553,0-1,0.448-1,1V16v1v1c0,1.103-0.897,2-2,2h-2v-1h-4v3h2h2h2 c2.206,0,4-1.794,4-4c1.103,0,2-0.833,2-1.857V16v-3.286V12C22,6.486,17.514,2,12,2z"
						/></svg
					>
				</div>
				<div class="flex flex-col gap-1 items-start">
					<h4 class="text-sm font-medium text-white">Support</h4>
					<p class="text-[12.5px] text-slate-200 font-medium">Typically replies within a day.</p>
				</div>
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-missing-attribute -->
			<a
				role="button"
				tabindex="0"
				on:click={() => {
					show = false;
				}}
				class="text-white cursor-pointer p-1"
			>
				<XIcon size="15" />
			</a>
		</div>
		<div style="background-image: url('/whatsap-bg.png');" class="py-3 px-4">
			<div>
				<div class="bg-white shadow-sm relative rounded-[4px] w-[70%] p-2">
					<span class="widget-achor" />
					<div class="w-full">
						<span class="text-[12px] text-slate-500 font-medium">Support</span>
						<p class="text-[12.5px] leading-7 font-medium capitalize mt-2 text-slate-800">
							Hello! 👋🏼 What can we do for you?
						</p>
						<span class="mt-1 block font-medium text-[11px] w-full text-slate-500 text-right"
							>16:08</span
						>
					</div>
				</div>
			</div>
		</div>
		<div class="py-[10px] bg-[#f0f0f0] px-3">
			<form action="#" on:submit={openLink}>
				<input
					bind:value={message}
					type="text"
					placeholder="Type a message..."
					class="w-full mb-1 border mb-2 shadow-sm text-[13px] h-9 px-3 rounded-[4px] border-1 border-gray-200 focus:outline-none focus:border-green-500"
				/>
				<Button type="submit" click={openLink} customClass="!bg-[#4fce5d]" fullWidth
					>Send message</Button
				>
			</form>
		</div>
	</div>
{/if}
<button
	on:click={() => {
		show = !show;
	}}
	aria-label="whatsap chat."
	class="h-14 border-2 shadow-lg cursor-pointer active:scale-95 transition-all border-white w-14 flex justify-center items-center fixed bottom-4 right-4 z-40 bg-green-500 rounded-full"
>
	<svg
		width="30"
		height="30"
		class="text-white fill-current"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
			id="SVGRepo_tracerCarrier"
			stroke-linecap="round"
			stroke-linejoin="round"
		/><g id="SVGRepo_iconCarrier">
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M3.50002 12C3.50002 7.30558 7.3056 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C10.3278 20.5 8.77127 20.0182 7.45798 19.1861C7.21357 19.0313 6.91408 18.9899 6.63684 19.0726L3.75769 19.9319L4.84173 17.3953C4.96986 17.0955 4.94379 16.7521 4.77187 16.4751C3.9657 15.176 3.50002 13.6439 3.50002 12ZM12 1.5C6.20103 1.5 1.50002 6.20101 1.50002 12C1.50002 13.8381 1.97316 15.5683 2.80465 17.0727L1.08047 21.107C0.928048 21.4637 0.99561 21.8763 1.25382 22.1657C1.51203 22.4552 1.91432 22.5692 2.28599 22.4582L6.78541 21.1155C8.32245 21.9965 10.1037 22.5 12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5ZM14.2925 14.1824L12.9783 15.1081C12.3628 14.7575 11.6823 14.2681 10.9997 13.5855C10.2901 12.8759 9.76402 12.1433 9.37612 11.4713L10.2113 10.7624C10.5697 10.4582 10.6678 9.94533 10.447 9.53028L9.38284 7.53028C9.23954 7.26097 8.98116 7.0718 8.68115 7.01654C8.38113 6.96129 8.07231 7.046 7.84247 7.24659L7.52696 7.52195C6.76823 8.18414 6.3195 9.2723 6.69141 10.3741C7.07698 11.5163 7.89983 13.314 9.58552 14.9997C11.3991 16.8133 13.2413 17.5275 14.3186 17.8049C15.1866 18.0283 16.008 17.7288 16.5868 17.2572L17.1783 16.7752C17.4313 16.5691 17.5678 16.2524 17.544 15.9269C17.5201 15.6014 17.3389 15.308 17.0585 15.1409L15.3802 14.1409C15.0412 13.939 14.6152 13.9552 14.2925 14.1824Z"
			/>
		</g></svg
	>
</button>
