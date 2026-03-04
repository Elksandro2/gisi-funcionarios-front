import React, { useCallback } from 'react'
import { Table, Form } from 'react-bootstrap'
import { UseFormReturn, FieldValues } from 'react-hook-form'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DraggableColumn } from './DraggableColumn'
import { TableFooter } from './TableFooter'
import { ConfirmationModal } from './ConfirmationModal'
import { FilterField, PresetFilter } from './AdvancedSearchModal'
import { useGenericTableState } from './useGenericTableState'
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
    formMethods: externalFormMethods,
    customFiltersRow,
    selectable = false,
    onSelectionChange,
    footerElements = [],
}: TableProps<T, TFilter>) => {
    const {
        selectedItems,
        displayColumns,
        showConfirmModal,
        confirmMessage,
        setShowConfirmModal,
        moveColumn,
        handleSelectItem,
        handleSelectAll,
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
