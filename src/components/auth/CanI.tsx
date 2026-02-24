import { ReactNode } from 'react'

export interface CanIProps {
    permissions?: { method: string; endpoint: string }[]
    permission?: string
    canIRole?: string
    method?: string
    endpoint?: string
    children?: ReactNode
    requireAdminAccess?: boolean
    fallback?: ReactNode
}

const CanI = ({ children }: CanIProps) => {
    return <>{children}</>
}

export default CanI