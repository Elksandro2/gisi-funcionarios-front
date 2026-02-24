import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { TableColumn, TableAction } from './GenericTable'
import CanI from '../auth/CanI'
import { EmptyState } from '../EmptyState'

interface MobileTableViewProps<T> {
    data: T[]
    columns: TableColumn[]
    renderRow: (item: T, columns: TableColumn[]) => React.ReactNode
    selectable: boolean
    selectedItems: T[]
    onSelectItem: (item: T, isSelected: boolean) => void
    hasActionsColumn: boolean
    tableActions?: TableAction<T>[]
    onActionClick?: (action: TableAction<T>, item: T) => void
}

const extractCells = (rowContent: React.ReactNode): React.ReactNode[] => {
    if (React.isValidElement(rowContent)) {
        const props = rowContent.props as { children?: React.ReactNode }
        if (props.children) {
            return React.Children.toArray(props.children)
        }
    }
    return React.Children.toArray(rowContent)
}

const getCellContent = (cell: React.ReactNode): React.ReactNode => {
    if (React.isValidElement(cell) && cell.type === 'td') {
        return (cell as React.ReactElement<{ children?: React.ReactNode }>)
            .props.children
    }
    return cell
}

export const MobileTableView = <T,>({
    data,
    columns,
    renderRow,
    hasActionsColumn,
    tableActions,
    onActionClick,
}: MobileTableViewProps<T>) => {
    return (
        <div className="d-block d-md-none">
            {data.length > 0 ? (
                data.map((item, index) => {
                    const cells = extractCells(renderRow(item, columns))

                    // Separa os dados normais da célula de ações
                    const dataCells = hasActionsColumn
                        ? cells.slice(0, -1)
                        : cells

                    const actionsCell = hasActionsColumn
                        ? cells[cells.length - 1]
                        : null

                    // Colunas visíveis no mobile (sem a coluna "Ações")
                    const mobileColumns = hasActionsColumn
                        ? columns.filter((c) => c.key !== 'actions')
                        : columns

                    return (
                        <Card key={index} className="mb-3 shadow-sm">
                            <Card.Body className="p-3">
                                {/* Campos normais */}
                                {mobileColumns.map((col, colIndex) => (
                                    <div
                                        key={col.key}
                                        className="mb-2 d-flex gap-1 align-items-start"
                                        style={{ lineHeight: '1.4' }}
                                    >
                                        <strong
                                            style={{
                                                minWidth: '90px',
                                                fontSize: '0.85rem',
                                            }}
                                        >
                                            {col.label}:
                                        </strong>
                                        <span
                                            style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {dataCells[colIndex]
                                                ? getCellContent(
                                                      dataCells[colIndex]
                                                  )
                                                : '-'}
                                        </span>
                                    </div>
                                ))}

                                {/* === BOTÕES DE AÇÃO DA TABELA (tableActions) === */}
                                {tableActions && tableActions.length > 0 && (
                                    <div className="d-flex flex-wrap justify-content-end gap-2 mt-3 pt-3 border-top">
                                        {tableActions.map(
                                            (action, actionIndex) => {
                                                const isDisabled =
                                                    action.isDisabled?.([
                                                        item,
                                                    ]) || false

                                                return (
                                                    <CanI
                                                        method={
                                                            action.canI?.method
                                                        }
                                                        endpoint={
                                                            action.canI
                                                                ?.endpoint
                                                        }
                                                        key={actionIndex}
                                                    >
                                                        <Button
                                                            variant={
                                                                action.variant ||
                                                                'primary'
                                                            }
                                                            disabled={
                                                                isDisabled
                                                            }
                                                            onClick={() =>
                                                                onActionClick?.(
                                                                    action,
                                                                    item
                                                                )
                                                            }
                                                            className={`d-flex align-items-center gap-1 ${isDisabled ? 'opacity-50' : ''}`}
                                                            style={{
                                                                fontSize:
                                                                    '1.4rem',
                                                                padding:
                                                                    '0.4rem 0.5rem',
                                                            }}
                                                            title={
                                                                action.description ||
                                                                action.label
                                                            }
                                                        >
                                                            {action.icon &&
                                                                action.icon}
                                                            {action.label && (
                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            '0.7rem',
                                                                    }}
                                                                >
                                                                    {
                                                                        action.label
                                                                    }
                                                                </span>
                                                            )}
                                                        </Button>
                                                    </CanI>
                                                )
                                            }
                                        )}
                                    </div>
                                )}

                                {/* === BOTÕES DE AÇÃO DA COLUNA (actions column) === */}
                                {hasActionsColumn && actionsCell && (
                                    <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
                                        {getCellContent(actionsCell)}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    )
                })
            ) : (
                <EmptyState description="Nenhum dado encontrado" />
            )}
        </div>
    )
}
