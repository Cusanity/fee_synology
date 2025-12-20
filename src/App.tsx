import { Routes, Route, useLocation } from 'react-router-dom'
import TotalChart from './pages/TotalChart'
import WaterChart from './pages/WaterChart'
import ElectricityChart from './pages/ElectricityChart'
import GasChart from './pages/GasChart'
import DataTable from './pages/DataTable'
import FloatingNav from './components/FloatingNav'
import './App.css'

function App() {
    const location = useLocation()
    const showNav = !location.pathname.includes('/about')

    return (
        <div className="app">
            <main className="app-main">
                <Routes>
                    <Route path="/" element={<TotalChart />} />
                    <Route path="/totalChart" element={<TotalChart />} />
                    <Route path="/waterChart" element={<WaterChart />} />
                    <Route path="/electricityChart" element={<ElectricityChart />} />
                    <Route path="/gasChart" element={<GasChart />} />
                    <Route path="/about" element={<DataTable />} />
                </Routes>
            </main>
            {showNav && <FloatingNav />}
        </div>
    )
}

export default App
