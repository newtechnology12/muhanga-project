<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/form/Button.svelte';
	import Input from '$lib/components/form/Input.svelte';
	import Select from '$lib/components/form/Select.svelte';
	import { UserIcon } from 'svelte-feather-icons';
	import Icon from '@iconify/svelte';
	import {
		EmailAuthProvider,
		deleteUser,
		getIdTokenResult,
		reauthenticateWithCredential,
		signInWithEmailAndPassword,
		signOut,
		updatePassword,
		updateProfile
	} from 'firebase/auth';
	import { auth, firestore, storage } from '../../config/firebase';
	import { goto } from '$app/navigation';
	import { cn } from '../../utils/cn';
	import { authStore } from '../../stores/auth';
	import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
	import toast from 'svelte-french-toast';
	import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
	import { createQuery } from '@tanstack/svelte-query';
	import { createForm } from 'svelte-forms-lib';
	import * as Yup from 'yup';
	import { browser } from '$app/environment';
	import Textarea from '$lib/components/form/Textarea.svelte';

	let photoInput;

	let logingOut = false;

	const handleLogout = () => {
		logingOut = true;
		setTimeout(() => {
			return signOut(auth)
				.then(() => {
					goto('/');
					logingOut = false;
				})
				.catch((e) => {
					logingOut = false;
					console.log(e.message);
				});
		}, 1000);
	};

	$: authSession = $authStore;

	let uplaodingProfile = false;

	function handleFilesSelect(e) {
		uplaodingProfile = true;
		const file = e.target.files[0];

		const photoRef = ref(storage, `users/${authSession.user.uid}/profile_images/${file.name}`);

		return uploadBytes(photoRef, file)
			.then(async (snapshot) => {
				const url = await getDownloadURL(snapshot.ref);
				await updateDoc(doc(firestore, 'users', authSession.user.uid), {
					photo: url
				});
				await updateProfile(auth.currentUser, {
					photoURL: url
				});

				await auth.currentUser.reload().then((e) => {
					authStore.update((e) => ({ ...e, user: auth.currentUser }));
				});

				toast.success('Photo updated sucessfully');

				uplaodingProfile = false;
				console.log(url);
			})
			.catch((error) => {
				uplaodingProfile = false;
				toast.error(error.message);
			});
	}

	$: userProfile = createQuery({
		queryFn: () =>
			getDoc(doc(firestore, 'users', authSession.user.uid)).then((e) => {
				console.log(e);
				return {
					...e.data(),
					id: e.id
				};
			}),
		queryKey: ['user-profile', authSession?.user?.uid],
		enabled: Boolean(authSession?.user)
	});

	$: {
		if ($userProfile) {
			const values = getInitialValues($userProfile.data);
			updateInitialValues(values);
		}
	}

	const getInitialValues = (data?: any) => {
		return {
			first_name: data?.first_name || '',
			last_name: data?.last_name || '',
			email: data?.email || '',
			phone: data?.phone || '',
			address: data?.address || '',
			gender: data?.gender || '',
			city: data?.city || '',
			bio: data?.bio || '',
			zip_code: data?.zip_code || ''
		};
	};

	const {
		errors,
		touched,
		isValid,
		isSubmitting,
		// @ts-ignore
		handleBlur,
		handleChange,
		handleSubmit,
		form,
		updateInitialValues
	} = createForm({
		initialValues: getInitialValues(),
		validationSchema: Yup.object().shape({
			first_name: Yup.string().required(),
			last_name: Yup.string().required(),
			email: Yup.string().required(),
			phone: Yup.string().required(),
			address: Yup.string().required(),
			gender: Yup.string().required(),
			city: Yup.string().required(),
			zip_code: Yup.string().required(),
			bio: Yup.string().required()
		}),
		onSubmit: (values) => {
			return Promise.all([
				updateDoc(doc(firestore, 'users', $userProfile.data.id), {
					...values,
					updatedAt: serverTimestamp()
				}),
				updateProfile(auth.currentUser, {
					displayName: values.first_name + ' ' + values.last_name
				})
			])
				.then(async (e) => {
					console.log(e);
					return auth.currentUser.reload().then((e) => {
						toast.success('Updated your profile successfully');
						$userProfile.refetch();
						authStore.update((e) => ({ ...e, user: auth.currentUser }));
					});
				})
				.catch((e) => {
					console.log(e);
					toast.error('Error: failed to update your profile');
				});
		}
	});

	const {
		handleChange: handlePasswordFormChange,
		// @ts-ignore
		handleBlur: handlePasswordFormBlur,
		form: changePasswordForm,
		errors: changePasswordFormErrors,
		touched: changePasswordFormTouched,
		isSubmitting: changePasswordFormIsSubmiting,
		isValid: changePasswordFormIsValid,
		handleSubmit: changePasswordHandleSubmit,
		handleReset
	} = createForm({
		initialValues: {
			current_password: '',
			new_password: ''
		},
		validationSchema: Yup.object().shape({
			current_password: Yup.string().min(6).required().label('current password'),
			new_password: Yup.string().min(6).required().label('new password')
		}),
		onSubmit: (values) => {
			const credential = EmailAuthProvider.credential(
				$userProfile.data['email'],
				values.current_password
			);
			return reauthenticateWithCredential(auth.currentUser, credential)
				.then((e) => {
					return updatePassword(auth.currentUser, values.new_password).then(async (e) => {
						console.log(e);
						return auth.currentUser.reload().then((e) => {
							toast.success('changed your password successfully');
							handleReset();
						});
					});
				})
				.catch((e) => {
					console.log(e);
					toast.error(e.message);
				});
		}
	});

	let deletingUser = false;

	const handleDelete = () => {
		const password = prompt('Can you provide your password to confirm your account deletion');
		if (password) {
			deletingUser = true;
			const credential = EmailAuthProvider.credential($userProfile.data['email'], password);
			return reauthenticateWithCredential(auth.currentUser, credential)
				.then((e) => {
					return deleteUser(auth.currentUser)
						.then((e) => {
							deletingUser = false;
							toast.success('Your account was deleted successfully');
							goto('/');
						})
						.catch((e) => {
							deletingUser = false;
							console.log(e);
							toast.error(e.message);
						});
				})
				.catch((e) => {
					console.log(e);
					deletingUser = false;
					toast.error(e.message);
				});
		}
	};

	$: {
		if (browser) {
			if (!authSession?.loggedIn && !authSession?.loading) {
				goto('/login');
			}
		}
	}
