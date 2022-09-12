<template>
    <v-chart class="chart" :option="option" />
</template>

<script>
    import {use} from 'echarts/core'
    import VChart from 'vue-echarts'
    import {ref, defineComponent} from 'vue'
    import {GridComponent} from 'echarts/components'
    import {BarChart} from 'echarts/charts'
    import {CanvasRenderer} from 'echarts/renderers'
    import global from '../../src/components/GlobalData'

    use([GridComponent, BarChart, CanvasRenderer])
    export default defineComponent({
        name: 'HelloWorld',
        components: {
            VChart,
        },
        setup() {
            const option = ref({
                darkMode: 'auto',
                xAxis: {
                    type: 'category',
                    data: global.monthRange,
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        data: global.gasData,
                        type: 'bar',
                        itemStyle: {
                            normal: {label: {show: true}, color: '#91cc75'},
                        },
                    },
                ],
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
