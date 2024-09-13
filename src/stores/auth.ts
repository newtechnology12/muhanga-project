import { writable, type Writable } from 'svelte/store';

type User = {
	uid: string;
	email: string;
	displayName: string;
	photoURL: string;
};

type SessionState = {
	user: User | null;
	loading?: boolean;
	loggedIn?: boolean;
};

export const authStore = <Writable<SessionState>>writable();
