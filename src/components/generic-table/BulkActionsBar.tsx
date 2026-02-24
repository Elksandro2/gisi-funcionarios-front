import { Button } from 'react-bootstrap'
import { TableAction } from './GenericTable'
import CanI from '../auth/CanI'

interface BulkActionsBarProps<T> {
    tableActions: TableAction<T>[]
    selectedItems: T[]
    onActionClick: (action: TableAction<T>) => void
}

export function BulkActionsBar<T>({
    tableActions,
    selectedItems,
    onActionClick,
}: BulkActionsBarProps<T>) {
    if (!tableActions || tableActions.length === 0) return null

    return (
        <div className="generic-table-bulk-actions-container d-none d-md-flex flex-wrap gap-lg-3 gap-2 p-lg-3 rounded mb-2 bg-body-tertiary">
            {tableActions.map((action, index) => {
                const isDisabled =
                    action.isDisabled?.(selectedItems) ||
                    selectedItems.length === 0

                return (
                    <CanI
                        method={action.canI?.method}
                        endpoint={action.canI?.endpoint}
                        key={index}
                    >
                        <div className="d-flex flex-column align-items-center">
                            <Button
                                variant={action.variant || 'primary'}
                                size="sm"
                                disabled={isDisabled}
                                onClick={() => onActionClick(action)}
                                className={isDisabled ? 'opacity-50' : ''}
                            >
                                {action.icon && <span>{action.icon}</span>}
                                {action.label}
                            </Button>
                            {selectedItems.length > 0 && action.description && (
                                <p className="text-dark small text-center">
                                    {action.description}
                                </p>
                            )}
                        </div>
                    </CanI>
                )
            })}
        </div>
    )
}
