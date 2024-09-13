<script>
	import Header from '$lib/components/Header.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import { navigating } from '$app/stores';
	import { page } from '$app/stores';

	import '../app.css';
	// @ts-ignore
	import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';
	import Footer from '$lib/components/Footer.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { Toaster } from 'svelte-french-toast';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	NProgress.configure({
		minimum: 0.16
	});

	$: {
		if ($navigating) {
			NProgress.start();
		}
		if (!$navigating) {
			NProgress.done();
		}
	}

	// ...
	import { authStore } from '../stores/auth';
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { auth } from '../config/firebase';
	import { browser } from '$app/environment';
	import { cn } from '../utils/cn';

	// ...
	onMount(() => {
		onAuthStateChanged(auth, (e) => {
			authStore.set({
				user: e,
				loading: false,
				loggedIn: e ? true : false
			});
		});
	});

	const options = {};

	console.log($page);
</script>

<SvelteToast {options} />
<Toaster />

<QueryClientProvider client={queryClient}>
	<Nav />

	<div
		class={cn('md:mt-[4.7rem] bg-red-300= sm:h-screen sm:mt-[3.7rem]', {
			'sm:!mt-0': [
				'/messages',
				'/login',
				'/register',
				'/forgotPassword',
				'/messages/[conversation_id]'
			].includes($page.route.id)
		})}
	>
		<Header />
		<div class="bg-slate-50 sm:h-fit sm:pb-8">
			<slot />
		</div>
	</div>
	<Footer />
</QueryClientProvider>

<!-- <WhatsapWidget /> -->
