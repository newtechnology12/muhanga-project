import admin from 'firebase-admin';
import * as credential from '../config/serviceAccounts.json';

if (!admin.apps.length) {
	admin.initializeApp({
		// @ts-ignore
		credential: admin.credential.cert(credential)
	});
}

export default admin;
