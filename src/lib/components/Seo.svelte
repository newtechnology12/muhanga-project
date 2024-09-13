<script lang="ts">
	export let description: string =
		'A market place to buy, rent or sell cars your properties very easy without any commmition';
	export let title = '';

	const pageTitle = `Elo Dreams - ${
		title || 'Post, Sell and connect with Buyers & sellers in Rwanda'
	}`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={description} />
	<meta
		name="robots"
		content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
	/>
	<link rel="prefetch" href="/logo.png" />
</svelte:head>
