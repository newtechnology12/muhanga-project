import { error } from '@sveltejs/kit';
import admin from '$lib/images/firebaseAdmin.js';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const advert = await admin.firestore().collection('adverts').doc(params.advertId).get();

	if (!advert.exists) throw error(404, 'Page not found');

	const data: any = {
		...advert.data(),
		id: advert.id,
		createdAt: advert.data().createdAt?.toDate(),
		updatedAt: advert.data().updatedAt?.toDate(),
		author: { ...advert.data().author, createdAt: advert.data().author.createdAt?.toDate() }
	};
	return {
		advert: data
	};
}
