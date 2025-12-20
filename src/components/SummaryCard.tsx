import { useMemo } from 'react'
import type { FeeData, FeeType } from '../services/api'
import './SummaryCard.css'

interface SummaryCardProps {
    data: Record<FeeType, FeeData>
    loading: boolean
}

interface MonthStats {
    current: number
    previous: number
    change: number
    changePercent: number
    missingTypes: FeeType[]
}

interface YearStats {
    currentYear: number
    previousYear: number
    ytd: number
    ytdPrevious: number
    change: number
    changePercent: number
}

export default function SummaryCard({ data, loading }: SummaryCardProps) {
    const stats = useMemo(() => {
        const now = new Date()
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth() // 0-indexed

        // Calculate current month total
        const getCurrentMonthTotal = (): MonthStats => {
            let current = 0
            let previous = 0
            const missingTypes: FeeType[] = []

            for (const type of ['water', 'electricity', 'gas'] as FeeType[]) {
                const yearData = data[type][currentYear] || Array(12).fill(0)
                const prevYearData = data[type][currentYear - 1] || Array(12).fill(0)

                const currentValue = yearData[currentMonth] || 0
                current += currentValue
                previous += prevYearData[currentMonth] || 0

                // Track if this type has no data for current month
                if (currentValue === 0) {
                    missingTypes.push(type)
                }
            }

            const change = current - previous
            const changePercent = previous > 0 ? (change / previous) * 100 : 0

            return { current, previous, change, changePercent, missingTypes }
        }

        // Calculate YTD totals
        const getYTDStats = (): YearStats => {
            let ytd = 0
            let ytdPrevious = 0

            for (const type of ['water', 'electricity', 'gas'] as FeeType[]) {
                const yearData = data[type][currentYear] || Array(12).fill(0)
                const prevYearData = data[type][currentYear - 1] || Array(12).fill(0)

                for (let i = 0; i <= currentMonth; i++) {
                    ytd += yearData[i] || 0
                    ytdPrevious += prevYearData[i] || 0
                }
            }

            const change = ytd - ytdPrevious
            const changePercent = ytdPrevious > 0 ? (change / ytdPrevious) * 100 : 0

            return {
                currentYear,
                previousYear: currentYear - 1,
                ytd,
                ytdPrevious,
                change,
                changePercent
            }
        }

        // Calculate category breakdown with YoY comparison
        const getCategoryBreakdown = () => {
            const breakdown: Record<FeeType, { current: number; previous: number; change: number; changePercent: number }> = {
                water: { current: 0, previous: 0, change: 0, changePercent: 0 },
                electricity: { current: 0, previous: 0, change: 0, changePercent: 0 },
                gas: { current: 0, previous: 0, change: 0, changePercent: 0 },
            }

            for (const type of ['water', 'electricity', 'gas'] as FeeType[]) {
                const yearData = data[type][currentYear] || Array(12).fill(0)
                const prevYearData = data[type][currentYear - 1] || Array(12).fill(0)

                // Sum up to current month for fair YTD comparison
                let currentTotal = 0
                let previousTotal = 0
                for (let i = 0; i <= currentMonth; i++) {
                    currentTotal += yearData[i] || 0
                    previousTotal += prevYearData[i] || 0
                }

                const change = currentTotal - previousTotal
                const changePercent = previousTotal > 0 ? (change / previousTotal) * 100 : 0

                breakdown[type] = { current: currentTotal, previous: previousTotal, change, changePercent }
            }

            return breakdown
        }

        return {
            month: getCurrentMonthTotal(),
            year: getYTDStats(),
            breakdown: getCategoryBreakdown(),
        }
    }, [data])

    if (loading) {
        return (
            <div className="summary-card skeleton">
                <div className="skeleton-line" style={{ width: '60%' }} />
                <div className="skeleton-line large" style={{ width: '40%' }} />
                <div className="skeleton-line" style={{ width: '80%' }} />
            </div>
        )
    }

    // Helper to render change indicator with both percentage and amount
    const renderChange = (change: number, changePercent: number, showAmount = true) => {
        if (change === 0) {
            return <span className="stat-change equal">— 持平</span>
        }
        const isIncrease = change > 0
        return (
            <span className={`stat-change ${isIncrease ? 'increase' : 'decrease'}`}>
                {isIncrease ? '↑' : '↓'}
                {Math.abs(changePercent).toFixed(0)}%
                {showAmount && ` ($${Math.abs(change).toFixed(0)})`}
            </span>
        )
    }

    const typeLabels: Record<FeeType, string> = {
        water: '水费',
        electricity: '电费',
        gas: '气费',
    }

    return (
        <div className="summary-card">
            <div className="summary-grid">
                {/* This Month */}
                <div className="stat-card">
                    <span className="stat-label">本月支出</span>
                    <span className="stat-value">${stats.month.current.toFixed(0)}</span>
                    {renderChange(stats.month.change, stats.month.changePercent)}
                    {stats.month.missingTypes.length > 0 && (
                        <span className="stat-warning">
                            ⚠️ 本月{stats.month.missingTypes.map(t => typeLabels[t]).join('、')}暂无账单
                        </span>
                    )}
                </div>

                {/* YTD with Category Breakdown */}
                <div className="stat-card breakdown">
                    <div className="breakdown-header">
                        <div className="breakdown-summary">
                            <span className="stat-label">年初至今</span>
                            <span className="stat-value">${stats.year.ytd.toFixed(0)}</span>
                            {renderChange(stats.year.change, stats.year.changePercent)}
                        </div>
                    </div>
                    <div className="breakdown-bars">
                        <div className="breakdown-item">
                            <span className="breakdown-icon">💧</span>
                            <div className="breakdown-bar water" style={{ width: `${stats.year.ytd > 0 ? (stats.breakdown.water.current / stats.year.ytd) * 100 : 0}%` }} />
                            <span className="breakdown-value">${stats.breakdown.water.current.toFixed(0)}</span>
                            {renderChange(stats.breakdown.water.change, stats.breakdown.water.changePercent)}
                        </div>
                        <div className="breakdown-item">
                            <span className="breakdown-icon">⚡</span>
                            <div className="breakdown-bar electricity" style={{ width: `${stats.year.ytd > 0 ? (stats.breakdown.electricity.current / stats.year.ytd) * 100 : 0}%` }} />
                            <span className="breakdown-value">${stats.breakdown.electricity.current.toFixed(0)}</span>
                            {renderChange(stats.breakdown.electricity.change, stats.breakdown.electricity.changePercent)}
                        </div>
                        <div className="breakdown-item">
                            <span className="breakdown-icon">🔥</span>
                            <div className="breakdown-bar gas" style={{ width: `${stats.year.ytd > 0 ? (stats.breakdown.gas.current / stats.year.ytd) * 100 : 0}%` }} />
                            <span className="breakdown-value">${stats.breakdown.gas.current.toFixed(0)}</span>
                            {renderChange(stats.breakdown.gas.change, stats.breakdown.gas.changePercent)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
