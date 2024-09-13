<script lang="ts">
	import Icon from '@iconify/svelte';
	import img from '$lib/images/logoo.png';
	import Menu from '$lib/components/modals/Menu.svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '../../stores/auth';
	import slugify from '../../utils/slugify';
	import { page } from '$app/stores';
	import categories from '../../data/categories';
	import { UserIcon, SearchIcon } from 'svelte-feather-icons';

	let mobileNavIsOpen: boolean = false;

	function toggleMobileNav() {
		mobileNavIsOpen = !mobileNavIsOpen;
	}
	const categorySlug = $page.url.searchParams.get('category');
	const searchText = $page.url.searchParams.get('q');

	let search_text: any = searchText;
	let category: any = categorySlug
		? categories?.find((e) => slugify(e.text) === categorySlug)?.slug || 'all'
		: 'all';

	$: auth = $authStore;

	const handleSubmit = (e) => {
		e.preventDefault();
		if (search_text) goto(`/search?category=${category}&q=${search_text}`);
	};
</script>

<header class="px-4 border-b sticky top-0 z-40 bg-white border-b-gray-200 md:hidden">
	<div class="mx-auto max-w-7xl text-gray-600 flex items-center justify-between gap-10 py-3">
		<div class=" items-center w-fit justify-between cursor-pointer flex gap-32 col-span-1">
			<a href="/">
				<h1 class="font-semibold text-xl tracking-wider text-orange-500">
					<img class="h-[30px]" src="/logoinfinity.png" alt="" />
				</h1>
			</a>
		</div>
		<!-- second division -->
		<div class=" flex-col flex">
			<div class="ml-auto flex gap-7 items-center cursor-pointer">
				<div class="flex items-center gap-2 cursor-pointer">
					<div class="bg-orange-50 bosj">
						<div class="p-3 rounded-sm">
							<svg
								class="text-lg text-[#f0b111] font-bold"
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 512 512"
								><path
									fill="currentColor"
									d="M208 80h264v32H208zM40 96a64 64 0 1 0 64-64a64.072 64.072 0 0 0-64 64m64-32a32 32 0 1 1-32 32a32.036 32.036 0 0 1 32-32m104 176h264v32H208zm-104 80a64 64 0 1 0-64-64a64.072 64.072 0 0 0 64 64m0-96a32 32 0 1 1-32 32a32.036 32.036 0 0 1 32-32m104 176h264v32H208zm-104 80a64 64 0 1 0-64-64a64.072 64.072 0 0 0 64 64m0-96a32 32 0 1 1-32 32a32.036 32.036 0 0 1 32-32"
								/></svg
							>
						</div>
					</div>
					<div class="text-xs flex flex-col space-y-[5.5px]">
						<a
							href={auth?.loggedIn ? '/profile/' + $authStore?.user?.uid : '/login'}
							class=" text-gray-500 hover:underline font-medium">Adverts</a
						>
						<a
							href={auth?.loggedIn ? '/profile/' + $authStore?.user?.uid : '/login'}
							class=" text-slate-700 hover:underline truncate font-semibold">My adverts</a
						>
					</div>
				</div>
				<div class="flex items-center gap-2 cursor-pointer">
					<div class="bg-orange-50 bosj">
						<div class="p-3 rounded-sm">
							<svg
								class="text-lg text-[#f0b111] font-bold"
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								><path
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-width="2"
									d="M3 11.098v4.993c0 3.096 0 4.645.734 5.321c.35.323.792.526 1.263.58c.987.113 2.14-.907 4.445-2.946c1.02-.901 1.529-1.352 2.118-1.47c.29-.06.59-.06.88 0c.59.118 1.099.569 2.118 1.47c2.305 2.039 3.458 3.059 4.445 2.945c.47-.053.913-.256 1.263-.579c.734-.676.734-2.224.734-5.321v-4.994c0-4.288 0-6.432-1.318-7.765C18.364 2 16.242 2 12 2C7.757 2 5.636 2 4.318 3.332C3.511 4.148 3.198 5.27 3.077 7M15 6H9"
								/></svg
							>
						</div>
					</div>
					<div class="text-xs flex flex-col space-y-[5.5px]">
						<a
							href={auth?.loggedIn ? '/saved' : '/login'}
							class=" text-gray-500 hover:underline font-medium">Saved</a
						>
						<a
							href={auth?.loggedIn ? '/saved' : '/login'}
							class=" text-slate-700 hover:underline truncate font-semibold">Saved items</a
						>
					</div>
				</div>
				<div class="flex items-center gap-2 cursor-pointer">
					<div class="bg-orange-50">
						<div class="p-3 rounded-sm">
							<svg
								width="20"
								height="20"
								class="text-xl stroke-current text-[#f0b111] font-bold"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
								/><g id="SVGRepo_iconCarrier">
									<path
										d="M2 12C2 15.7712 2 17.6569 3.17157 18.8284C4.34315 20 6.22876 20 10 20H14C17.7712 20 19.6569 20 20.8284 18.8284C22 17.6569 22 15.7712 22 12C22 11.0542 22.0185 10.7271 22 10M13 4H10C6.22876 4 4.34315 4 3.17157 5.17157C2.51839 5.82475 2.22937 6.69989 2.10149 8"
										stroke-width="1.8"
										stroke-linecap="round"
									/>
									<path
										d="M6 8L7.66438 9.38699M15.8411 9.79908C14.0045 11.3296 13.0861 12.0949 12 12.0949C11.3507 12.0949 10.7614 11.8214 10 11.2744"
										stroke-width="1.8"
										stroke-linecap="round"
									/> <circle cx="19" cy="5" r="3" stroke-width="1.8" />
								</g></svg
							>
						</div>
					</div>
					<div class="text-xs flex flex-col space-y-[5.5px]">
						<a
							href={auth?.loggedIn ? '/messages' : '/login'}
							class=" text-gray-500 hover:underline font-medium">Chats</a
						>
						<a
							href={auth?.loggedIn ? '/messages' : '/login'}
							class=" text-slate-700 hover:underline truncate font-semibold">Messages</a
						>
					</div>
				</div>
				<div class="flex items-center gap-2">
					<div class="bg-orange-50">
						<div class="p-3 rounded-sm">
							<svg
								class="text-lg font-bold text-[#f0b111]"
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								><g fill="none" stroke="currentColor" stroke-width="1.7"
									><circle cx="12" cy="9" r="2" /><path
										d="M16 15c0 1.105 0 2-4 2s-4-.895-4-2s1.79-2 4-2s4 .895 4 2Z"
									/><path
										stroke-linecap="round"
										d="M3 10.417c0-3.198 0-4.797.378-5.335c.377-.537 1.88-1.052 4.887-2.081l.573-.196C10.405 2.268 11.188 2 12 2c.811 0 1.595.268 3.162.805l.573.196c3.007 1.029 4.51 1.544 4.887 2.081C21 5.62 21 7.22 21 10.417v1.574c0 2.505-.837 4.437-2 5.913M3.193 14c.857 4.298 4.383 6.513 6.706 7.527c.721.315 1.082.473 2.101.473c1.02 0 1.38-.158 2.101-.473c.579-.252 1.231-.58 1.899-.994"
									/></g
								></svg
							>
						</div>
					</div>
					<div class="text-xs space-y-[5.5px] flex flex-col">
						<a
							href={auth?.loggedIn ? '/account' : '/login'}
							class=" text-gray-500 font-medium hover:underline cursor-pointer"
						>
							{!auth?.loggedIn ? 'Sign in' : 'My account'}
						</a>
						<a
							href={auth?.loggedIn ? '/account' : '/login'}
							class=" text-slate-700 truncate capitalize font-semibold hover:underline cursor-pointer"
						>
							{#if auth?.loggedIn}
								<span>{auth.user.displayName || auth.user.email.split('@')[0]}</span>
							{:else}
								<span>
									<span>My Account</span>
								</span>
							{/if}
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</header>

{#if !['/messages', '/login', '/register', '/forgotPassword', '/messages/[conversation_id]'].includes($page.route.id)}
	<!-- Header mobile -->
	<header class="md:block hidden">
		<div
			class="flex justify-between items-center bg-white px-3 pb-2 pt-3 top-0 left-0 right-0 fixed z-50 w-full"
		>
			<div class="">
				<a href="/">
					<h1 class="font-semibold text-lg tracking-wider text-orange-500">
						<img class="h-8" src="logoinfinity.png" alt="" />
					</h1>
				</a>
			</div>
			<div class="flex gap-1">
				<div class="bg-orange-50">
					<a href={auth?.user?.uid ? '/account' : '/login'} class="p-3 block rounded-sm">
						<UserIcon size={'16'} class="text-lg font-bold text-[#f0b111]" />
					</a>
				</div>

				<div class="cursor-pointer">
					<button
						on:click={toggleMobileNav}
						class="h-10 w-10 flex items-center justify-center bg-orange-50 hover:bg-orange-100 rounded-sm"
					>
						<svg
							class="text-[#f0b111]"
							xmlns="http://www.w3.org/2000/svg"
							width="28"
							height="28"
							viewBox="-5 -7 24 24"
							><path
								fill="currentColor"
								d="M1 0h5a1 1 0 1 1 0 2H1a1 1 0 1 1 0-2zm7 8h5a1 1 0 0 1 0 2H8a1 1 0 1 1 0-2zM1 4h12a1 1 0 0 1 0 2H1a1 1 0 1 1 0-2z"
							/></svg
						>
					</button>
				</div>
			</div>
		</div>
		<form on:submit|preventDefault={handleSubmit} class="w-full bg-white py-3 border-b px-3">
			<div
				class="relative flex items-center rounded-[3px] border-orange-300 border focus:border-[#f0b111] p"
			>
				<input
					bind:value={search_text}
					placeholder="Search anything"
					type="text"
					class="w-full py-5 md:py-2 px-4 outline-none placeholder:text-[13px] placeholder:text-slate-500 text-slate-500 placeholder:font-normal text-[13px] font-medium"
				/>
				<button type="submit" class="bg-orange-400 cursor-pointer p-3">
					<SearchIcon class="text-sm  text-white" size={'16'} />
				</button>
			</div>
		</form>
		<div>
			{#if mobileNavIsOpen}
				<Menu handleClick={toggleMobileNav} />
			{/if}
		</div>
	</header>
{/if}
