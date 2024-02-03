<script lang="ts">
    import IonPage from '$ionpage'
	import moment from 'moment'
	import Chart from 'chart.js/auto'
    import { currentUser, pb } from '$services/backend.service'
	const formatDate = (timestamp: number) => moment(timestamp * 1000).format('MM/DD HH:mm')
	const formatDateWithoutTime = (timestamp: number) => moment(timestamp * 1000).format('MM/DD')
	const createChart = (
		chartType: string,
		description: string,
		labels: string[],
		datasets: any[],
		autoAdjust: boolean = true,
		chartStyle: any = 'line'
	) => {
		const canvasId = `${chartType}Chart`
		const existingChart = Chart.getChart(canvasId)
		if (existingChart) {
			existingChart.destroy()
		}

		const ctx: any = document.getElementById(canvasId)
		new Chart(ctx, {
			type: chartStyle,
			data: {
				labels: labels,
				datasets: datasets,
			},
			options: {
				scales: {
					x: {
						ticks: {
							maxRotation: 90,
							minRotation: 90,
						},
					},
					y: {
						beginAtZero: false,
					},
				},
			},
		})
	}

	const createCharts = async () => {
        let days: any[] = []
        let weights: number[] = []
        let calorieTotals: number[] = []
        let waterTotals: number[] = []
        let activityTotals: number[] = []
        let labels: string[] = []        
        try {
            const results = await pb.collection('days').getList(1, 50, {
                // filter: ``,
                sort: '-date',
            });
            days = results.items.reverse();
            console.log('days', days)
        } catch (err) {
            console.error('Error getting days', err)
            return;
        }
        days.forEach((day: any) => {
            if (day.weight > 0) weights.push(day.weight)
            if (day.food_total > 0) calorieTotals.push(day.food_total)
            if (day.water_total > 0) waterTotals.push(day.water_total)
            if (day.activity_total > 0) activityTotals.push(day.activity_total)
            labels.push(day.date.substring(5,10) + '-' + day.date.substring(0,4));    
        })
        console.log("labels", labels)
        createChart('weight', 'Weight', labels, [
			{
				label: 'Weight',
				data: weights,
				borderWidth: 1,
				tension: 0.3,
			},
		])
        createChart('calorie', 'Calories', labels, [
			{
				label: 'Calories',
				data: calorieTotals,
				borderWidth: 1,
				tension: 0.3,
			},
		])
        createChart('water', 'Water', labels, [
			{
				label: 'Water',
				data: waterTotals,
				borderWidth: 1,
				tension: 0.3,
			},
		])
        createChart('activity', 'Activity', labels, [
			{
				label: 'Activity',
				data: activityTotals,
				borderWidth: 1,
				tension: 0.3,
			},
		])
        
	}
	// when stats changes, create the charts
    const ionViewWillEnter = async () => {
        console.log('** ionViewWillEnter')
        createCharts()
    }
</script>
<IonPage {ionViewWillEnter}>
    <ion-header>
        <ion-toolbar color="secondary">
            <ion-buttons slot="start">
                <ion-menu-button />
            </ion-buttons>
            <ion-title>Charts</ion-title>
        </ion-toolbar>
</ion-header>
	<ion-content class="ion-padding">
        <ion-grid>
            <ion-row>
                <ion-col>
                    <div style="width: 100%;">
                        <canvas id="weightChart" />
                    </div>
                </ion-col>
                <ion-col>
                    <div style="width: 100%;">
                        <canvas id="calorieChart" />
                    </div>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <div style="width: 100%;">
                        <canvas id="waterChart" />
                    </div>
                </ion-col>
                <ion-col>
                    <div style="width: 100%;">
                        <canvas id="activityChart" />
                    </div>
                </ion-col>
            </ion-row>
        </ion-grid>        
    </ion-content>
</IonPage>
