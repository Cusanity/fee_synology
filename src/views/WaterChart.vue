<template>
    <div>
        <v-chart
            class="chart"
            v-for="(option, index) in options"
            :option="option"
            :key="index"
        />
    </div>
</template>

<script>
    import {use} from 'echarts/core'
    import VChart from 'vue-echarts'
    import {ref, defineComponent} from 'vue'
    import {GridComponent, TitleComponent} from 'echarts/components'
    import {BarChart} from 'echarts/charts'
    import {CanvasRenderer} from 'echarts/renderers'
    import global from '../../src/components/GlobalData'
    use([GridComponent, BarChart, CanvasRenderer, TitleComponent])
    export default defineComponent({
        name: 'HelloWorld',
        components: {
            VChart,
        },
        setup() {
            const currentYear = new Date().getFullYear()
            const options = ref([])

            for (let year = currentYear; year >= 2021; year--) {
                const option = global.genSingleOptionForYear('water', year)
                options.value.push(option)
            }
            return {options}
        },
    })
</script>

<style scoped>
    .chart {
        height: 500px;
    }
</style>
