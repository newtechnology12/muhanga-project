<script lang="ts">
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/form/Button.svelte';
	import Input from '$lib/components/form/Input.svelte';
	import { sendPasswordResetEmail } from 'firebase/auth';
	import { auth } from '../../config/firebase';
	import toast from 'svelte-french-toast';
	import authMessages from '../../data/auth-messages';
	import * as Yup from 'yup';
	import { createForm } from 'svelte-forms-lib';

	// @ts-ignore
	const { errors, touched, isValid, isSubmitting, handleBlur, handleChange, handleSubmit, form } =
		createForm({
			initialValues: {
				email: ''
			},
			validationSchema: Yup.object().shape({
				email: Yup.string().email().required()
			}),
			onSubmit: (values) => {
				return sendPasswordResetEmail(auth, values.email)
					.then(() => {
						toast.success('Resset link sent successfully to your email');
					})
					.catch((e) => {
						toast.error(authMessages[e.code]);
						console.log(e);
					});
			}
		});
</script>

<Seo title="Forgot your password" />

<section class="px-5 sm:px-0 md:px-3 sm:h-full">
	<div class="max-w-7xl sm:h-full mx-auto py-14 sm:py-0 lg:py-4">
		<div
			class="max-w-lg border sm:h-full md:px-4 sm:border-0 sm px-5 py-3 border-slate-200 bg-white mx-auto w-full rounded-[4px]"
		>
			<form class:invalid={$isValid} on:submit={handleSubmit}>
				<div class="py-2 space-y-2 lg:py-1">
					<h4 class="font-bold text-[17px]">Forgot your password</h4>
					<span class="font-medium leading-7 block text-[13.5px] text-slate-500">
						Enter your your email to send you a reset link.
					</span>
				</div>
				<div class="mt-4 space-y-2">
					<Input
						bind:value={$form.email}
						on:keyup={handleChange}
						on:blur={handleBlur}
						error={$errors.email && $touched.email ? $errors.email : ''}
						placeholder="Enter your email"
						label="email"
						name="email"
						type="text"
					/>
					<div class="flex justify-between items-center">
						<div class="flex gap-3 cursor-pointer">
							<Checkbox label="Agree term & conditions" />
						</div>
					</div>
					<!-- submit button -->
					<Button disabled={!$isValid} loading={$isSubmitting} type="submit">Send Reset link</Button
					>
					<div class="py-3">
						<p class="text-center text-slate-500 font-medium text-sm">
							<span>Remember your password? </span>
							<a
								class="text-sm hover:no-underline text-[#f0b111] cursor-pointer underline"
								href="/login">Sign in</a
							>
						</p>
					</div>
				</div>
			</form>
		</div>
	</div>
</section>
