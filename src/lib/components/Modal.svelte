<script lang="ts">
	import CloseButton from './CloseButton.svelte';
	import Overlay from './Overlay.svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let size = 'lg';
	export let open: boolean = false;
	export let title: string = '';
	export let showDividers: boolean = false;
	export let close: any = null;
	export let noFooter: boolean = false;

	$: sizeClass = {
		xs: 'max-w-[320px]',
		sm: 'max-w-[380px]',
		md: 'max-w-[520px]',
		lg: 'max-w-[620px]',
		xl: 'max-w-[780px]'
	}[size];

	const handleClose = () => {
		close();
	};
</script>

{#if open}
	<div class="fixed z-[51] top-0 inset-0 overflow-y-hidden">
		<div
			class="flex items-start mx-3 justify-center overflow-hidden min-h-screen pt-4 px-4 pb-20 text-center sm:block- sm:p-0"
		>
			<Overlay fade click={handleClose} blur />
			<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
				>&#8203;</span
			>

			<div
				transition:fly={{
					delay: 0,
					duration: 300,
					x: 0,
					y: 100,
					opacity: 0,
					easing: quintOut
				}}
				class="bg-white relative inline-block rounded-[4px] shadow-xl transform transition-all my-8 align-middle w-full
                  {sizeClass}
                "
			>
				<slot name="header">
					{#if title}
						<div
							class="{showDividers ? 'border-b px-4  py-[6px]' : 'px-5  py-3'}
                         rounded-t-md border-slate-100
                      "
						>
							<div class="flex justify-between items-center">
								<h4 class="font-semibold text-[13px] text-slate-800">
									{title}
								</h4>
								<CloseButton click={() => handleClose()} />
							</div>
						</div>
					{/if}
				</slot>

				<div class="px-4 py-2 overflow-y-auto max-h-[70vh]" id="modalDescription">
					<slot name="body">
						<div
							class="h-[100px] w-full flex text-sm capitalize font-medium text-slate-400 justify-center items-center"
						>
							this is the body
						</div>
					</slot>
				</div>

				{#if !noFooter}
					<div
						class="
                    {showDividers ? 'border-t ' : ''}
                    px-4 py-2 border-slate-200
                  "
					>
						<slot name="footer" />
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
