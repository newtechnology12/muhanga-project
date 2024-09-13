<script lang="ts">
	$: authSession = $authStore;

	import Icon from '@iconify/svelte';
	import { authStore } from '../../stores/auth';
	import categories from '../../data/categories';
	let items = [
		{
			icon: 'basil:phone-out-outline',
			text1: 'Do you need support?',
			text2: '+250 787 320 675 ',
			link: 'tel:+250 787 320 675'
		},
		{
			icon: 'ion:mail-outline',
			text1: 'Need help?',
			text2: 'elohomerwanda@gmail.com',
			link: 'mailto:elohomerwanda@gmail.com'
		}
		// {
		// 	icon: 'tdesign:location',
		// 	text1: 'Location',
		// 	text2: 'CHIC building - basement 3 - A056B ',
		// 	link: 'https://maps.app.goo.gl/H94ZTQBPnFLg7sut8'
		// }
	];
	$: items2 = [
		{
			title: 'About us',
			arr: [
				{ title: 'Who are we?', link: '/' },
				{ title: 'Our story', link: '/' },
				{ title: 'Commistion terms', link: '/' },
				{ title: 'Our pattners', link: '/' }
			]
		},
		{
			title: 'Quick links',
			arr: [
				{ title: 'register', link: '/register' },
				{ title: 'login', link: '/login' },
				{ title: 'start selling', link: authSession?.user?.uid ? '/new-advert' : '/login' },
				{ title: 'All categories', link: '/' }
			]
		},
		{
			title: 'Categories',
			arr: categories.slice(0, 4).map((e) => ({ title: e.text, link: `/categories/${e.slug}` }))
		},
		{
			title: 'Legal & policy',
			arr: [
				{ title: 'Privacy', link: '/' },
				{ title: 'Term of service', link: '/' },
				{ title: 'Commition terms', link: '/' },
				{ title: 'About us', link: '/' }
			]
		}
	];
</script>

<footer class="border-t md:hidden">
	<div class="mx-auto px-3 md:pb-20 max-w-7xl text-gray-600 pt-5 pb-7">
		<div class="grid-cols-7 gap-10 grid lg:grid-cols-2 lg:px-2">
			<div class="col-span-2">
				<h1 class="font-bold text-slate-800 capitalize text-sm">Contact us</h1>
				<div class="space-y-6 mt-7">
					{#each items as { icon, text1, text2, link }}
						<a href={link} class="flex items-start lg:items-center gap-6 group cursor-pointer">
							<Icon {icon} class="text-4xl font-bold group-hover:rotate-45 duration-300" />
							<div class="space-y-3">
								<p class="font-semibold text-[13px]">{text1}</p>
								<p class="text-[13.5px] text-slate-500 group-hover:underline font-medium">
									{text2}
								</p>
							</div>
						</a>
					{/each}
				</div>
			</div>
			<div class="col-span-5 grid grid-cols-4 gap-5 lg:grid-cols-2 lg:px-[9px]">
				{#each items2 as { title, arr }}
					<div>
						<h1 class="font-bold text-slate-800 capitalize text-sm">{title}</h1>
						<div class="space-y-6 mt-7">
							{#each arr as item}
								<a
									href={item.link}
									class="text-[13.5px] block font-medium capitalize hover:underline cursor-pointer"
								>
									{item.title}
								</a>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div class="py-5 lg:flex-col md:hidden mx-auto border-t border-t-500 lg:pb-10">
		<div class="flex px-3 justify-between mx-auto max-w-7xl items-center lg:flex-col lg:space-y-3">
			<div class="flex gap-2 items-center lg:flex-col text-sm lg:text-xs font-normal">
				<div>
					<p class="text-capitalize text-slate-600 text-[13px] font-medium">
						© {new Date().getFullYear()} Infinity Tech Solution. All Rights Reserved
					</p>
				</div>
			</div>
			<div class="flex items-center text-slate-600 gap-4">
				<a href="https://facebook.com" target="_blank">
					<Icon icon="ic:baseline-facebook" class="text-lg hover:text-[#f0b111]" />
				</a>
				<a href="https://twitter.com" target="_blank">
					<Icon icon="mdi:twitter" class="text-lg hover:text-[#f0b111]" />
				</a>
				<a href="https://instagram.com" target="_blank">
					<Icon icon="mdi:instagram" class="text-lg hover:text-[#f0b111]" />
				</a>
				<a href="https://linkedin.com" target="_blank">
					<Icon icon="akar-icons:linkedin-fill" class="text-lg hover:text-[#f0b111]" />
				</a>
			</div>
		</div>
	</div>
</footer>
