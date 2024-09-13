<script>
	import { signOut } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { auth } from '../../config/firebase';
	import { goto } from '$app/navigation';

	onMount(() => {
		signOut(auth).then((e) => {
			goto('/login');
		});
	});
</script>
