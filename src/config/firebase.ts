import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyCst0G7Av4DTYFv6M6DAQVxjg59emuubaE',
	authDomain: 'muhanga-real-estate.firebaseapp.com',
	projectId: 'muhanga-real-estate',
	storageBucket: 'muhanga-real-estate.appspot.com',
	messagingSenderId: '669026658696',
	appId: '1:669026658696:web:f1a52547065a420ab4f23d',
	measurementId: 'G-5WGP9JKK0B'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
