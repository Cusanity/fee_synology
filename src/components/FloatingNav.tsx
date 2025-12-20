import { NavLink } from 'react-router-dom'
import './FloatingNav.css'

export default function FloatingNav() {
    return (
        <nav className="floating-nav">
            <NavLink to="/waterChart" className="nav-btn water-btn" title="水费">
                💧
            </NavLink>
            <NavLink to="/electricityChart" className="nav-btn electricity-btn" title="电费">
                ⚡
            </NavLink>
            <NavLink to="/gasChart" className="nav-btn gas-btn" title="气费">
                🔥
            </NavLink>
            <NavLink to="/totalChart" className="nav-btn total-btn" title="总览">
                📊
            </NavLink>
        </nav>
    )
}
