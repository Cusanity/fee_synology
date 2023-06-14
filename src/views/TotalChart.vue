<template>
    <div>
        <v-chart
            class="chart"
            v-for="(option, index) in [option2023, option2022, option2021]"
            :option="option"
            :key="index"
        />
    </div>
</template>

<script>
    import {use} from 'echarts/core'
    import {
        TooltipComponent,
        GridComponent,
        LegendComponent,
        MarkLineComponent,
        TitleComponent,
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
        TitleComponent,
    ])

    export default defineComponent({
        name: 'HelloWorld',
        components: {
            VChart,
        },
        setup() {
            const option2023 = ref(global.genTotalOptionsForYear(2023))
            const option2022 = ref(global.genTotalOptionsForYear(2022))
            const option2021 = ref(global.genTotalOptionsForYear(2021))
            return {option2023, option2022, option2021}
        },
    })
</script>

<style scoped>
    .chart {
        height: 500px;
    }
</style>
