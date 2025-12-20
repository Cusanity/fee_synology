import { useState, useEffect, type ChangeEvent } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import type { FeeType } from '../services/api'
import './DataTable.css'

interface TableRecord {
    year: number
    month: number
    amount: number | string
    isNew?: boolean
}

const API_BASE = 'https://fee.cusanity.synology.me/php/data.php'

export default function DataTable() {
    const navigate = useNavigate()
    const [table, setTable] = useState<FeeType>('electricity')
    const [data, setData] = useState<TableRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState<number | null>(null)

    useEffect(() => {
        fetchData()
    }, [table])

    async function fetchData() {
        setLoading(true)
        try {
            const response = await axios.get(`${API_BASE}?type=${table}`)
            const records: TableRecord[] = response.data.data || []
            records.sort((a, b) => {
                if (a.year !== b.year) return b.year - a.year
                return b.month - a.month
            })
            setData(records)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSave(index: number) {
        const item = data[index]
        setSaving(index)
        try {
            const response = await axios.post(`${API_BASE}?type=${table}`, item)
            if (response.data.status === 'success') {
                const updatedData = [...data]
                updatedData[index] = { ...item, isNew: false }
                setData(updatedData)
            } else {
                alert('保存失败')
            }
        } catch (error) {
            console.error('Error saving data:', error)
            alert('保存失败: 网络错误')
        } finally {
            setSaving(null)
        }
    }

    function handleAmountChange(index: number, value: string) {
        const updatedData = [...data]
        updatedData[index] = { ...updatedData[index], amount: value }
        setData(updatedData)
    }

    const tableLabels: Record<FeeType, string> = {
        electricity: '电费',
        water: '水费',
        gas: '气费',
    }

    return (
        <div className="data-table-page">
            <header className="data-table-header">
                <button className="back-btn" onClick={() => navigate('/')}>
                    ← 返回
                </button>
                <h1 className="page-title">
                    <span className="title-icon">📝</span>
                    数据管理
                </h1>
            </header>

            <div className="table-controls">
                <label htmlFor="table-select" className="select-label">选择类型:</label>
                <select
                    id="table-select"
                    value={table}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setTable(e.target.value as FeeType)}
                    className="table-select"
                >
                    <option value="electricity">⚡ {tableLabels.electricity}</option>
                    <option value="water">💧 {tableLabels.water}</option>
                    <option value="gas">🔥 {tableLabels.gas}</option>
                </select>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner" />
                    <p>加载中...</p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>年份</th>
                                <th>月份</th>
                                <th>金额 ($)</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={`${item.year}-${item.month}`}>
                                    <td className="cell-readonly">{item.year}</td>
                                    <td className="cell-readonly">{item.month}月</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.amount}
                                            onChange={(e) => handleAmountChange(index, e.target.value)}
                                            className="amount-input"
                                        />
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleSave(index)}
                                            disabled={saving === index}
                                            className={`save-btn ${item.isNew ? 'insert-btn' : ''}`}
                                        >
                                            {saving === index ? '保存中...' : item.isNew ? '添加' : '更新'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
