import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import './FeeChart.css'

interface FeeChartProps {
    option: EChartsOption
    title?: string
    subtitle?: string
}

export default function FeeChart({ option, title, subtitle }: FeeChartProps) {
    const enhancedOption: EChartsOption = {
        ...option,
        backgroundColor: 'transparent',
        textStyle: {
            fontFamily: 'Inter, sans-serif',
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: title ? '15%' : '8%',
            top: subtitle ? '10%' : '8%',
            containLabel: true,
        },
    }

    return (
        <div className="fee-chart">
            {title && (
                <div className="fee-chart-header">
                    <h2 className="fee-chart-title">{title}</h2>
                    {subtitle && <span className="fee-chart-subtitle">{subtitle}</span>}
                </div>
            )}
            <ReactECharts
                option={enhancedOption}
                style={{ height: '400px', width: '100%' }}
                opts={{ renderer: 'canvas' }}
                theme="dark"
            />
        </div>
    )
}
