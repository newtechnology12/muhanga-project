<script>
	import { page } from '$app/stores';
</script>

<div class="max-w-7xl mx-auto flex flex-col h-[50vh]">
	{#if $page?.error}
		<div class="py-24">
			<div class="flex flex-col px-3 justify-center items-center gap-4 text-center">
				<p class="text-sm font-semibold text-orange-600 uppercase tracking-wide">
					{$page?.status} error
				</p>
				<h1 class="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-xl">
					{$page?.status === 404 ? 'Page not found.' : 'Server error occured'}
				</h1>
				<p class="mt-2 text-sm leading-7 font-medium text-gray-500">
					{$page?.status === 404
						? 'Sorry, we couldn’t find the page you’re looking for..'
						: 'Some thing went wrong on the server, try again letter or contact the website owners.'}
				</p>
				<div class="mt-6">
					<a
						href="/"
						class="text-sm gap-3 flex items-center font-medium text-orange-600 hover:text-[#f0b111]"
						>Go back home<span aria-hidden="true"> &rarr;</span></a
					>
				</div>
			</div>
		</div>
	{/if}
</div>
