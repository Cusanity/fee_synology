<template>
    <div>
        <!-- <v-chart class="chart" :option="option2023" /> -->
        <v-chart class="chart" :option="option2022" />
        <v-chart class="chart" :option="option2021" />
    </div>
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
            const option2023 = ref({
                ...global.commonEchartsOption,
                series: [
                    {
                        ...global.commonEchartsOption.series[0],
                        data: global.waterDict[2023],
                        itemStyle: {
                            normal: {label: {show: true}, color: '#73c0de'},
                        },
                    },
                ],
                title: {...global.commonEchartsOption.title, text: '2023'},
            })
            const option2022 = ref({
                ...global.commonEchartsOption,
                series: [
                    {
                        ...global.commonEchartsOption.series[0],
                        data: global.waterDict[2022],
                        itemStyle: {
                            normal: {label: {show: true}, color: '#73c0de'},
                        },
                    },
                ],
                title: {...global.commonEchartsOption.title, text: '2022'},
            })
            const option2021 = ref({
                ...global.commonEchartsOption,
                series: [
                    {
                        ...global.commonEchartsOption.series[0],
                        data: global.waterDict[2021],
                        itemStyle: {
                            normal: {label: {show: true}, color: '#73c0de'},
                        },
                    },
                ],
                title: {...global.commonEchartsOption.title, text: '2021'},
            })
            return {option2023, option2022, option2021}
        },
    })
</script>

<style scoped>
    .chart {
        height: 500px;
    }
</style>
