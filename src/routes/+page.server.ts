// it so that it gets served as a static asset in production
export const prerender = false;

import admin from '$lib/images/firebaseAdmin.js';

/** @type {import('./$types').PageLoad} */
export async function load() {
	const popular = await admin
		.firestore()
		.collection('adverts')
		.where('category', '==', 'vehicles')
		.limit(30)
		.get()
		.then((snapshot) => {
			const data = [];
			snapshot.forEach((doc) => {
				data.push({
					id: doc.id,
					...doc.data(),
					location: {},
					createdAt: doc.data().createdAt.toDate(),
					updatedAt: doc.data().updatedAt.toDate(),
					author: {
						...doc.data().author,
						createdAt: doc.data().author?.createdAt
							? doc.data().author?.createdAt?.toDate()
							: undefined
					}
				});
			});
			return data;
		});

	return {
		popular
	};
}
