import { useMemo, Suspense, lazy } from 'react'
import { useFeeData } from '../hooks/useFeeData'
import { feeColors, type FeeType } from '../services/api'
import type { EChartsOption } from 'echarts'
import './ChartPage.css'

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

interface SingleChartPageProps {
    type: FeeType
    icon: string
}

function SingleChartPage({ type, icon }: SingleChartPageProps) {
    const { data, loading, error } = useFeeData()

    const charts = useMemo(() => {
        const currentYear = new Date().getFullYear()
        const years: number[] = []

        for (let year = currentYear; year >= 2021; year--) {
            years.push(year)
        }

        return years.map(year => {
            const typeData = data[type][year] || Array(12).fill(0)
            const yearTotal = typeData.reduce((a, b) => a + b, 0)

            const option: EChartsOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    backgroundColor: 'rgba(20, 25, 35, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    textStyle: { color: '#fff' },
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
                        type: 'bar',
                        data: typeData,
                        itemStyle: {
                            color: feeColors[type].main,
                            borderRadius: [4, 4, 0, 0],
                        },
                        label: {
                            show: true,
                            position: 'top',
                            color: feeColors[type].light,
                            fontWeight: 'bold',
                            fontSize: 10,
                            rotate: 45,
                            offset: [0, -12],
                            formatter: (p) => p.value && Number(p.value) > 0 ? `$${p.value}` : '',
                        },
                        emphasis: {
                            itemStyle: {
                                color: feeColors[type].light,
                            },
                        },
                    },
                ],
            }

            return { year, option, total: yearTotal }
        })
    }, [data, type])

    const titles: Record<FeeType, string> = {
        water: '水费',
        electricity: '电费',
        gas: '气费',
    }

    if (error) {
        return (
            <div className="chart-page">
                <h1 className="page-title">{titles[type]}</h1>
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
                <span className="title-icon">{icon}</span>
                {titles[type]}
            </h1>
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

export default SingleChartPage
