<script lang="ts">
	import { modalController } from '$ionic/svelte'
	import { onMount } from 'svelte'

	import food from '$services/food.json'

	import { closeOutline } from 'ionicons/icons'
	import { search_internet, search_food_log } from './FoodSearchModal'
	import { loadingBox } from '$services/loadingMessage'
	import { toast } from '$services/toast'

	let mode = 'database'
	let debounce_value = 500
	let last_search = ''

	const closeOverlay = () => {
		modalController.dismiss({ data: null })
	}
	let filteredFood: any = []

	function save(item: any) {
		modalController.dismiss({ data: item })
	}
	async function search($event: any) {
		let s = $event.target.value.trim().toLowerCase()
		complete_search(s)
	}
	async function complete_search(s: string) {
		console.log('complete_search', s)
		switch (mode) {
			case 'database':
				if (s != '') {
					filteredFood = food.filter((item) => {
						return item.title.toLowerCase().indexOf(s) > -1
					})
				} else {
					filteredFood = []
				}
				break
			case 'history':
				if (s === last_search) {
					console.log('search value not changed, aborting')
					return
				}
				if (s != '') {
					s = s.toLowerCase().trim();
					console.log('*** SEARCH HISTORY ***')
					const { data, error } = await search_food_log(s)
					if (error) {
						console.error(error)
						toast(error, 'danger')
					} else {
						const items: any = []
						for (let i = 0; i < data.length; i++) {
							const entries = data[i].food_log.entries;
							for (let j = 0; j < entries.length; j++) {
								const entry = entries[j];
								if (entry.title.toLowerCase().indexOf(s) > -1 ||
									entry.desc.toLowerCase().indexOf(s) > -1) {
									items.push({
										title: entry.title,
										desc: entry.desc,
										calories: entry.cps
									})
								}
							}
						}
						console.log('items', items)
						if (items.length === 0) {
							items.push({
										title: 'Not found',
										desc: '',
										calories: ''
									})
						}
						console.log('items', items)
						filteredFood = items
					}
					console.log('data', data)
					console.log('error', error)
				} else {
					filteredFood = []
				}
				last_search = s
				break
			case 'internet':
				try {
					console.log('internet search', s)
					if (s.trim() != '') {
						console.log('filtered food length', filteredFood.length)
						const loader = await loadingBox('Searching internet...')
						const { data, error } = await search_internet(s)
						loader.dismiss()
						if (error) {
							console.error('internet search ERROR', error)
						} else {						
							filteredFood = data
						}
						console.log('data', data)
						console.log('error', error)
					} else {
						filteredFood = []
					}
				} catch (err) {
					console.error('internet search ERROR block', err)
				}
				break
		}
		// console.log('filteredFood', filteredFood)
	}
	onMount(() => {
		setTimeout(() => {
			const toolbar = document.getElementById('toolbar')
			const thelist = document.getElementById('thelist')
			thelist.style.height =
				(thelist.parentElement.parentElement.parentElement.clientHeight -
				(toolbar.clientHeight * 2) -
				20 - 32) +
				// 52 +
				'px'
			;(document.getElementById('searchbar') as any).setFocus().then((result) => {
				document.getElementById('searchbar').click()
			})
		}, 1000)
	})
	function blurFunction(e) {
		const toolbar = document.getElementById('toolbar')
		const thelist = document.getElementById('thelist')
		thelist.style.height =
			(thelist.parentElement.parentElement.parentElement.clientHeight -
			(toolbar.clientHeight * 2) -
			20 - 32) +
			// 52 +
			'px'
	}
	function handleSegmentChange(e) {
		mode = e.detail.value
		switch (mode) {
			case 'database':
				debounce_value = 500
				break
			case 'history':
				debounce_value = 1000
				break
			case 'internet':
				debounce_value = 1000
				break
		}
		;(document.getElementById('searchbar') as any).getInputElement().then((input) => {
			complete_search(input.value)
		})
	}
</script>

<svelte:head>
	<title>FoodSearchModal</title>
</svelte:head>
<ion-header translucent={true}>
	<ion-toolbar id="toolbar">
		<ion-title>Food Search</ion-title>
		<ion-buttons slot="start">
			<ion-icon
				on:click={closeOverlay}
				icon={closeOutline}
				slot="start"
				size="large"
				color="primary"
			/>
		</ion-buttons>

		<ion-buttons slot="end" />
	</ion-toolbar>
</ion-header>
<!-- <ion-content> -->
<div id="container" style="height: 100%">
	<ion-searchbar
		id="searchbar"
		placeholder="Search"
		debounce={debounce_value}
		on:ionBlur={blurFunction}
		on:ionChange={search}
	/>
	<div class="segment">
		<ion-segment value={mode} on:ionChange={handleSegmentChange}>
			<ion-segment-button value="database">
				<ion-label>database</ion-label>
			</ion-segment-button>
			<ion-segment-button value="history">
				<ion-label>history</ion-label>
			</ion-segment-button>
			<ion-segment-button value="internet">
				<ion-label>internet</ion-label>
			</ion-segment-button>
		</ion-segment>
	</div>
	<ion-list id="thelist" style="overflow-y: scroll !important; height: 500px;">
		{#each filteredFood as item}
			<ion-item
				on:click={() => {
					save(item)
				}}
			>
				<ion-text>
					<p style="overflow: visible;">{item.title}</p>
				</ion-text>
				<!-- <ion-note slot="end">{item.calories}</ion-note> -->
				<ion-label slot="end">
					<h2 style="text-align: right;">{item.calories}</h2>
					<p style="text-align: right;">{item.desc}</p>
				</ion-label>
			</ion-item>
		{/each}
	</ion-list>
</div>

<!-- </ion-content> -->
<style>
	.segment {
		margin-left: 12px;
		margin-right: 12px;
	}
	input:-webkit-autofill {
		-webkit-text-fill-color: var(--ion-color-FORCEDARK);
		font-weight: 500px;
	}

	input:-webkit-autofill:focus {
		-webkit-text-fill-color: var(--ion-color-FORCEDARK);
		font-weight: 500px;
	}
</style>