</script>

<Seo title="My account" />

<div class="max-w-6xl space-y-8 mx-auto pt-8 pb-12 sm:px-4">
	<div
		class="flex items-start border-b border-slate-300 border-dashed pb-4 justify-start gap-3 flex-col"
	>
		<div
			class="flex items-center sm:flex-col sm:justify-start sm:items-start space-y-3 justify-between w-full"
		>
			<div class="space-y-2">
				<h4 class="font-semibold text-base">Account setting.</h4>
				<p
					class="bg-grey-light text-[14px] leading-7 font-medium- text-slate-600 w-full rounded-md"
				>
					View and manage your account settings like changing your password and your profile.
				</p>
			</div>
			<div class="flex items-center gap-3">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-missing-attribute -->
				<a
					on:click={() => goto(`/profile/${authSession.user.uid}`)}
					class={cn(
						'px-5 py-[8px] cursor-pointer flex items-center gap-2 bg-[#f0b111] rounded-[4px] text-white text-[12px] font-medium-',
						{
							'opacity-60 pointer-events-none': logingOut
						}
					)}
				>
					<UserIcon strokeWidth={2} class="text-white" size={'15'} />
					<span>View Your Profile</span>
				</a>

				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-missing-attribute -->
				<a
					on:click={() => handleLogout()}
					class={cn(
						'px-5 py-[8px] cursor-pointer flex items-center gap-2 bg-slate-200 rounded-[4px] text-slate-600 text-[12.5px] font-medium',
						{
							'opacity-60 pointer-events-none': logingOut
						}
					)}
				>
					{#if logingOut}
						<Loader />
					{:else}
						<Icon icon="tabler:logout" class="text-lg" />
					{/if}
					Logout
				</a>
			</div>
		</div>
	</div>
	<div class="grid border-b border-dashed pb-8 gap-5 pt-0 grid-cols-9 lg:grid-cols-1">
		<div class="col-span-3 space-y-3">
			<h4 class="font-semibold text-base">Personal information</h4>
			<p class="font-medium- text-[14px] sm:line-clamp-2 text-slate-500 leading-7">
				Encompasses individual details such as name, contact information, and other pertinent data
				unique to a person.
			</p>
		</div>
		<div class="col-span-6">
			<div
				class="bg-white overflow-hidden px-5 pt-4 pb-5 space-y-3 relative rounded-md border border-slate-200"
			>
				{#if $userProfile.status === 'success'}
					<form on:submit={handleSubmit} class="space-y-2">
						<div
							class="flex border-b space-y-2 border-b-slate-300 border-dashed pb-4 items-center gap-3"
						>
							<div>
								<input
									on:change={handleFilesSelect}
									bind:this={photoInput}
									type="file"
									class="hidden"
									name=""
									id=""
								/>
								<Avatar
									size="xl"
									src={$userProfile?.data['photo']}
									name={$userProfile?.data['first_name'] + ' ' + $userProfile?.data['last_name'] ||
										'G'}
								/>
							</div>
							<div class="space-y-3">
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<!-- svelte-ignore a11y-missing-attribute -->
								<a
									on:click={() => photoInput.click()}
									class="px-4 w-fit flex gap-3 items-center justify-center py-[8px] cursor-pointer bg-slate-200 rounded-[4px] text-slate-600 text-[12.5px] font-medium"
								>
									{#if uplaodingProfile}
										<Loader />
									{/if}
									<span>Upload photo</span>
								</a>
								<p class="text-[12.5px] font-medium text-slate-500">JPG, GIF or PNG. 1MB max.</p>
							</div>
						</div>

						<div class="grid grid-cols-2 gap-3">
							<Input
								on:keyup={handleChange}
								on:blur={handleBlur}
								error={$errors.first_name && $touched.first_name ? $errors.first_name : ''}
								bind:value={$form.first_name}
								name={'first_name'}
								placeholder="First name"
								label="First name"
							/>
							<Input
								on:keyup={handleChange}
								on:blur={handleBlur}
								bind:value={$form.last_name}
								error={$errors.last_name && $touched.last_name ? $errors.last_name : ''}
								name={'last_name'}
								placeholder="Last name"
								label="Last name"
							/>
						</div>
						<div class="grid grid-cols-2 gap-3">
							<Select
								on:change={handleChange}
								on:blur={handleBlur}
								bind:value={$form.gender}
								error={$errors.gender && $touched.gender ? $errors.gender : ''}
								name="gender"
								options={['male', 'female', 'other'].map((e) => ({ label: e, value: e }))}
								placeholder="Your gender"
								label="Gender"
							/>
							<Input
								on:keyup={handleChange}
								on:blur={handleBlur}
								bind:value={$form.phone}
								error={$errors.phone && $touched.phone ? $errors.phone : ''}
								name={'phone'}
								placeholder="Your phone number"
								label="Phone number"
							/>
						</div>
						<div class="grid grid-cols-1 gap-3">
							<Input
								on:keyup={handleChange}
								on:blur={handleBlur}
								bind:value={$form.address}
								error={$errors.address && $touched.address ? $errors.address : ''}
								name="address"
								placeholder="First your address"
								label="Address"
							/>
						</div>
						<div class="grid mb-4 grid-cols-2 gap-3 lg:grid-cols-2">
							<Select
								on:change={handleChange}
								on:blur={handleBlur}
								bind:value={$form.city}
								error={$errors.city && $touched.city ? $errors.city : ''}
								name="city"
								options={['kigali', 'rubavu', 'rusizi'].map((e) => ({ label: e, value: e }))}
								placeholder="Your city"
								label="city"
							/>
							<Input
								on:keyup={handleChange}
								on:blur={handleBlur}
								bind:value={$form.zip_code}
								name="zip_code"
								error={$errors.zip_code && $touched.zip_code ? $errors.zip_code : ''}
								placeholder="Enter Zip code"
								label="Zip code"
							/>
						</div>
						<div>
							<Textarea
								on:keyup={handleChange}
								on:blur={handleBlur}
								bind:value={$form.bio}
								name="bio"
								rows={3}
								error={$errors.bio && $touched.bio ? $errors.bio : ''}
								placeholder="Enter your bio"
								label="Biography"
							/>
						</div>
						<!-- {JSON.stringify($errors)} -->
						<div>
							<div class="mt-4 flex items-center w-full justify-end">
								<Button
									disabled={!$isValid}
									type="submit"
									loading={$isSubmitting}
									customClass="w-fit">Update my profile</Button
								>
							</div>
						</div>
					</form>
				{/if}
				{#if $userProfile.status === 'pending'}
					<div class="h-[350px] w-full flex justify-center items-center">
						<Loader />
					</div>
				{/if}
				{#if $userProfile.status === 'error'}
					<div class="h-[350px] w-full flex justify-center items-center">
						<p class="text-[14px] text-slate-500 font-medium-">Failed to load your profile</p>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="grid gap-5 pt-0 border-b border-dashed pb-8 grid-cols-9 lg:grid-cols-1">
		<div class="col-span-3 space-y-3">
			<h4 class="font-semibold text-base">Change your password</h4>
			<p class="font-medium- text-[14px] text-slate-500 leading-7">
				Update your password associated with your account.
			</p>
		</div>
		<div class="col-span-6">
			<form
				on:submit={changePasswordHandleSubmit}
				class="bg-white px-5 pt-4 pb-5 space-y-3 rounded-md border border-slate-200"
			>
				<Input
					on:keyup={handlePasswordFormChange}
					on:blur={handlePasswordFormBlur}
					bind:value={$changePasswordForm.current_password}
					name="current_password"
					error={$changePasswordFormErrors.current_password &&
					$changePasswordFormTouched.current_password
						? $changePasswordFormErrors.current_password
						: ''}
					placeholder="Enter Current password"
					label="Current password"
					type="password"
				/>
				<Input
					on:keyup={handlePasswordFormChange}
					on:blur={handlePasswordFormBlur}
					bind:value={$changePasswordForm.new_password}
					name="new_password"
					error={$changePasswordFormErrors.new_password && $changePasswordFormTouched.new_password
						? $changePasswordFormErrors.new_password
						: ''}
					placeholder="New password"
					label="Enter your new passowrd"
					type="password"
				/>
				<div>
					<div class="mt-4 flex items-center w-full justify-end">
						<Button
							disabled={!$changePasswordFormIsValid}
							type="submit"
							loading={$changePasswordFormIsSubmiting}
							customClass="w-fit">Change password</Button
						>
					</div>
				</div>
			</form>
		</div>
	</div>

	<div class="grid gap-5 grid-cols-9 lg:grid-cols-1">
		<div class="col-span-3 space-y-3">
			<h4 class="font-semibold text-base">Delete account</h4>
			<p class="font-medium- text-[14px] text-slate-500 leading-7">
				No longer want to use our service? You can delete your account here.
			</p>
		</div>
		<div class="col-span-6">
			<div class="bg-white px-5 py-4 pb-3 space-y-4 rounded-md border border-slate-200">
				<p class="font-medium text-[13px] text-slate-500 leading-7">
					No longer want to use our service? You can delete your account here. This action is not
					reversible. All information related to this account will be deleted permanently.
				</p>
				<Checkbox label="I am sure i know what iam doing" />
				<div class="flex items-center gap-3 justify-start">
					<Button on:click={handleDelete} loading={deletingUser} customClass="bg-red-500 w-fit"
						>Delete my account</Button
					>
				</div>
			</div>
		</div>
	</div>
</div>
