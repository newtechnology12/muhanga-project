<script lang="ts">
	import Icon from '@iconify/svelte';
	let items = [
		{
			icon: 'fe:check',
			text1: 'Verification',
			text2: 'Free Shipping for orders over $200'
		},
		{
			icon: 'healthicons:money-bag-outline',
			text1: 'Money Guarantee',
			text2: 'Within 30 days for an exchange.'
		},

		{
			icon: 'streamline:interface-help-customer-support-1-customer-headset-help-microphone-phone-support',
			text1: 'Online Support',
			text2: 'Within 30 days for an exchange.'
		},
		{
			icon: 'fluent:payment-28-regular',
			text1: 'Flexible Payment',
			text2: '24 hours a day, 7 days a week'
		}
	];
</script>

<section class="px-5 lg:px-3">
	<div
		class="mx-auto max-w-7xl flex justify-between py-8 px-5 border mt-3 lg:flex-col lg:space-y-10"
	>
		{#each items as { icon, text1, text2 }}
			<div class="flex items-center gap-2">
				<Icon {icon} class="text-4xl text-[#f0b111]" />
				<div>
					<p class="text-sm font-bold">{text1}</p>
					<p class="text-xs text-gray-500 mt-1">{text2}</p>
				</div>
			</div>
		{/each}
	</div>
</section>
