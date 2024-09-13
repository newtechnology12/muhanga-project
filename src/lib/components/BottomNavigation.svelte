<script>
	import { cn } from '../../utils/cn';
	import { page } from '$app/stores';
	import { authStore } from '../../stores/auth';

	$: auth = $authStore;
</script>

<section
	id="bottom-navigation"
	class={cn('fixed hidden md:block inset-x-0 border-t bottom-0 z-10 bg-white shadow', {
		'sm:hidden': ['/messages/[conversation_id]'].includes($page.route.id)
	})}
>
	<div id="tabs" class="flex justify-between">
		<a
			href="/"
			class={cn(
				'w-full focus:text-[#f0b111] hover:text-[#f0b111] gap-1 flex flex-col justify-center items-center text-center pt-2 pb-1',
				{
					'text-[#f0b111]': $page.url.pathname === '/'
				}
			)}
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
				><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"
					><path d="M9 16c.85.63 1.885 1 3 1s2.15-.37 3-1" /><path
						d="m21.636 12.958l-.279 1.937c-.487 3.388-.731 5.081-1.906 6.093C18.276 22 16.553 22 13.106 22h-2.212c-3.447 0-5.17 0-6.345-1.012c-1.175-1.012-1.419-2.705-1.906-6.093l-.279-1.937c-.38-2.637-.57-3.956-.029-5.083c.54-1.127 1.691-1.813 3.992-3.183l1.385-.825C9.8 2.622 10.846 2 12 2c1.154 0 2.199.622 4.288 1.867l1.385.825c2.3 1.37 3.451 2.056 3.992 3.183"
					/></g
				></svg
			>
			<span class="text-[11px] font-medium">Home</span>
		</a>
		<a
			href={auth?.user?.uid ? '/messages' : '/login'}
			class={cn(
				'w-full focus:text-[#f0b111] hover:text-[#f0b111] gap-1 flex flex-col justify-center items-center text-center pt-2 pb-1',
				{
					'text-[#f0b111]': $page.url.pathname === '/messages'
				}
			)}
		>
			<svg
				class="stroke-current"
				width="18"
				height="18"
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
			<span class="text-[11px] font-medium">Messages</span>
		</a>
		<a
			href={auth?.user?.uid ? '/new-advert' : '/login'}
			class={cn(
				'w-full focus:text-[#f0b111] hover:text-[#f0b111] gap-1 flex flex-col justify-center items-center text-center pt-2 pb-1'
			)}
		>
			<div class="bg-[#f0b111] p-[8px] rounded-[4px]">
				<svg
					class="text-white"
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					><path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-width="2"
						d="M15 12h-3m0 0H9m3 0V9m0 3v3m10-3c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464c.974.974 1.3 2.343 1.41 4.536"
					/></svg
				>
			</div>
			<!-- <span class="tab tab-explore block text-xs">New</span> -->
		</a>
		<a
			href={auth?.user?.uid ? '/saved' : '/login'}
			class={cn(
				'w-full focus:text-[#f0b111] hover:text-[#f0b111] gap-1 flex flex-col justify-center items-center text-center pt-2 pb-1',
				{
					'text-[#f0b111]': $page.url.pathname === '/saved'
				}
			)}
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
				><path
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-width="2"
					d="M3 11.098v4.993c0 3.096 0 4.645.734 5.321c.35.323.792.526 1.263.58c.987.113 2.14-.907 4.445-2.946c1.02-.901 1.529-1.352 2.118-1.47c.29-.06.59-.06.88 0c.59.118 1.099.569 2.118 1.47c2.305 2.039 3.458 3.059 4.445 2.945c.47-.053.913-.256 1.263-.579c.734-.676.734-2.224.734-5.321v-4.994c0-4.288 0-6.432-1.318-7.765C18.364 2 16.242 2 12 2C7.757 2 5.636 2 4.318 3.332C3.511 4.148 3.198 5.27 3.077 7M15 6H9"
				/></svg
			>
			<span class="text-[11px] font-medium">Saved</span>
		</a>
		<a
			href={auth?.user?.uid ? '/account' : '/login'}
			class={cn(
				'w-full focus:text-[#f0b111] hover:text-[#f0b111] gap-1 flex flex-col justify-center items-center text-center pt-2 pb-1',
				{
					'text-[#f0b111]': $page.url.pathname === '/account'
				}
			)}
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
				><g fill="none" stroke="currentColor" stroke-width="1.7"
					><circle cx="12" cy="9" r="2" /><path
						d="M16 15c0 1.105 0 2-4 2s-4-.895-4-2s1.79-2 4-2s4 .895 4 2Z"
					/><path
						stroke-linecap="round"
						d="M3 10.417c0-3.198 0-4.797.378-5.335c.377-.537 1.88-1.052 4.887-2.081l.573-.196C10.405 2.268 11.188 2 12 2c.811 0 1.595.268 3.162.805l.573.196c3.007 1.029 4.51 1.544 4.887 2.081C21 5.62 21 7.22 21 10.417v1.574c0 2.505-.837 4.437-2 5.913M3.193 14c.857 4.298 4.383 6.513 6.706 7.527c.721.315 1.082.473 2.101.473c1.02 0 1.38-.158 2.101-.473c.579-.252 1.231-.58 1.899-.994"
					/></g
				></svg
			>

			<span class="text-[11px] font-medium">Account</span>
		</a>
	</div>
</section>
