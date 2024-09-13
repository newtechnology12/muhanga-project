<script>
	import AdvertForm from '$lib/components/AdvertForm.svelte';
	import Seo from '$lib/components/Seo.svelte';
	export let data;

	const advert = data.advert;
</script>

<Seo title="Create a new advert" />
<AdvertForm {advert} />
