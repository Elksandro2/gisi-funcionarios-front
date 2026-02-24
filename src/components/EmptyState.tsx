import { BoxSeam } from 'react-bootstrap-icons'
import { CustomButton } from './custom-button/CustomButton'
import { ReactNode } from 'react'

interface EmptyStateProps {
    title?: string
    description: string
    icon?: ReactNode
    actionText?: string
    onAction?: () => void
}

export const EmptyState = ({
    title,
    description,
    icon,
    actionText,
    onAction,
}: EmptyStateProps) => (
    <div className="text-center py-5 px-3 my-5 border rounded-3 bg-light shadow-sm animate-fade-in">
        <div className="mb-4 text-muted opacity-50">
            {icon || <BoxSeam size={64} />}
        </div>
        <h3 className="fw-bold fs-4 mb-2">{title}</h3>
        <p className="text-muted mx-auto mb-4" style={{ maxWidth: '400px' }}>
            {description}
        </p>
        {actionText && onAction && (
            <CustomButton
                variant="primary"
                className="rounded-pill px-4"
                onClick={onAction}
            >
                {actionText}
            </CustomButton>
        )}
    </div>
)
