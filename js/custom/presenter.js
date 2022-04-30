/**
 * @class Presenter
 * @description This class handles the presentation of the results after running an experiment.
 * @author Matias Micheletto
 * @version 1.0
 */

class Presenter {
    constructor(elapsedChartEl, errorChartEl) {
        this.elapsedChartEl = elapsedChartEl; // Element where the elapsed chart will be rendered
        this.errorChartEl = errorChartEl; // Element where the error chart will be rendered
    }

    updateChart(config) { // Highcharts config
        const {chartEl, title, subtitle, xLabel, yLabel, xSuffix, ySuffix, categories, series} = config;
        Highcharts.chart(chartEl, {
            title: {text: title},
            subtitle: {text: subtitle},
            yAxis: {title: {text: yLabel+" "+ySuffix}},
            xAxis: {
                title: {text: xLabel+" "+xSuffix},
                categories: categories
            },
            credits:{
                enabled:false
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'                
            },
            tooltip: {
                formatter: function(){ 
                    return `<b>Optimizer ${this.series.name}</b>
                        <br/>
                        <b>${xLabel}</b> ${this.x} ${xSuffix}
                        <br/>
                        <b>${yLabel}:</b> ${this.y} ${ySuffix}`
                }
            },
            series: series,
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        });
    }

    updateResults(results) { // Refactor the results to be compatible with Highcharts data format
        const grouped = _.groupBy(results.data, 'id');
        const categories = _.range(results.iterMin, results.iterMax, results.step).map(val => val/1000);
        
        // Generate data of elapsed chart
        const elapsedSeries = Object.keys(grouped).map(id => ({
            name: `${id} (${grouped[id][0].type})`,
            data: grouped[id].map(r => r.elapsed)
        }));
        this.updateChart({
            chartEl: this.elapsedChartEl,
            title: 'Elapsed time vs iterations',
            subtitle: 'Total elapsed: ' + results.elapsed + ' ms',
            xLabel: 'Iterations',
            xSuffix: '(x1000)',
            yLabel: 'Elapsed',
            ySuffix: 'ms',
            categories: categories,
            series: elapsedSeries
        });

        // Generate data of error chart
        const errorSeries = Object.keys(grouped).map(id => ({
            name: `${id} (${grouped[id][0].type})`,
            data: grouped[id].map(r => r.err)
        }));        
        this.updateChart({
            chartEl: this.errorChartEl,
            title: 'Relative error vs iterations',
            subtitle: '',
            xLabel: 'Iterations',
            xSuffix: '(x1000)',
            yLabel: 'Relative error',
            ySuffix: '%',
            categories: categories,
            series: errorSeries
        });
    }

    clear() { // Clear the charts
        this.errorChartEl.innerHTML = '';
        this.elapsedChartEl.innerHTML = '';
    }
}