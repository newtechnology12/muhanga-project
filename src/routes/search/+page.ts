import algoliasearch from 'algoliasearch';
export const prerender = false;
const client = algoliasearch('ITIQABQHI5', 'e5c5400d5151279e8068cbd327bf0a34');

const index = client.initIndex('adverts');

/** @type {import('./$types').PageLoad} */
export async function load({ params, url }) {
	let search = url.searchParams.get('q');
	let category = url.searchParams.get('category');

	const results_count = 0;

	const filters = category && category !== 'all' ? `category:${category}` : '';

	console.log(filters);

	const indexResults = await index.search(search, {
		filters: filters
	});

	const results: any = indexResults.hits.map((e) => ({ ...e, id: e?.objectID }));

	return {
		search,
		results_count,
		results
	};
}
