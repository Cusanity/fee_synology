import axios from 'axios'

const API_BASE = 'https://fee.cusanity.synology.me/php/data.php'

export interface FeeRecord {
  year: number
  month: number
  amount: number
}

export type FeeType = 'water' | 'electricity' | 'gas'

export interface FeeData {
  [year: number]: number[]
}

export async function fetchFeeData(type: FeeType): Promise<FeeData> {
  const response = await axios.get(`${API_BASE}?type=${type}`)
  const records: FeeRecord[] = response.data.data

  const data: FeeData = {}
  
  for (const record of records) {
    const amount = typeof record.amount === 'number' && !Number.isNaN(record.amount) ? record.amount : 0
    if (amount > 0 && record.year && record.month) {
      if (!data[record.year]) {
        data[record.year] = Array(12).fill(0)
      }
      data[record.year][record.month - 1] = amount
    }
  }
  
  return data
}

export async function updateFeeData(type: FeeType, record: FeeRecord): Promise<boolean> {
  const response = await axios.post(`${API_BASE}?type=${type}`, record)
  return response.data.status === 'success'
}

export const feeColors: Record<FeeType | 'total', { main: string; light: string }> = {
  water: { main: 'hsl(200, 85%, 55%)', light: 'hsl(200, 85%, 70%)' },
  electricity: { main: 'hsl(45, 100%, 55%)', light: 'hsl(45, 100%, 70%)' },
  gas: { main: 'hsl(25, 95%, 55%)', light: 'hsl(25, 95%, 70%)' },
  total: { main: 'hsl(145, 65%, 50%)', light: 'hsl(145, 65%, 65%)' },
}

export const feeLabels: Record<FeeType, string> = {
  water: '水',
  electricity: '电',
  gas: '气',
}
