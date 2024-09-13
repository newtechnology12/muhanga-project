import memoize from 'lodash.memoize';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	// apiKey: 'AIzaSyDlvHs-a3EIG0hbY9FH0RJAINVJaP2qey0',
	// authDomain: 'elohome-9db56.firebaseapp.com',
	// projectId: 'elohome-9db56',
	// storageBucket: 'elohome-9db56.appspot.com',
	// messagingSenderId: '193794078180',
	// appId: '1:193794078180:web:15b2997f7f3f6b59b70Zaa3f1',
	// measurementId: 'G-J2Z31YBXQE'

	apiKey: 'AIzaSyDlvHs-a3EIG0hbY9FH0RJAINVJaP2qey0',
	authDomain: 'elohome-9db56.firebaseapp.com',
	projectId: 'elohome-9db56',
	storageBucket: 'elohome-9db56.appspot.com',
	messagingSenderId: '193794078180',
	appId: '1:193794078180:web:15b2997f7f3f6b59b70Zaa3f1',
	measurementId: 'G-J2Z31YBXQE'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
