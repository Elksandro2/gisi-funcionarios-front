import { NavLink, Outlet } from 'react-router-dom'
import { Speedometer2, People } from 'react-bootstrap-icons'
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
                    Equipe: <strong>Elksandro e Anna Gabriela</strong>
                </div>
            </aside>

            <main className="content">
                <Outlet />
            </main>
        </div>
    )
}