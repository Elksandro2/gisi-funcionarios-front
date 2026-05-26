import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Employees } from './pages/employees/Employees'
import ErrorPage from './pages/error-page/ErrorPage'
import { MainLayout } from './components/layout/MainLayout'
import { Dashboard } from './pages/dashboard/Dashboard'
import { Chatbot } from './pages/chatbot/Chatbot'

const Router: React.FC = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/chat" element={<Chatbot />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    )
}

export default Router
