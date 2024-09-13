<script lang="ts">
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/form/Button.svelte';
	import Input from '$lib/components/form/Input.svelte';
	import Textarea from '$lib/components/form/Textarea.svelte';
	import Icon from '@iconify/svelte';
	import Dropzone from 'svelte-file-dropzone/Dropzone.svelte';
	import { createForm } from 'svelte-forms-lib';
	import * as Yup from 'yup';
	import { cn } from '../../utils/cn';
	import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
	import { firestore, storage } from '../../config/firebase';
	import { authStore } from '../../stores/auth';
	import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import Select from '$lib/components/form/Select.svelte';
	import categories from '../../data/categories';
	import slugify from '../../utils/slugify';

	$: authSession = $authStore;

	export let advert = undefined;

	const handleUpload = (e) => {
		if (typeof e === 'string') return e;
		const photoRef = ref(storage, `users/${authSession.user.uid}/adverts/${e.file.name}`);
		return uploadBytes(photoRef, e.file).then(async (snapshot) => {
			const url = await getDownloadURL(snapshot.ref);
			return url;
		});
	};

	function handleFilesSelect(e) {
		const { acceptedFiles } = e.detail;

		updateField('images', [
			...$form.images,
			...acceptedFiles.map((e) => {
				const preview = URL.createObjectURL(e);
				console.log(e.size);
				return {
					file: e,
					name: e.name,
					size: e.size,
					preview
				};
			})
		]);
	}

	const getInitialValues = (data?: any) => {
		return {
			name: data?.name || '',
			category: data?.category || undefined,
			sub_category: data?.sub_category || undefined,
			price: data?.price || '',
			city: data?.city || '',
			neighborhood: data?.neighborhood || '',
			description: data?.description || '',
			images: data?.images || [],
			specifications: data?.specifications
				? data?.specifications
				: [{ key: undefined, value: undefined }],
			location: data?.location || undefined
		};
	};

	console.log(getInitialValues(advert));

	const {
		errors,
		touched,
		isValid,
		updateField,
		isSubmitting,
		// @ts-ignore
		handleBlur,
		handleChange,
		handleSubmit,
		handleReset,
		form
	} = createForm({
		initialValues: advert ? getInitialValues(advert) : getInitialValues(),
		validationSchema: Yup.object().shape({
			name: Yup.string().required(),
			category: Yup.string().required(),
			sub_category: Yup.string().required(),
			price: Yup.string().required(),
			// location: Yup.object(),
			city: Yup.string().required(),
			neighborhood: Yup.string().required(),
			description: Yup.string().required(),
			// images: Yup.lazy((val) => (Array.isArray(val) ? Yup.array().of(Yup.string()) : Yup.string())),
			specifications: Yup.array().of(
				Yup.object().shape({
					key: Yup.string().label('key'),
					value: Yup.string().label('value')
				})
			)
		}),
		onSubmit: async (values) => {
			if (!aggree) return alert('You need to first agree terms and condition');
			try {
				const images = await Promise.all(values?.images?.map((e) => handleUpload(e)));
				const sellerSnapshot = await getDoc(doc(firestore, 'users', $authStore.user.uid));
				const { first_name, last_name, photo, phone, address, createdAt } = sellerSnapshot.data();
				const q = advert
					? updateDoc(doc(firestore, 'adverts', advert?.id), {
							...values,
							// category: slugify(values.category),
							category: 'vehicles',
							slug: slugify(values.name),
							images,
							updatedAt: serverTimestamp()
					  })
					: addDoc(collection(firestore, 'adverts'), {
							...values,
							slug: slugify(values.name),
							images,
							createdAt: serverTimestamp(),
							// category: slugify(values.category),
							category: 'vehicles',
							updatedAt: serverTimestamp(),
							author: {
								id: $authStore.user.uid,
								first_name,
								last_name,
								photo: photo || '',
								phone,
								address: address || '',
								createdAt: createdAt || serverTimestamp()
							}
					  });
				return q
					.then((e) => {
						toast.success(
							advert ? 'Advert was updated succesffuly' : 'Advert was created succesffuly'
						);
						goto(`/adverts/${e?.id || advert.id}`);
					})
					.catch((e) => {
						console.log(e);
						toast.error(e.messsage);
					});
			} catch (error) {
				console.log(error);
				toast.error(error.messsage);
			}
		}
	});

	$: activeSubCategories = $form.category
		? categories.find((e) => e.slug === $form.category)?.subcategories || []
		: [];

	let aggree = false;
