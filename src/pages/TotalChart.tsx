import { useMemo, Suspense, lazy } from 'react'
import { useFeeData } from '../hooks/useFeeData'
import { feeColors, feeLabels } from '../services/api'
import type { EChartsOption } from 'echarts'
import SummaryCard from '../components/SummaryCard'
import './ChartPage.css'

// Lazy load FeeChart for code splitting
const FeeChart = lazy(() => import('../components/FeeChart'))

function ChartSkeleton() {
    return (
        <div className="chart-skeleton">
            <div className="skeleton-header">
                <div className="skeleton-line" style={{ width: '30%' }} />
                <div className="skeleton-line" style={{ width: '15%' }} />
            </div>
            <div className="skeleton-chart" />
        </div>
    )
}

export default function TotalChart() {
    const { data, loading, error } = useFeeData()

    const charts = useMemo(() => {
        const currentYear = new Date().getFullYear()
        const years: number[] = []

        for (let year = currentYear; year >= 2021; year--) {
            years.push(year)
        }

        return years.map(year => {
            const waterData = data.water[year] || Array(12).fill(0)
            const electricityData = data.electricity[year] || Array(12).fill(0)
            const gasData = data.gas[year] || Array(12).fill(0)

            const totalData = waterData.map((_, i) =>
                waterData[i] + electricityData[i] + gasData[i]
            )
            const yearTotal = totalData.reduce((a, b) => a + b, 0)

            const option: EChartsOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    backgroundColor: 'rgba(20, 25, 35, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    textStyle: { color: '#fff' },
                },
                legend: {
                    data: ['水', '电', '气'],
                    textStyle: { color: '#a0a0a0' },
                },
                xAxis: {
                    type: 'category',
                    data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                    axisLine: { lineStyle: { color: '#444' } },
                    axisLabel: { color: '#888', fontSize: 11 },
                },
                yAxis: {
                    type: 'value',
                    axisLine: { lineStyle: { color: '#444' } },
                    axisLabel: { color: '#888' },
                    splitLine: { lineStyle: { color: '#333' } },
                },
                animationDuration: 800,
                animationEasing: 'cubicOut',
                animationDelay: (idx) => idx * 50,
                series: [
                    {
                        name: feeLabels.water,
                        type: 'bar',
                        stack: 'total',
                        emphasis: { focus: 'series' },
                        data: waterData,
                        itemStyle: { color: feeColors.water.main },
                        label: {
                            show: true,
                            color: '#000',
                            fontSize: 9,
                            formatter: (p) => p.value && Number(p.value) > 0 ? String(p.value) : '',
                        },
                    },
                    {
                        name: feeLabels.electricity,
                        type: 'bar',
                        stack: 'total',
                        emphasis: { focus: 'series' },
                        data: electricityData,
                        itemStyle: { color: feeColors.electricity.main },
                        label: {
                            show: true,
                            color: '#000',
                            fontSize: 9,
                            formatter: (p) => p.value && Number(p.value) > 0 ? String(p.value) : '',
                        },
                    },
                    {
                        name: feeLabels.gas,
                        type: 'bar',
                        stack: 'total',
                        emphasis: { focus: 'series' },
                        data: gasData,
                        itemStyle: { color: feeColors.gas.main },
                        label: {
                            show: true,
                            color: '#000',
                            fontSize: 9,
                            formatter: (p) => p.value && Number(p.value) > 0 ? String(p.value) : '',
                        },
                    },
                    {
                        name: '',
                        type: 'bar',
                        stack: 'overlay',
                        barGap: '-100%',
                        data: totalData,
                        itemStyle: { color: 'transparent' },
                        label: {
                            show: true,
                            position: 'top',
                            color: feeColors.total.main,
                            fontWeight: 'bold',
                            fontSize: 10,
                            rotate: 45,
                            offset: [0, -12],
                            formatter: (p) => p.value && Number(p.value) > 0 ? `$${p.value}` : '',
                        },
                    },
                ],
            }

            return { year, option, total: yearTotal }
        })
    }, [data])

    if (error) {
        return (
            <div className="chart-page">
                <h1 className="page-title">费用总览</h1>
                <div className="error-container">
                    <p>加载失败: {error.message}</p>
                    <button onClick={() => window.location.reload()} className="retry-btn">
                        重试
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="chart-page">
            <h1 className="page-title">
                <span className="title-icon">📊</span>
                费用总览
            </h1>

            <SummaryCard data={data} loading={loading} />

            {loading ? (
                <>
                    <ChartSkeleton />
                    <ChartSkeleton />
                </>
            ) : (
                <Suspense fallback={<ChartSkeleton />}>
                    {charts.map(({ year, option, total }) => (
                        <FeeChart
                            key={year}
                            option={option}
                            title={String(year)}
                            subtitle={`$${total.toFixed(0)}`}
                        />
                    ))}
                </Suspense>
            )}
        </div>
    )
}
