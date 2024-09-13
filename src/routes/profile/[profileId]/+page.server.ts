import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../../config/firebase.js';
import { error } from '@sveltejs/kit';
import admin from '$lib/images/firebaseAdmin.js';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const profile = await admin.firestore().collection('users').doc(params.profileId).get();

	const adverts: any = await admin
		.firestore()
		.collection('adverts')
		.where('author.id', '==', profile.id)
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

	if (!profile.exists) throw error(404, 'Page not found');

	const data: any = {
		...profile.data(),
		id: profile.id,
		createdAt: profile.data().createdAt ? profile.data().createdAt.toDate() : undefined,
		updatedAt: profile.data().updatedAt ? profile.data().updatedAt.toDate() : undefined
	};

	return {
		profile: data,
		adverts: adverts
	};
}
