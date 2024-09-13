<script lang="ts">
	import Icon from '@iconify/svelte';
	import img from '$lib/images/log2.png';
	import { authStore } from '../../../stores/auth';
	$: auth = $authStore;

	$: items = [
		{
			title: 'Home',
			icon: 'majesticons:home-line',
			link: '/'
		},
		{
			title: 'Sign Up',
			icon: 'mdi:register-outline',
			link: '/register',
			hidden: auth?.user?.uid
		},
		{
			title: 'Log In',
			icon: 'solar:login-outline',
			link: '/login',
			hidden: auth?.user?.uid
		},
		{
			title: 'Account',
			icon: 'mdi:account-outline',
			link: '/account',
			hidden: !auth?.user?.uid
		},
		{
			title: 'My Profile',
			icon: 'mdi:account-outline',
			link: `/profile/${auth?.user?.uid}`,
			hidden: !auth?.user?.uid
		},

		{
			title: 'My adverts',
			icon: 'mdi:account-outline',
			link: `/profile/${auth?.user?.uid}`,
			hidden: !auth?.user?.uid
		},
		{
			title: 'Saved Adverts',
			icon: 'mdi:account-outline',
			link: '/saved',
			hidden: !auth?.user?.uid
		},

		{
			title: 'Messages',
			icon: 'fluent:chat-16-regular',
			link: '/messages',
			hidden: !auth?.user?.uid
		},
		{
			title: 'Logout',
			icon: 'mdi:account-outline',
			link: `/logout`,
			hidden: !auth?.user?.uid
		}
	];
	export let handleClick;
</script>

<section class="z-50 fixed md:w-full inset-0">
	<div class="fixed inset-0" />
	<div class="mx-auto h-full w-full bg-gray-100 shadow-lg rounded-lg relative z-40 flex flex-col">
		<div class="relative flex h-full flex-col">
			<div class=" py-6">
				<button class="border-b w-full grid pb-2" on:click={handleClick}>
					<div class="px-6 ml-auto transform hover:rotate-90">
						<Icon icon="vaadin:close" class="text-base" />
					</div>
				</button>
				<div class="mt-6 px-7">
					<div class="flex justify-between items-center">
						<a on:click={handleClick} href="/">
							<p class="text-center text-sm font-semibold">Menu</p>
						</a>
						<!-- <a href="/new-advert" on:click={handleClick}>
							<p class="underline text-[13px] font-medium tracking-wide text-[#f0b111]">
								Want to Sell?
							</p>
						</a> -->
					</div>
					<div class="flex flex-col mt-7">
						{#each items.filter((e) => !e.hidden) as { link, icon, title }}
							<a on:click={handleClick} href={link}>
								<div
									class="flex justify-between border-b py-4 items-center hover:text-[#f0b111] duration-300 text-xs font-medium group-hover:text-[#f0b111] capitalize"
								>
									{title}
									<Icon icon={'formkit:right'} class="text-sm ml-auto group-hover:text-[#f0b111]" />
								</div>
							</a>
						{/each}
					</div>
				</div>
			</div>
			<a on:click={handleClick} href="/" class="mx-auto mt-auto mb-24">
				<h1 class="font-semibold text-lg tracking-wider text-orange-500">Infinity Tech Solution</h1>

				<!-- <img src={img} alt="" class="h-[3.3rem] object-cover object-center" /> -->
			</a>
		</div>
	</div>
</section>
