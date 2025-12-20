import { NavLink } from 'react-router-dom'
import './FloatingNav.css'

export default function FloatingNav() {
    return (
        <nav className="floating-nav">
            <NavLink to="/waterChart" className="nav-btn water-btn" title="水费">
                <span className="nav-icon">💧</span>
                <span className="nav-label">水费</span>
            </NavLink>
            <NavLink to="/electricityChart" className="nav-btn electricity-btn" title="电费">
                <span className="nav-icon">⚡</span>
                <span className="nav-label">电费</span>
            </NavLink>
            <NavLink to="/gasChart" className="nav-btn gas-btn" title="气费">
                <span className="nav-icon">🔥</span>
                <span className="nav-label">气费</span>
            </NavLink>
            <NavLink to="/totalChart" className="nav-btn total-btn" title="总览">
                <span className="nav-icon">📊</span>
                <span className="nav-label">总览</span>
            </NavLink>
        </nav>
    )
}
