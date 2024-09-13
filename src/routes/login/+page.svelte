<script lang="ts">
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/form/Button.svelte';
	import Input from '$lib/components/form/Input.svelte';
	import Icon from '@iconify/svelte';
	import {
		FacebookAuthProvider,
		GoogleAuthProvider,
		getAdditionalUserInfo,
		signInWithEmailAndPassword,
		signInWithPopup
	} from 'firebase/auth';
	import { auth, firestore } from '../../config/firebase';
	import Loader from '$lib/components/Loader.svelte';
	import { goto } from '$app/navigation';
	import { createForm } from 'svelte-forms-lib';
	import * as Yup from 'yup';
	import toast from 'svelte-french-toast';
	import authMessages from '../../data/auth-messages';
	import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

	const googleProvider = new GoogleAuthProvider();
	const facebookProvider = new FacebookAuthProvider();
	let loggingInWithGoogle = false;

	let loggingInWithFacebook = false;

	const handleResultsSocial = async (results) => {
		const { isNewUser } = getAdditionalUserInfo(results);
		if (isNewUser) {
			await setDoc(doc(firestore, 'users', results.user.uid), {
				email: results.user.email || '',
				first_name: results.user?.displayName?.split(' ')[0] || '',
				last_name: results.user?.displayName?.split(' ')[1] || '',
				phone: results.user?.phoneNumber || '',
				photo: results.user?.photoURL || '',
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp()
			});
			loggingInWithGoogle = false;
			loggingInWithFacebook = false;
			goto('/');
			toast.success('Login sucesssfully');
		} else {
			loggingInWithGoogle = false;
			loggingInWithFacebook = false;
			goto('/');
			toast.success('Login sucesssfully');
		}
	};

	const handleGoogleLogin = () => {
		loggingInWithGoogle = true;
		return signInWithPopup(auth, googleProvider)
			.then(async (results) => {
				await handleResultsSocial(results);
			})
			.catch((error) => {
				const errorMessage = error.message;
				toast.error(errorMessage);
				loggingInWithGoogle = false;
			});
	};

	const handleFacebookLogin = () => {
		loggingInWithFacebook = true;
		return signInWithPopup(auth, facebookProvider)
			.then(async (results) => {
				await handleResultsSocial(results);
			})
			.catch((error) => {
				const errorMessage = error.message;
				toast.error(errorMessage);
				loggingInWithFacebook = false;
			});
	};

	// @ts-ignore
	const { errors, touched, isValid, isSubmitting, handleBlur, handleChange, handleSubmit, form } =
		createForm({
			initialValues: {
				password: '',
				email: ''
			},
			validationSchema: Yup.object().shape({
				password: Yup.string().required(),
				email: Yup.string().email().required()
			}),
			onSubmit: (values) => {
				return signInWithEmailAndPassword(auth, values.email, values.password)
					.then(() => {
						goto('/');
						toast.success('Login success');
					})
					.catch((e) => {
						toast.error(authMessages[e.code]);
						console.log(e);
					});
			}
		});

	let agree = false;
</script>

<Seo title="Login" />

<section class="px-5 md:px-3 sm:h-full sm:p-0 pb-6">
	<div class="max-w-7xl mx-auto py-7 sm:h-full sm:py-0 lg:py-4">
		<div
			class="max-w-lg sm:h-full border sm:px-4 sm:border-none px-6 py-3 border-slate-200 bg-white mx-auto w-full rounded-[4px]"
		>
			<form class:invalid={$isValid} on:submit={handleSubmit}>
				<div class="py-2 space-y-2 lg:py-1">
					<h4 class="font-bold text-[17px]">Welcome back</h4>
					<span class="font-medium block text-[13.5px] text-slate-500">
						Enter your credetials for you to login.
					</span>
				</div>
				<div class="space-y-2">
					<div class="mt-2 space-y-2">
						<Input
							on:keyup={handleChange}
							on:blur={handleBlur}
							bind:value={$form.email}
							error={$errors.email && $touched.email ? $errors.email : ''}
							placeholder="Enter your email"
							label="email"
							name="email"
							type="text"
						/>
						<Input
							bind:value={$form.password}
							on:keyup={handleChange}
							on:blur={handleBlur}
							error={$errors.password && $touched.password ? $errors.password : ''}
							placeholder="Enter your password"
							label="Password"
							name="password"
							type="password"
						/>
						<!-- Remember me section -->
						<div class="flex justify-between items-center">
							<div class="flex gap-3 cursor-pointer">
								<Checkbox checked={agree} on:change={() => (agree = !agree)} label="Remember Me!" />
							</div>
							<div>
								<a
									class="text-[13.5px] text-[#f0b111] hover:underline font-medium cursor-pointer underline-"
									href="/forgotPassword">Forgot Your password?</a
								>
							</div>
						</div>
						<!-- submit button -->
						<Button disabled={!$isValid} loading={$isSubmitting} type="submit"
							>Login your account</Button
						>
					</div>
					<div class="text-center">
						<div class="relative flex py-4 items-center">
							<div class="flex-grow border-t border-dashed border-gray-300" />
							<span class="flex-shrink mx-4 font-medium text-sm text-gray-500">Or</span>
							<div class="flex-grow border-t border-dashed border-gray-300" />
						</div>
						<div class="flex items-center sm:flex-col gap-3">
							<button
								on:click={(e) => {
									e.preventDefault();
									handleGoogleLogin();
								}}
								disabled={loggingInWithGoogle}
								type="submit"
								class=" mt-2 lg:text-sm py-3 border border-gray-200
						font-semibold flex hover:bg-white bg-gray-50 duration-300 items-center justify-center gap-4 text-sm w-full rounded-[4px]"
							>
								{#if loggingInWithGoogle}
									<Loader />
								{:else}
									<Icon icon="devicon:google" class="text-lg" />
								{/if}
								<span class="font-medium text-slate-600 capitalize">signin with google</span>
							</button>
							<button
								on:click={(e) => {
									e.preventDefault();
									handleFacebookLogin();
								}}
								disabled={loggingInWithFacebook}
								type="submit"
								class=" mt-2 lg:text-sm py-3 border border-gray-200
						font-semibold flex hover:bg-white bg-gray-50 duration-300 items-center justify-center gap-4 text-sm w-full rounded-[4px]"
							>
								{#if loggingInWithFacebook}
									<Loader />
								{:else}
									<Icon icon="logos:facebook" class="text-lg" />
								{/if}
								<span class="font-medium text-slate-600 capitalize">signin with facebook</span>
							</button>
						</div>
					</div>
					<div class="py-3">
						<p class="text-center text-slate-500 font-medium text-sm">
							<span>Don't have an account? </span>
							<a
								class="text-sm hover:no-underline text-[#f0b111] cursor-pointer underline"
								href="/register">Create account</a
							>
						</p>
					</div>
				</div>
			</form>
		</div>
	</div>
</section>
