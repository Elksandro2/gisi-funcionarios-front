import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Employees } from './pages/employees/Employees'
import ErrorPage from './pages/error-page/ErrorPage'
import { Dashboard } from './pages/employees/dashboard/Dashboard'
import { MainLayout } from './components/layout/MainLayout'

const Router: React.FC = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    )
}

export default Router
