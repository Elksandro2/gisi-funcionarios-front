import React, { useCallback } from 'react'
import { Table, Form } from 'react-bootstrap'
import { UseFormReturn, FieldValues } from 'react-hook-form'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DraggableColumn } from './DraggableColumn'
import { TableFooter } from './TableFooter'
import { ConfirmationModal } from './ConfirmationModal'
import { ColumnManagementModal } from './ColumnManagementModal'
import { FilterField, PresetFilter } from './AdvancedSearchModal'
import { BulkActionsBar } from './BulkActionsBar'
import { TableToolbar } from './TableToolbar'
import { TableTotalsRows } from './TableTotalsRows'
import { useGenericTableState } from './useGenericTableState'
import { CanIProps } from '../auth/CanI'
import './GenericTable.css'

export interface TableColumn {
    label: string
    key: string
    sortable?: boolean
    isDefault?: boolean
    fixed?: boolean
}

export interface TableAction<T> {
    label?: string
    description?: string
    icon?: React.ReactNode
    variant?: string
    onClick: (selectedItems: T[]) => void | Promise<void>
    isDisabled?: (selectedItems: T[]) => boolean
    requiresConfirmation?: boolean
    confirmationMessage?: string | ((selectedItems: T[]) => string)
    openModalPerItem?: boolean
    canI?: CanIProps
}

export type { FilterField }

/** várias linhas de totais, cada uma com vários valores em colunas diferentes */
export type TotalsRow = {
    label: string
    items: Array<{ columnKey: string; value: React.ReactNode }>
}

interface TableProps<T, TFilter extends FieldValues> {
    columns: TableColumn[]
    data: T[]
    onSort?: (key: string, order: string) => void
    sortKey?: string
    sortOrder?: string
    onPageChange: (pageNumber: number) => void
    currentPage: number
    totalPages: number
    renderRow: (item: T, columns: TableColumn[]) => React.ReactNode
    onSearch?: (filters: TFilter) => void
    pageSize: number
    setPageSize: (size: number) => void
    filterFields?: FilterField<TFilter>[]
    presetFilters?: PresetFilter<TFilter>[]
    children?: React.ReactNode
    isAdvancedSearchOpen?: boolean
    setIsAdvancedSearchOpen?: (open: boolean) => void
    formMethods?: UseFormReturn<TFilter>
    customFiltersRow?: React.ReactNode
    selectable?: boolean
    tableActions?: TableAction<T>[]
    onSelectionChange?: (selectedItems: T[]) => void
    footerElements?: React.ReactNode[]
    totalsRows?: TotalsRow[]
}

const GenericTable = <T extends object, TFilter extends FieldValues>({
    columns: initialColumns,
    data,
    onSort,
    sortKey,
    sortOrder,
    onPageChange,
    currentPage,
    totalPages,
    renderRow: originalRenderRow,
    onSearch,
    pageSize,
    setPageSize,
    filterFields = [],
    presetFilters = [],
    formMethods: externalFormMethods,
    customFiltersRow,
    selectable = false,
    tableActions,
    onSelectionChange,
    footerElements = [],
    totalsRows,
}: TableProps<T, TFilter>) => {
    const {
        selectedItems,
        displayColumns,
        showColumnModal,
        showConfirmModal,
        confirmMessage,
        formMethods,
        draggableColumns,
        appliedFiltersCount,
        setShowColumnModal,
        setShowConfirmModal,
        moveColumn,
        handleColumnToggle,
        handleActivateAllColumns,
        handleDeactivateAllColumns,
        handleSelectItem,
        handleSelectAll,
        handleAdvancedSearchSubmit,
        handleClearFilters,
        handleActionWithConfirmation,
        handleConfirmAction,
    } = useGenericTableState<T, TFilter>({
        initialColumns,
        data,
        filterFields,
        onSearch,
        onPageChange,
        onSelectionChange,
        formMethods: externalFormMethods,
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

    const handleBulkActionClick = useCallback(
        (action: TableAction<T>) => {
            handleActionWithConfirmation(action, selectedItems)
        },
        [handleActionWithConfirmation, selectedItems]
    )

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
        <DndProvider backend={HTML5Backend}>
            <div>
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <TableToolbar
                        hasFilterFields={filterFields.length > 0}
                        filterFields={filterFields}
                        presetFilters={presetFilters}
                        formMethods={formMethods}
                        onApplyFilters={handleAdvancedSearchSubmit}
                        onClearFilters={handleClearFilters}
                        onColumnManagementClick={() => setShowColumnModal(true)}
                        appliedFiltersCount={appliedFiltersCount}
                    />
                    {selectable && tableActions && (
                        <BulkActionsBar
                            tableActions={tableActions}
                            selectedItems={selectedItems}
                            onActionClick={handleBulkActionClick}
                        />
                    )}
                </div>

                <div>
                    {customFiltersRow && (
                        <div className="generic-table-status-button-container d-flex align-items-center flex-wrap gap-2">
                            {customFiltersRow}
                        </div>
                    )}

                    <div
                        className="table-responsive"
                        style={{ fontSize: '0.9rem' }}
                    >
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    {selectable && (
                                        <th className="selection-column">
                                            <Form.Check
                                                type="checkbox"
                                                checked={
                                                    selectedItems.length ===
                                                        data.length &&
                                                    data.length > 0
                                                }
                                                onChange={(e) =>
                                                    handleSelectAll(
                                                        e.target.checked
                                                    )
                                                }
                                                ref={(
                                                    input: HTMLInputElement | null
                                                ) => {
                                                    if (input) {
                                                        input.indeterminate =
                                                            selectedItems.length >
                                                                0 &&
                                                            selectedItems.length <
                                                                data.length
                                                    }
                                                }}
                                            />
                                        </th>
                                    )}
                                    {displayColumns.map((column, index) => (
                                        <DraggableColumn
                                            key={column.key}
                                            column={column}
                                            index={index}
                                            moveColumn={moveColumn}
                                            handleSort={handleSort}
                                            sortKey={sortKey}
                                            sortOrder={sortOrder}
                                        />
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {data.length > 0 ? (
                                    data.map((item, idx) => (
                                        <tr key={idx}>
                                            {renderRow(item, displayColumns)}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={
                                                displayColumns.length +
                                                (selectable ? 1 : 0)
                                            }
                                            className="text-center"
                                        >
                                            Nenhum dado encontrado
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                            {totalsRows && (
                                <TableTotalsRows
                                    totalsRows={totalsRows}
                                    displayColumns={displayColumns}
                                    selectable={selectable}
                                />
                            )}
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
                </div>

                <ColumnManagementModal
                    show={showColumnModal}
                    onHide={() => setShowColumnModal(false)}
                    initialColumns={initialColumns}
                    draggableColumns={draggableColumns}
                    onColumnToggle={handleColumnToggle}
                    onActivateAll={handleActivateAllColumns}
                    onDeactivateAll={handleDeactivateAllColumns}
                />

                <ConfirmationModal
                    show={showConfirmModal}
                    onHide={() => setShowConfirmModal(false)}
                    onConfirm={handleConfirmAction}
                    message={confirmMessage}
                />
            </div>
        </DndProvider>
    )
}

export default GenericTable
