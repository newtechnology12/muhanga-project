<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import AdvertForm from '$lib/components/AdvertForm.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { authStore } from '../../stores/auth';

	$: authSession = $authStore;

	$: {
		if (browser) {
			if (!authSession?.user && !authSession?.loading) {
				goto('/login');
			}
		}
	}
</script>

<Seo title="Create a new advert" />
<AdvertForm />
