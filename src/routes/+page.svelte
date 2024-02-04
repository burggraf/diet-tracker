<script lang="ts">
	import IonPage from '$ionpage'
	import '$styles/grid-styles.css'
	import * as allIonicIcons from 'ionicons/icons'

	import { currentUser } from '$services/backend.service'
	import { goto } from '$app/navigation'
	// import * as allIonicIcons from 'ionicons/icons';
	import LoginModal from '$components/LoginModal.svelte'
	import { modalController } from '$ionic/svelte'
	// import { page } from '$app/stores';
	import { onMount } from 'svelte'
	import { currentState } from '$services/state.service'
	import { getToday } from '$services/utils.service'
	import { pb } from '$services/backend.service'
	import { calendarNumberOutline, calendarOutline, todayOutline } from 'ionicons/icons'
	//export let providers: Provider[] = [];
	export const providers: string[] = []
	export const onSignIn: Function = () => {}

	const app_version = __APP_VERSION__
	const app_name = __APP_NAME__
	onMount(() => {
		const page = localStorage.getItem('page')
		// remove page from localStorage
		if (page) {
			localStorage.removeItem('page')
			goto(page)
		}
		return () => {}
	})

	const openLoginBox = async () => {
		const openLoginModalController = await modalController.create({
			component: LoginModal,
			componentProps: {
				providers: ['google', 'facebook', 'github'],
				onSignIn: () => {
					goto('/calendar')
				},
			},
			showBackdrop: true,
			backdropDismiss: true,
		})

		await openLoginModalController.present()
	}
	let todaysID = ''
	const ionViewWillEnter = async () => {
		console.log('** ionViewWillEnter')
		if ($currentUser) {
			console.log('** ionViewWillEnter - $currentUser', $currentUser)
			if ($currentUser) {
				const today = getToday()
				try {
					const recordset = await pb
						.collection('days')
						.getFirstListItem(`date~"${today}"`, { fields: 'id' })
					if (recordset) {
						todaysID = recordset.id
					}
				} catch (err) {
					console.log('no entry for today yet')
				}
				// goto('/calendar')
			}
		}
	}
</script>

<IonPage {ionViewWillEnter}>
	<ion-header>
		{#if $currentUser}
			<ion-toolbar color="secondary">
				<ion-buttons slot="start">
					<ion-menu-button />
				</ion-buttons>
				<ion-title>Welcome</ion-title>
			</ion-toolbar>
		{/if}
	</ion-header>
	<ion-content class="ion-padding">
		<div class="safearea width-400">
			{#if $currentUser}
				<div
					class="ion-text-center"
					style="display: flex; align-items: center; justify-content: center; margin-top: -30px; margin-bottom: 0px;"
				>
					<ion-img
						style="height: 65px; width: 65px; margin-right: 10px; margin-top: 0px;"
						src="/icon.svg"
					/>
					<div>
						<h1 style="font-size: 30pt;"><b>Diet Tracker</b></h1>
						<p style="margin-top: -5px;">Track your diet</p>
					</div>
				</div>
				<div class="center">
					Welcome back <b>{$currentUser?.name || $currentUser?.email}</b>
				</div>
				<br />
				<ion-button color="secondary" size="large" expand="block" on:click={() => goto('/calendar')}
					><ion-icon size="large" icon={calendarOutline} />&nbsp;&nbsp;Go to Calendar</ion-button
				><br />
				{#if todaysID !== ''}
					<ion-button color="tertiary" size="large" expand="block" on:click={() => goto(`/day/${todaysID}`)}
						><ion-icon size="large" icon={todayOutline} />&nbsp;&nbsp;Go to Today</ion-button
					><br />
				{:else}
					<ion-button color="tertiary" size="large" expand="block" on:click={() => goto(`/day/new`)}
						><ion-icon size="large" icon={todayOutline} />&nbsp;&nbsp;New Entry (Today)</ion-button
					><br />
				{/if}
			{:else}
				<div
					class="ion-text-center"
					style="display: flex; align-items: center; justify-content: center; margin-top: -30px; margin-bottom: 0px;"
				>
					<ion-img
						style="height: 65px; width: 65px; margin-right: 10px; margin-top: 0px;"
						src="/icon.svg"
					/>
					<div>
						<h1 style="font-size: 30pt;"><b>Diet Tracker</b></h1>
						<p style="margin-top: -5px;">Track your diet</p>
					</div>
				</div>
			{/if}
		</div>
		{#if !$currentUser}
			<div class="width-400">
				<ion-button expand="block" on:click={openLoginBox}>Get Started</ion-button>
			</div>
		{/if}
		<!-- <div class="flex-container">
			<h1>Diet Tracker</h1>
		</div> -->
	</ion-content>
	<ion-footer>
		{#if !$currentUser}
			<ion-toolbar color="transparent" class="ion-text-center">
				<b>{app_name} {app_version}</b><br />
				<span
					on:click={() => {
						goto('/terms')
					}}
					class="pointer">Terms of Service</span
				>
				<span>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</span>
				<span
					on:click={() => {
						goto('/privacy')
					}}
					class="pointer">Privacy</span
				>
				<span>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</span>
				<span
					on:click={() => {
						goto('/support')
					}}
					class="pointer">Support</span
				>
			</ion-toolbar>
		{/if}
	</ion-footer>
</IonPage>

<style>
	.safearea {
		--ion-safe-area-top: 60px;
		--safe-area-inset-top: 60px;
	}
	.padded {
		padding-left: 5px;
		padding-right: 5px;
	}
	.center {
		text-align: center;
		font-size: 1.2em;
	}
	.width-400 {
		text-align: center;
		max-width: 400px;
		margin: auto;
	}
	h3 {
		text-align: center;
	}

	.flex-item-no-border {
		max-width: 400px;
		width: 400px;
		cursor: pointer;
	}
	.flex-item {
		max-width: 400px;
		width: 400px;
		/* border: 1pt solid; */
		cursor: pointer;
		margin: 10px;
		padding-top: 0px;
		padding-bottom: 10px;
		padding-left: 20px;
		padding-right: 20px;
	}
	.primary {
		color: var(--ion-color-primary-contrast);
		background-color: var(--ion-color-primary);
	}
	.secondary {
		color: var(--ion-color-secondary-contrast);
		background-color: var(--ion-color-secondary);
	}
	.tertiary {
		color: var(--ion-color-tertiary-contrast);
		background-color: var(--ion-color-tertiary);
	}

	.flex-container {
		display: flex;
		display: -webkit-flex;
		display: -moz-flex;
		flex-flow: row nwrap;
		-webkit-flex-flow: row wrap;
		-moz-flex-flow: row wrap;
		justify-content: center;
		align-items: center;
	}
	.pointer {
		cursor: pointer;
	}
	.landing-property {
		width: 300px;
		max-width: 300px;
		margin: 10px;
		cursor: pointer;
		text-align: center;
	}
</style>
