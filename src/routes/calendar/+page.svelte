<script lang="ts">
	import IonPage from '$ionic/svelte/components/IonPage.svelte'
	import { currentUser, pb } from '$services/backend.service'
	import { onMount, onDestroy } from 'svelte'
	import { addOutline, calendarClear, calendarOutline } from 'ionicons/icons'
	import { goto } from '$app/navigation'
    import { getToday } from '$services/utils.service'
	let settings = {
		daily_budget: 0,
		target_weight: 0,
		water_target: 8,
	}
	let days: any[] // = cache || []
	let recordset: any
	onMount(async () => {})
	onDestroy(() => {})
	const gotoDay = (id: string) => {
		goto(`/day/${id}`)
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

            const recordset = await pb.collection('days').getList(1, 365, {
                sort: '-date',
            });
            if (recordset) {
                days = recordset.items;
            } else {
                // console.log('*** attempted to re-assign recordset subscription', days);
            }
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
	const handleDate = async (event: any) => {
		console.log('** handleDate', event);
		console.log('** handleDate', event.target.value);
		const theDate = event.target.value.substring(0,10);
		try {
			const record = await pb.collection('days').getFirstListItem(
				`date~"${theDate}"`, {
					fields: 'id'
			});
			if (record?.id) {
				gotoDay(record.id);
			}

		} catch (err) {
			console.log('date not found', theDate)
			console.log('we\'ll create a new day')
			const data = {
				user_id: $currentUser?.id || null,
				date: theDate,
				food_log: { entries: [] },
				food_total: 0,
				activity_log: { entries: [] },
				water_log: { entries: [] },
				water_total: 0,
				weight: 0,
				notes: '',
			}
			const record = await pb.collection('days').create(data);
			if (record?.id) {
				gotoDay(record.id);
			}
		}


		// const theDate = new Date(event.target.value).toLocaleDateString().substring;
		// const { data, error } = await supabaseDataService.getDayId(theDate);
		// if (data && data.id) {
		// 	gotoDay(data.id);
		// } else {
		// 	//console.log('** handleDate', data, error);
		// 	gotoDay(theDate.toISOString().substring(0,10));
		// }
	}

</script>

<IonPage {ionViewDidEnter} {ionViewWillLeave}>
	<ion-header translucent={true}>
		<ion-toolbar>
			<ion-buttons slot="start">
				<ion-menu-button />
			</ion-buttons>
			<ion-title on:click={toggleDatePicker}><ion-icon icon={calendarOutline} />&nbsp;Calendar</ion-title>
			<ion-buttons slot="end">
				<ion-button on:click={() => gotoDay('new')}>
					<ion-icon slot="icon-only" icon={addOutline} />
				</ion-button>
			</ion-buttons>
		</ion-toolbar>
	</ion-header>

	<ion-content class="ion-padding">
		<div class="centered">
			<ion-datetime 
				show-default-buttons={true}
				presentation="date" 
				id="datepicker" 
				class="hidden" 
				on:ionCancel={toggleDatePicker}
				on:ionChange={handleDate}
				></ion-datetime>
			<!-- <br/><ion-button size="small" on:click={toggleDatePicker}>Select Date</ion-button> -->
		</div>
		<ion-list>
			{#if days && days.length}
				{#each days as day}
					<ion-item
						on:click={() => gotoDay(day.id)}
						class={getToday() === day.date ? 'today' : 'notToday'}
					>
						{#if getToday() === day.date}
							Today
						{:else}
							{new Date(
								new Date(day?.date).getTime() + new Date(day?.date).getTimezoneOffset() * 60000
							).toDateString()}
						{/if}
						<ion-note slot="end" class={getToday() === day.date ? 'today' : 'notToday'}>
							{#if getToday() === day.date && settings?.daily_budget}
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
