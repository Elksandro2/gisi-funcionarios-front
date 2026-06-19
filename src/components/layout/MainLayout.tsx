import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Button, Offcanvas } from 'react-bootstrap'
import { Speedometer2, People, List, Robot } from 'react-bootstrap-icons'
import './MainLayout.css'

export function MainLayout() {
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const location = useLocation()

    useEffect(() => {
        setShowMobileMenu(false)
    }, [location.pathname])

    const navigationItems = [
        { to: '/dashboard', label: 'Dashboard', icon: <Speedometer2 size={20} /> },
        { to: '/employees', label: 'Funcionários', icon: <People size={20} /> },
        { to: '/assistant', label: 'Assistente IA', icon: <Robot size={20} /> },
    ]

    return (
        <div className="main-layout">
            <header className="mobile-topbar d-lg-none">
                <Button
                    variant="light"
                    className="mobile-topbar__menu-btn"
                    onClick={() => setShowMobileMenu(true)}
                    aria-label="Abrir menu"
                >
                    <List size={22} />
                </Button>

                <div>
                    <h1 className="mobile-topbar__brand">SG</h1>
                    <p className="mobile-topbar__subtitle">Gestão de funcionários</p>
                </div>
            </header>

            <aside className="sidebar">
                <div className="sidebar-header">
                    <h4 className="fw-bold text-white mb-0">SG</h4>
                    <small className="sidebar-brand-subtitle">Sistema de Gerenciamento</small>
                </div>
                
                <nav className="sidebar-nav">
                    {navigationItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer border-top border-secondary border-opacity-25 pt-3">
                    Equipe: <strong>Elksandro e Anna Gabriela</strong>
                </div>
            </aside>

            <Offcanvas
                show={showMobileMenu}
                onHide={() => setShowMobileMenu(false)}
                className="sidebar-mobile d-lg-none"
                placement="start"
                backdrop
            >
                <Offcanvas.Header closeButton closeVariant="white">
                    <Offcanvas.Title>SG</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <nav className="sidebar-nav sidebar-nav--mobile">
                        {navigationItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                                onClick={() => setShowMobileMenu(false)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="sidebar-footer border-top border-secondary border-opacity-25 pt-3 mt-3">
                        Equipe: <strong>Elksandro e Anna Gabriela</strong>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            <main className="content">
                <Outlet />
            </main>
        </div>
    )
}