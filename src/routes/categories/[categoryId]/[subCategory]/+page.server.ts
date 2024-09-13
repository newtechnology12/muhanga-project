import { error } from '@sveltejs/kit';
import categories from '../../../../data/categories.js';
import slugify from '../../../../utils/slugify.js';
import admin from '$lib/images/firebaseAdmin.js';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const category = categories
		.find((e) => slugify(e.text) === params.categoryId)
		?.subcategories?.find((e) => e?.slug === params?.subCategory);

	if (!category) throw error(404, 'Page not found');

	console.log(category);

	const adverts: any = await admin
		.firestore()
		.collection('adverts')
		.where('sub_category', '==', category.slug)
		.get()
		.then((e) =>
			e.docs.map((e) => ({
				...e.data(),
				id: e.id,
				createdAt: e.data().createdAt.toDate(),
				updatedAt: e.data().updatedAt.toDate(),
				author: { ...e.data().author, createdAt: e.data().author.createdAt.toDate() }
			}))
		);

	return {
		adverts: adverts,
		category
	};
}
