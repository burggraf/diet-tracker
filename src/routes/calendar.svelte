<script lang="ts">
	import IonPage from '$ionic/svelte/components/IonPage.svelte'
	import { currentUser } from '$services/user.store'
	import { onMount, onDestroy } from 'svelte'
	import { addOutline } from 'ionicons/icons'
	import SupabaseDataService from '$services/supabase.data.service'
	import { goto } from '@roxi/routify'
	import SupabaseUtilityService from '$services/utility.functions.service'
	const utils = SupabaseUtilityService.getInstance()
	const supabaseDataService = SupabaseDataService.getInstance()

	let settings = {
		daily_budget: 0,
		target_weight: 0,
		water_target: 8,
	}
	let days: any[] // = cache || []
	let recordset
	onMount(async () => {})
	onDestroy(() => {})
	const gotoDay = (id: string) => {
		$goto(`/day/[id]`, { id })
	}
	const ionViewDidEnter = async () => {
		// console.log('** ionViewDidEnter')
		if ($currentUser?.user_metadata) {
			settings = $currentUser?.user_metadata
		} else {
			settings = {
				daily_budget: 0,
				target_weight: 0,
				water_target: 8,
			}
		}
		if (!recordset) {
			// console.log('loading subscription here, user', $currentUser)

			recordset = await supabaseDataService.getDataSubscription('days').subscribe((recordset) => {
				if (recordset && recordset.length > 0) {
					days = recordset
				} else {
					// console.log('SKIPPING EMPTY RECORDSET');
				}
				// console.log('*** days', days);
			})
		} else {
			// console.log('*** attempted to re-assign recordset subscription', days);
		}
	}
	const ionViewWillLeave = () => {
		if (recordset) recordset.unsubscribe()
		days = []
	}
	function toggleDatePicker() {
		console.log('** toggleDatePicker');
		const el = document.getElementById('datepicker');
		if (el) {
			el.classList.toggle('hidden');
		}
	}
	const handleDate = async (event) => {
		const theDate = new Date(event.target.value);
		const { data, error } = await supabaseDataService.getDayId(theDate.toISOString().substring(0,10));
		if (data && data.id) {
			gotoDay(data.id);
		} else {
			//console.log('** handleDate', data, error);
			gotoDay(theDate.toISOString().substring(0,10));
		}
		// day.date = event.target.value
	}

</script>

<IonPage {ionViewDidEnter} {ionViewWillLeave}>
	<ion-header translucent="true">
		<ion-toolbar>
			<ion-buttons slot="start">
				<ion-menu-button />
			</ion-buttons>
			<ion-title on:click={toggleDatePicker}>Calendar</ion-title>
			<ion-buttons slot="end">
				<ion-button on:click={() => gotoDay('new')}>
					<ion-icon slot="icon-only" icon={addOutline} />
				</ion-button>
			</ion-buttons>
		</ion-toolbar>
	</ion-header>

	<ion-content class="ion-padding">
		<div class="centered">
			<ion-datetime id="datepicker" class="hidden" on:click={handleDate}></ion-datetime>
		</div>
		<ion-list>
			{#if days && days.length}
				{#each days as day}
					<ion-item
						on:click={() => gotoDay(day.id)}
						class={utils.getToday() === day.date ? 'today' : 'notToday'}
					>
						{#if utils.getToday() === day.date}
							Today
						{:else}
							{new Date(
								new Date(day?.date).getTime() + new Date(day?.date).getTimezoneOffset() * 60000
							).toDateString()}
						{/if}
						<ion-note slot="end" class={utils.getToday() === day.date ? 'today' : 'notToday'}>
							{#if utils.getToday() === day.date && settings?.daily_budget}
								<b>[{settings?.daily_budget - (day?.food_total || 0).toFixed(2)}]&nbsp;&nbsp;</b>
							{/if}
							{(day?.food_total || 0).toFixed(2)}
						</ion-note>
					</ion-item>
				{/each}
			{:else}
				<ion-item> No days found </ion-item>
			{/if}
		</ion-list>
		<!-- currentUser: {$currentUser?.id}<br/>
	settings: {JSON.stringify(settings)}<br/> -->
	</ion-content>
</IonPage>

<style>
	.today {
		font-weight: bold;
	}
	.notToday {
		font-weight: normal;
	}
	.centered {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.hidden {
		display: none;
	}
</style>
