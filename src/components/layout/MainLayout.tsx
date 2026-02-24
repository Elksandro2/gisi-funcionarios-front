import { NavLink, Outlet } from 'react-router-dom'
import { Speedometer2, People, BoxArrowRight } from 'react-bootstrap-icons'
import './MainLayout.css'

export function MainLayout() {
    return (
        <div className="main-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h4 className="fw-bold text-white mb-0">SGI</h4>
                </div>
                
                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                        <Speedometer2 size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    
                    <NavLink to="/employees" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                        <People size={20} />
                        <span>Funcionários</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer border-top border-secondary border-opacity-25 pt-3">
                    <div className="nav-item text-muted small" style={{cursor: 'pointer'}}>
                        <BoxArrowRight size={20} />
                        <span>Sair do Sistema</span>
                    </div>
                </div>
            </aside>

            <main className="content">
                <Outlet />
            </main>
        </div>
    )
}