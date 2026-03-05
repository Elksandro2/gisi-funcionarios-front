import React, { useCallback } from 'react'
import { Table, Form } from 'react-bootstrap'
// Removi o FieldValues e UseFormReturn daqui pois não são mais usados
import 'bootstrap-icons/font/bootstrap-icons.css'
import { TableFooter } from './TableFooter'
import { ConfirmationModal } from './ConfirmationModal'
import { useGenericTableState } from './useGenericTableState'
import './GenericTable.css'

export interface TableColumn {
    label: string
    key: string
    sortable?: boolean
    isDefault?: boolean
    fixed?: boolean
}

interface TableProps<T> {
    columns: TableColumn[]
    data: T[]
    onSort?: (key: string, order: string) => void
    sortKey?: string
    sortOrder?: string
    onPageChange: (pageNumber: number) => void
    currentPage: number
    totalPages: number
    renderRow: (item: T, columns: TableColumn[]) => React.ReactNode
    pageSize: number
    setPageSize: (size: number) => void
    customFiltersRow?: React.ReactNode
    selectable?: boolean
    onSelectionChange?: (selectedItems: T[]) => void
    footerElements?: React.ReactNode[]
}

const GenericTable = <T extends object>({
    columns,
    data,
    onSort,
    sortKey,
    sortOrder,
    onPageChange,
    currentPage,
    totalPages,
    renderRow: originalRenderRow,
    pageSize,
    setPageSize,
    customFiltersRow,
    selectable = false,
    onSelectionChange,
    footerElements = [],
}: TableProps<T>) => {
    
    const {
        selectedItems,
        showConfirmModal,
        confirmMessage,
        setShowConfirmModal,
        handleSelectItem,
        handleSelectAll,
        handleConfirmAction,
    } = useGenericTableState<T>({
        initialColumns: columns,
        data,
        onPageChange,
        onSelectionChange,
    })

    const handleSort = (key: string) => {
        if (onSort) {
            const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
            onSort(key, newOrder)
        }
    }

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return
        onPageChange(pageNumber)
    }

    const renderRow = useCallback(
        (item: T, columns: TableColumn[]) => {
            const isSelected = selectedItems.includes(item)
            const rowContent = originalRenderRow(item, columns)
            return (
                <>
                    {selectable && (
                        <td>
                            <Form.Check
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) =>
                                    handleSelectItem(item, e.target.checked)
                                }
                            />
                        </td>
                    )}
                    {rowContent}
                </>
            )
        },
        [originalRenderRow, selectable, selectedItems, handleSelectItem]
    )

    return (
        <div className="generic-table-container">
            {customFiltersRow && (
                <div className="generic-table-status-button-container d-flex align-items-center flex-wrap gap-2 mb-3">
                    {customFiltersRow}
                </div>
            )}

            <div className="table-responsive" style={{ fontSize: '0.9rem' }}>
                <Table striped bordered hover className="align-middle">
                    <thead className="table-light">
                        <tr>
                            {selectable && (
                                <th style={{ width: '40px' }}>
                                    <Form.Check
                                        type="checkbox"
                                        checked={data.length > 0 && selectedItems.length === data.length}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        ref={(input: HTMLInputElement | null) => {
                                            if (input) {
                                                input.indeterminate = selectedItems.length > 0 && selectedItems.length < data.length
                                            }
                                        }}
                                    />
                                </th>
                            )}
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    onClick={() => column.sortable && handleSort(column.key)}
                                    style={{
                                        cursor: column.sortable ? 'pointer' : 'default',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    <div className="d-flex align-items-center">
                                        {column.label}
                                        {column.sortable && (
                                            <span className="ms-2">
                                                {sortKey === column.key ? (
                                                    sortOrder === 'asc' ? 
                                                        <i className="bi bi-sort-down-alt text-primary" /> : 
                                                        <i className="bi bi-sort-up-alt text-primary" />
                                                ) : (
                                                    <i className="bi bi-sort-down text-muted opacity-50" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, idx) => (
                                <tr key={idx}>
                                    {renderRow(item, columns)}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + (selectable ? 1 : 0)} className="text-center py-4 text-muted">
                                    Nenhum dado encontrado
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            <TableFooter
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                setPageSize={setPageSize}
                onPageChange={handlePageChange}
                footerElements={footerElements}
            />

            <ConfirmationModal
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmAction}
                message={confirmMessage}
            />
        </div>
    )
}

export default GenericTable