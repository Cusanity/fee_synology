import { useMemo } from 'react'
import FeeChart from '../components/FeeChart'
import { useFeeData } from '../hooks/useFeeData'
import { feeColors, type FeeType } from '../services/api'
import type { EChartsOption } from 'echarts'
import './ChartPage.css'

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
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    axisLine: { lineStyle: { color: '#444' } },
                    axisLabel: { color: '#888' },
                },
                yAxis: {
                    type: 'value',
                    axisLine: { lineStyle: { color: '#444' } },
                    axisLabel: { color: '#888' },
                    splitLine: { lineStyle: { color: '#333' } },
                },
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

    if (loading) {
        return (
            <div className="chart-page">
                <h1 className="page-title">{titles[type]}</h1>
                <div className="loading-container">
                    <div className="loading-spinner" />
                    <p>加载中...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="chart-page">
                <h1 className="page-title">{titles[type]}</h1>
                <div className="error-container">
                    <p>加载失败: {error.message}</p>
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
            {charts.map(({ year, option, total }) => (
                <FeeChart
                    key={year}
                    option={option}
                    title={String(year)}
                    subtitle={`$${total.toFixed(0)}`}
                />
            ))}
        </div>
    )
}

export default SingleChartPage
