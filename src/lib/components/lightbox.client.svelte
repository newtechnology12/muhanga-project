<script lang="ts">
	import { GalleryImage, LightboxGallery } from 'svelte-lightbox';
	export let open: boolean;
	export let title: any;
	export let images: any;
	export let controller: any;
</script>

<!-- <LightboxGallery /> -->
<LightboxGallery
	transitionDuration={100}
	enableImageExpand
	activeImage={1}
	bind:programmaticController={controller}
	{title}
>
	{#each images as image}
		<GalleryImage>
			<img src={image} alt="Simple lightbox" />
		</GalleryImage>
	{/each}
</LightboxGallery>
