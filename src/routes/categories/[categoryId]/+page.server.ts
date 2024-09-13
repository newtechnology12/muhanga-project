import { collection, getDocs, query, where } from 'firebase/firestore';
import { error } from '@sveltejs/kit';
import categories from '../../../data/categories.js';
import slugify from '../../../utils/slugify.js';
import { firestore } from '../../../config/firebase.js';
import admin from '$lib/images/firebaseAdmin.js';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const category = categories.find((e) => slugify(e.text) === params.categoryId);
	if (!category) throw error(404, 'Page not found');

	const adverts: any = await admin
		.firestore()
		.collection('adverts')
		.where('category', '==', category.slug)
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