</script>

<Seo title="Update your advert" />

<section class="px-5 sm:pb-12 lg:px-3">
	<form on:submit={handleSubmit} class="max-w-6xl space-y-8 mx-auto py-8">
		<div class="flex items-start border-b pb-3 justify-start gap-3 flex-col sm:px-1 lg:px-4">
			<h4 class="font-semibold text-base">
				{advert ? 'Update advert Information.' : 'Post a new advert.'}
			</h4>
			<nav class="bg-grey-light text-[13px] font-normal text-slate-600 w-full rounded-md">
				<ol class="list-reset items-center flex gap-2">
					<li>
						<a href="/" class="text-primary text-primary-600">Home</a>
					</li>
					<li>
						<Icon icon="fluent:chevron-right-12-filled" class=" text-neutral-500" />
					</li>
					<li>
						<a
							href="#"
							class="text-slate-400 capitalize hover:text-primary-600 focus:text-primary-600"
						>
							{advert ? 'Update advert.' : 'create new advert.'}
						</a>
					</li>
				</ol>
			</nav>
		</div>
		<div class="grid gap-5 pt-0 grid-cols-9 lg:grid-cols-1">
			<div class="col-span-3 space-y-3 sm:px-1 lg:px-4">
				<h4 class="font-semibold text-base">1. Advert information</h4>
				<p class="font-normal text-[13px] text-slate-500 leading-7">
					Advert Information" provides a concise overview of key details, specifications, and
					content related to a particular advertisement.
				</p>
			</div>
			<div class="col-span-6">
				<div class="bg-white px-5 py-3 pb-5 space-y-3 rounded-md border border-slate-200">
					<div>
						<Input
							on:keyup={handleChange}
							on:blur={handleBlur}
							bind:value={$form.name}
							error={$errors.name && $touched.name ? $errors.name : ''}
							name="name"
							placeholder="Enter advert name"
							label="Advert name"
						/>
					</div>
					<div class="grid grid-cols-2 gap-3">
						<Select
							on:change={handleChange}
							on:blur={handleBlur}
							bind:value={$form.category}
							error={$errors.category && $touched.category ? $errors.category : ''}
							options={categories.map((e) => ({ label: e.text, value: e.slug }))}
							name="category"
							placeholder="Choose category"
							label="Advert category"
						/>
						<Select
							on:keyup={handleChange}
							on:blur={handleBlur}
							bind:value={$form.sub_category}
							error={$errors.sub_category && $touched.sub_category ? $errors.sub_category : ''}
							options={activeSubCategories.map((e) => ({ label: e.text, value: e.slug }))}
							name="sub_category"
							placeholder="Choose sub category"
							label="Choose sub category"
						/>
					</div>
					<div class="grid grid-cols-3 gap-3 lg:grid-cols-2">
						<Input
							on:keyup={handleChange}
							on:blur={handleBlur}
							bind:value={$form.price}
							error={$errors.price && $touched.price ? $errors.price : ''}
							name="price"
							placeholder="Advert price"
							label="Advert price(FRW)"
							type="number"
						/>
						<Input
							on:keyup={handleChange}
							on:blur={handleBlur}
							bind:value={$form.city}
							error={$errors.city && $touched.city ? $errors.city : ''}
							name="city"
							placeholder="Choose a city"
							label="Choose city"
						/>
						<Input
							on:keyup={handleChange}
							on:blur={handleBlur}
							bind:value={$form.neighborhood}
							error={$errors.neighborhood && $touched.neighborhood ? $errors.neighborhood : ''}
							name="neighborhood"
							placeholder="Choose Neighborhood"
							label="Choose Neighborhood"
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="grid gap-5 grid-cols-9 lg:grid-cols-1 sm:px-1 lg:px-4">
			<div class="col-span-3 space-y-3">
				<h4 class="font-semibold text-base">2. Advert Description</h4>
				<p class="font-normal text-[13px] text-slate-500 leading-7">
					offers a detailed narrative that articulates the nuances, features, and compelling aspects
					of a specific advertisement.
				</p>
			</div>
			<div class="col-span-6">
				<div class="bg-white px-5 py-3 pb-5 space-y-3 rounded-md border border-slate-200">
					<Textarea
						rows={6}
						on:keyup={handleChange}
						on:blur={handleBlur}
						bind:value={$form.description}
						error={$errors.description && $touched.description ? $errors.description : ''}
						name="description"
						label="Description"
						placeholder="Enter Description"
					/>
				</div>
			</div>
		</div>

		<div class="grid gap-5 grid-cols-9 lg:grid-cols-1 sm:px-1 lg:px-4">
			<div class="col-span-3 space-y-3">
				<h4 class="font-semibold text-base">3. Advert gallery</h4>
				<p class="font-normal text-[13px] text-slate-500 leading-7">
					showcases a visual compilation of diverse advertisements, presenting a dynamic and
					engaging collection of promotional materials. T
				</p>
			</div>
			<div class="col-span-6">
				<div class={cn('bg-white px-5 py-5 space-y-3 rounded-md border border-slate-200')}>
					<Dropzone
						containerClasses="rounded-md"
						inputElement={undefined}
						accept="image/*"
						on:drop={handleFilesSelect}
					>
						<div class="flex items-center py-4 flex-col justify-center gap-3">
							<Icon class="text-2xl text-slate-500" icon="octicon:image-16" />
							<p class="font-normal max-w-xs text-center text-[13px] text-slate-500 leading-7">
								Drag and drop your images here Or click to select your images manually
							</p>
						</div>
					</Dropzone>
					<span class="text-[12px] font-normal text-red-500 mt-2 block"
						>{$errors?.images && $touched?.images ? $errors?.images : ''}</span
					>
					{#if $form?.images?.length}
						<ol class="grid grid-cols-5 gap-4 lg:grid-cols-1 lg:px-4">
							{#each $form?.images as item, index}
								<li>
									<div class="relative border border-slate-200 rounded-[4px] h-24 p-1-">
										<img class="h-full w-full object-cover" src={item?.preview || item} alt="" />
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<!-- svelte-ignore a11y-no-static-element-interactions -->
										<!-- svelte-ignore a11y-missing-attribute -->
										<a
											on:click={() => {
												$form.images = $form.images.filter((_, i) => i !== index);
											}}
											class="cursor-pointer bg-red-500 text-white h-8 w-8 rounded-full flex items-center justify-center absolute top-2 right-2"
										>
											<Icon icon="octicon:trash-16" class="text-base stroke-[3]" />
										</a>
									</div>
								</li>
							{/each}
						</ol>
					{/if}
				</div>
			</div>
		</div>

		<div class="grid gap-5 grid-cols-9 lg:grid-cols-1 sm:px-1 lg:px-4">
			<div class="col-span-3 space-y-3">
				<h4 class="font-semibold text-base">4. Advert specifications</h4>
				<p class="font-normal text-[13px] text-slate-500 leading-7">
					Provides a clear and organized breakdown of the technical details, requirements, and
					parameters associated with a particular advertisement.
				</p>
			</div>
			<div class="col-span-6">
				<div class="bg-white px-5 py-4 pb-3 space-y-3 rounded-md border border-slate-200">
					{#each $form.specifications as specification, index}
						<div class="grid gap-3 grid-cols-6">
							<div class="col-span-2 lg:col-span-3">
								<Select
									on:change={handleChange}
									on:blur={handleChange}
									bind:value={$form.specifications[index].key}
									name={`specifications[${index}].key`}
									error={$errors.specifications[index] && $touched.specifications[index]
										? $errors.specifications[index]['key'] || ''
										: ''}
									placeholder="Choose specification"
									options={[
										{ label: 'Color', value: 'color' },
										{ label: 'Make', value: 'make' },
										{ label: 'Model', value: 'model' },
										{ label: 'Year', value: 'year' },
										{ label: 'Engine Type', value: 'engineType' },
										{ label: 'Transmission', value: 'transmission' },
										{ label: 'Fuel Type', value: 'fuelType' },
										{ label: 'Mileage', value: 'mileage' },
										{ label: 'Body Type', value: 'bodyType' },
										{ label: 'Number of Doors', value: 'numberOfDoors' },
										{ label: 'Number of Seats', value: 'numberOfSeats' },
										{ label: 'Drive Type', value: 'driveType' },
										{ label: 'VIN (Vehicle Identification Number)', value: 'vin' },
										{ label: 'Price', value: 'price' },
										{ label: 'Acceleration (0-60 mph)', value: 'acceleration' },
										{ label: 'Top Speed', value: 'topSpeed' },
										{ label: 'Fuel Efficiency (MPG)', value: 'fuelEfficiency' },
										{ label: 'Curb Weight', value: 'curbWeight' },
										{ label: 'Cargo Space', value: 'cargoSpace' },
										{ label: 'Warranty', value: 'warranty' },
										{ label: 'Safety Features', value: 'safetyFeatures' },
										{ label: 'Entertainment System', value: 'entertainmentSystem' },
										{ label: 'Navigation System', value: 'navigationSystem' },
										{ label: 'Bluetooth Connectivity', value: 'bluetoothConnectivity' },
										{ label: 'USB Ports', value: 'usbPorts' },
										{ label: 'Sunroof', value: 'sunroof' },
										{ label: 'Interior Material', value: 'interiorMaterial' },
										{ label: 'Exterior Features', value: 'exteriorFeatures' },
										{ label: 'Wheels', value: 'wheels' },
										{ label: 'Tires', value: 'tires' },
										{ label: 'Suspension', value: 'suspension' },
										{ label: 'Brakes', value: 'brakes' },
										{ label: 'Steering', value: 'steering' },
										{ label: 'Dimensions', value: 'dimensions' },
										{ label: 'Ground Clearance', value: 'groundClearance' },
										{ label: 'Turning Circle', value: 'turningCircle' },
										{ label: 'Towing Capacity', value: 'towingCapacity' },
										{ label: 'Payload Capacity', value: 'payloadCapacity' },
										{ label: 'Seating Material', value: 'seatingMaterial' },
										{ label: 'Interior Features', value: 'interiorFeatures' },
										{ label: 'Exterior Color Options', value: 'exteriorColorOptions' },
										{ label: 'Interior Color Options', value: 'interiorColorOptions' },
										{ label: 'Trim Levels', value: 'trimLevels' },
										{ label: 'Optional Packages', value: 'optionalPackages' }
									]}
								/>
							</div>
							<div class="col-span-4 flex gap-2 items-center w-full lg:col-span-3">
								<div class="w-full">
									<Input
										on:change={handleChange}
										on:blur={handleChange}
										bind:value={$form.specifications[index].value}
										placeholder="Enter value"
										name={`specifications[${index}].value`}
										error={$errors.specifications[index] && $touched.specifications[index]
											? $errors.specifications[index]['value'] || ''
											: ''}
									/>
								</div>
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<!-- svelte-ignore a11y-missing-attribute -->
								{#if $form.specifications.length > 1}
									<a
										on:click={() => {
											updateField(
												'specifications',
												$form.specifications.filter((e, i) => i !== index)
											);
										}}
										class="h-8 w-8 rounded-[4px] cursor-pointer flex items-center text-red-500 justify-center hover:bg-slate-100"
									>
										<Icon class="text-sm" icon="octicon:trash-16" />
									</a>
								{/if}
							</div>
						</div>
					{/each}
					<div>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<!-- svelte-ignore a11y-missing-attribute -->
						<a
							on:click={() => {
								updateField('specifications', [
									...$form.specifications,
									{
										key: undefined,
										value: undefined
									}
								]);
							}}
							class="flex px-2 py-2 cursor-pointer text-[#f0b111] hover:underline items-center gap-3"
						>
							<Icon icon="humbleicons:plus-circle" />
							<span class="text-[13px] font-normal"> Add another </span>
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- <div class="grid gap-5 grid-cols-9 lg:grid-cols-1 sm:px-1 lg:px-4">
			<div class="col-span-3 space-y-3">
				<h4 class="font-semibold text-base">2. Advert Location</h4>
				<p class="font-normal text-[13px] text-slate-500 leading-7">
					Choose a location that your product is located at to allow clients to get them very
					easily.
				</p>
			</div>
			<div class="col-span-6">
				<div class="bg-white px-3 py-3 pb-5 space-y-3 rounded-md border border-slate-200">
					<div
						class="h-[300px] w-full border bg-slate-50 rounded-[4px] border-slate-200 overflow-hidden"
					>
						<Map
							cords={$form.location}
							globally
							onSelect={(e) => {
								updateField('location', e);
							}}
							on:load={() => {
								console.log('MAP SAYS IM LOADED');
							}}
						/>
					</div>
					{#if $form.location}
						<div
							class="border flex justify-between border-slate-200 rounded-[3px] px-3 py-2 my-3 bg-slate-50 text-left text-[13px] underline"
						>
							<a
								target="_blank"
								href={`http://www.google.com/maps/place/${$form.location?.lat},${$form.location?.lng}`}
							>
								{`http://www.google.com/maps/place/${$form.location?.lat},${$form.location?.lng}`}
							</a>
							<a
								class="text-red-500 font-normal text-[12px] cursor-pointer"
								on:click={() => updateField('location', null)}>Remove</a
							>
						</div>
					{/if}
				</div>
			</div>
		</div> -->

		<div class="grid gap-5 grid-cols-9 lg:grid-cols-1 sm:px-1 lg:px-4">
			<div class="col-span-3 space-y-3">
				<h4 class="font-semibold text-base">5. Save advert</h4>
				<p class="font-normal text-[13px] text-slate-500 leading-7">
					After submitting your ad, it undergoes a brief review before appearing. Thanks for
					choosing our platform; your ad will be visible soon!
				</p>
			</div>
			<div class="col-span-6">
				<div class="bg-white px-5 py-4 pb-3 space-y-4 rounded-md border border-slate-200">
					<p class="font-normal text-[13px] text-slate-500 leading-7">
						After submitting your ad, it undergoes a brief review to meet our guidelines. Your ad
						will be visible to potential buyers shortly. Thank you for choosing our platform!
					</p>
					<Checkbox
						checked={aggree}
						on:change={() => (aggree = !aggree)}
						label="I agree terms and conditions"
					/>
					<div class="flex items-center gap-3 justify-end lg:justify-start">
						<Button
							on:click={() => {
								handleReset();
							}}
							customClass="bg-red-500 w-fit">Reset</Button
						>
						<Button loading={$isSubmitting} disabled={!$isValid} type="submit" customClass="w-fit"
							>Save advert</Button
						>
					</div>
				</div>
			</div>
		</div>
	</form>
</section>
