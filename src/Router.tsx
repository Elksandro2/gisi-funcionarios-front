import React, { Suspense, lazy } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import ErrorPage from './pages/error-page/ErrorPage'
import { MainLayout } from './components/layout/MainLayout'
import { Loading } from './components/loading/Loading'

const Dashboard = lazy(() => import('./pages/dashboard/Dashboard').then(mod => ({ default: mod.Dashboard })))
const Employees = lazy(() => import('./pages/employees/Employees').then(mod => ({ default: mod.Employees })))
const Chatbot = lazy(() => import('./pages/chatbot/Chatbot').then(mod => ({ default: mod.Chatbot })))

const Router: React.FC = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Suspense fallback={<Loading />}><Dashboard /></Suspense>} />
                <Route path="/employees" element={<Suspense fallback={<Loading />}><Employees /></Suspense>} />
                <Route path="/chat" element={<Suspense fallback={<Loading />}><Chatbot /></Suspense>} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    )
}

export default Router
