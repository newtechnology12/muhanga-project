<script>
	import slugify from '../../utils/slugify';

	export let category;
	let expanded = false;
</script>

{#each category.subcategories.slice(0, expanded ? 100 : 4) as sub}
	<li class="flex truncate">
		<a
			target={category.link ? '_blank' : ''}
			href={category.link || `/categories/${category.slug}/${slugify(sub.text)}`}
			class="text-[14px] line-clamp-1 flex leading-7 text-slate-500 font-medium- hover:underline"
		>
			{sub.text}
		</a>
	</li>
{/each}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<a
	on:click={() => {
		expanded = !expanded;
	}}
	class="text-[13px] cursor-pointer flex items-center gap-2 text-orange-500 font-medium hover:underline"
>
	View {expanded ? 'Less' : 'More'}
	{#if expanded}
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 12 12"
			><path
				fill="currentColor"
				d="M6 4c-.2 0-.4.1-.5.2L2.2 7.5c-.3.3-.3.8 0 1.1c.3.3.8.3 1.1 0L6 5.9l2.7 2.7c.3.3.8.3 1.1 0c.3-.3.3-.8 0-1.1L6.6 4.3C6.4 4.1 6.2 4 6 4"
			/></svg
		>
	{:else}
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 12 12"
			><path
				fill="currentColor"
				d="M6 8.825c-.2 0-.4-.1-.5-.2l-3.3-3.3c-.3-.3-.3-.8 0-1.1c.3-.3.8-.3 1.1 0l2.7 2.7l2.7-2.7c.3-.3.8-.3 1.1 0c.3.3.3.8 0 1.1l-3.2 3.2c-.2.2-.4.3-.6.3"
			/></svg
		>
	{/if}
</a>
