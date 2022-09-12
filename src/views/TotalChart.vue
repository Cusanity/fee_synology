<template>
    <v-chart class="chart" :option="option" />
</template>

<script>
    import {use} from 'echarts/core'
    import {
        TooltipComponent,
        GridComponent,
        LegendComponent,
        MarkLineComponent,
    } from 'echarts/components'
    import {BarChart} from 'echarts/charts'
    import {CanvasRenderer} from 'echarts/renderers'

    import VChart from 'vue-echarts'
    import {ref, defineComponent} from 'vue'
    import global from '../../src/components/GlobalData'

    use([
        TooltipComponent,
        GridComponent,
        LegendComponent,
        MarkLineComponent,
        BarChart,
        CanvasRenderer,
    ])

    export default defineComponent({
        name: 'HelloWorld',
        components: {
            VChart,
        },
        setup() {
            const waterStack = {
                name: '水',
                type: 'bar',
                stack: 'Ad',
                data: global.waterData,
                itemStyle: {normal: {label: {show: true}, color: '#73c0de'}},
            }
            const electricityStack = {
                name: '电',
                type: 'bar',
                stack: 'Ad',
                emphasis: {
                    focus: 'series',
                },
                data: global.electricityData,
                itemStyle: {normal: {label: {show: true}, color: '#fac858'}},
            }
            const gasStack = {
                name: '气',
                type: 'bar',
                stack: 'Ad',
                emphasis: {
                    focus: 'series',
                },
                data: global.gasData,
                itemStyle: {normal: {label: {show: true}, color: '#91cc75'}},
            }
            let mySeries = [waterStack, electricityStack, gasStack]
            let totalData = []
            for (let i = 0; i < waterStack.data.length; i++) {
                totalData.push(
                    waterStack.data[i] +
                        electricityStack.data[i] +
                        gasStack.data[i]
                )
            }
            const totalStack = {
                name: '',
                stack: 'Ad2',
                type: 'bar',
                barGap: '-100%',
                data: totalData,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                        },
                        color: 'rgba(128, 128, 128, 0)',
                    },
                },
            }
            mySeries.push(totalStack)
            let option = ref({
                darkMode: 'auto',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                },
                legend: {},
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: 'category',
                        data: global.monthRange,
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                    },
                ],
                series: mySeries,
            })
            return {option}
        },
    })
</script>

<style scoped>
    .chart {
        height: 500px;
    }
</style>
