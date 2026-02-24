import { useState, useCallback, useEffect, useMemo } from 'react'
import {
    useForm,
    DefaultValues,
    FieldValues,
    UseFormReturn,
} from 'react-hook-form'
import { TableColumn, TableAction } from './GenericTable'
import { FilterField } from './AdvancedSearchModal'

interface UseGenericTableStateProps<T, TFilter extends FieldValues> {
    initialColumns: TableColumn[]
    data: T[]
    filterFields: FilterField<TFilter>[]
    onSearch?: (filters: TFilter) => void
    onPageChange: (page: number) => void
    onSelectionChange?: (items: T[]) => void
    formMethods?: UseFormReturn<TFilter>
}

export function useGenericTableState<T, TFilter extends FieldValues>({
    initialColumns,
    data,
    filterFields,
    onSearch,
    onPageChange,
    onSelectionChange,
    formMethods: externalFormMethods,
}: UseGenericTableStateProps<T, TFilter>) {
    // Seleção de itens
    const [selectedItems, setSelectedItems] = useState<T[]>([])

    // Colunas
    const defaultColumns = initialColumns.filter((col) => col.isDefault)
    const initialDraggableColumns = defaultColumns.filter(
        (col) => col.key !== 'actions' && !col.fixed
    )
    const fixedColumns = defaultColumns.filter(
        (col) => col.fixed && col.key !== 'actions'
    )
    const actionsColumn = defaultColumns.find((col) => col.key === 'actions')

    const [draggableColumns, setDraggableColumns] = useState<TableColumn[]>(
        initialDraggableColumns
    )

    // Modals
    const [showColumnModal, setShowColumnModal] = useState(false)
    const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [confirmMessage, setConfirmMessage] = useState('')
    const [currentAction, setCurrentAction] = useState<(() => void) | null>(
        null
    )

    // Form
    const createDefaultValues = (
        fields: FilterField<TFilter>[]
    ): Partial<TFilter> =>
        fields.reduce((acc, field) => {
            acc[field.name as keyof TFilter] = undefined
            return acc
        }, {} as Partial<TFilter>)

    const defaultValues = createDefaultValues(filterFields)

    const localFormMethods = useForm<TFilter>({
        defaultValues: defaultValues as DefaultValues<TFilter>,
    })

    const formMethods = externalFormMethods || localFormMethods

    // Applied filters state
    const [appliedFilters, setAppliedFilters] = useState<Partial<TFilter>>(
        defaultValues as Partial<TFilter>
    )

    // Count non-empty applied filters
    const appliedFiltersCount = useMemo(() => {
        return Object.values(appliedFilters).filter(
            (value) => value !== undefined && value !== null && value !== ''
        ).length
    }, [appliedFilters])

    // Reset selection when data changes
    useEffect(() => {
        setSelectedItems([])
    }, [data, onSearch])

    // Column management
    const moveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
        setDraggableColumns((prevColumns) => {
            const newColumns = [...prevColumns]
            const [movedColumn] = newColumns.splice(dragIndex, 1)
            newColumns.splice(hoverIndex, 0, movedColumn)
            return newColumns
        })
    }, [])

    const handleColumnToggle = useCallback(
        (columnKey: string, isChecked: boolean) => {
            if (
                columnKey === 'actions' ||
                initialColumns.find((c) => c.key === columnKey)?.fixed
            )
                return

            if (isChecked) {
                const columnToAdd = initialColumns.find(
                    (c) => c.key === columnKey
                )
                if (
                    columnToAdd &&
                    !draggableColumns.some((c) => c.key === columnKey)
                ) {
                    setDraggableColumns([...draggableColumns, columnToAdd])
                }
            } else {
                setDraggableColumns(
                    draggableColumns.filter((c) => c.key !== columnKey)
                )
            }
        },
        [initialColumns, draggableColumns]
    )

    const handleActivateAllColumns = useCallback(() => {
        const allNonFixedKeys = initialColumns
            .filter((col) => col.key !== 'actions' && !col.fixed)
            .map((col) => col.key)

        setDraggableColumns((prev) => {
            const currentKeys = new Set(prev.map((c) => c.key))
            const toAdd = initialColumns.filter(
                (col) =>
                    allNonFixedKeys.includes(col.key) &&
                    !currentKeys.has(col.key)
            )
            return [...prev, ...toAdd]
        })
    }, [initialColumns])

    const handleDeactivateAllColumns = useCallback(() => {
        setDraggableColumns((prev) =>
            prev.filter((col) => col.key === 'actions' || col.fixed)
        )
    }, [])

    // Selection handlers
    const handleSelectItem = useCallback(
        (item: T, isSelected: boolean) => {
            setSelectedItems((prev) => {
                const next = isSelected
                    ? [...prev, item]
                    : prev.filter((i) => i !== item)
                onSelectionChange?.(next)
                return next
            })
        },
        [onSelectionChange]
    )

    const handleSelectAll = useCallback(
        (isSelected: boolean) => {
            const next = isSelected ? [...data] : []
            setSelectedItems(next)
            onSelectionChange?.(next)
        },
        [data, onSelectionChange]
    )

    // Filter handlers
    const handleFiltersApply = useCallback(
        (filterData: TFilter) => {
            const filterDataWithoutEmpty = Object.entries(filterData).reduce(
                (acc, [key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        acc[key as keyof TFilter] = value
                        return acc
                    }
                    acc[key as keyof TFilter] =
                        undefined as TFilter[keyof TFilter]
                    return acc
                },
                {} as TFilter
            )

            setAppliedFilters(filterDataWithoutEmpty)
            if (onSearch) {
                onPageChange(1)
                onSearch(filterDataWithoutEmpty)
            }
            setIsAdvancedSearchOpen(false)
        },
        [onSearch, onPageChange]
    )

    const handleClearFilters = useCallback(() => {
        formMethods.reset(defaultValues as TFilter)
        setAppliedFilters(defaultValues as Partial<TFilter>)
        if (onSearch) {
            onPageChange(1)
            onSearch(defaultValues as TFilter)
        }
    }, [formMethods, defaultValues, onSearch, onPageChange])

    // Bulk action handlers
    const handleBulkClick = useCallback(
        async (action: TableAction<T>) => {
            if (action.openModalPerItem) {
                for (const item of selectedItems) {
                    try {
                        await action.onClick([item])
                    } catch (error) {
                        console.error('Erro ao processar item:', error)
                    }
                }
            } else {
                await action.onClick(selectedItems)
            }
            setSelectedItems([])
        },
        [selectedItems]
    )

    const handleActionWithConfirmation = useCallback(
        (action: TableAction<T>, items: T[]) => {
            const isDisabled = action.isDisabled?.(items) || items.length === 0
            if (isDisabled) return

            if (action.requiresConfirmation) {
                const message =
                    typeof action.confirmationMessage === 'function'
                        ? action.confirmationMessage(items)
                        : action.confirmationMessage ||
                          `Tem certeza que deseja ${action.description?.toLowerCase()} ${items.length} itens?`
                setConfirmMessage(message)
                setCurrentAction(() => () => {
                    action.onClick(items)
                    setSelectedItems([])
                })
                setShowConfirmModal(true)
            } else {
                action.onClick(items)
                setSelectedItems([])
            }
        },
        []
    )

    const handleConfirmAction = useCallback(() => {
        if (currentAction) currentAction()
        setShowConfirmModal(false)
    }, [currentAction])

    // Display columns
    const hasActionsColumn = actionsColumn !== undefined
    const displayColumns = [
        ...draggableColumns,
        ...fixedColumns,
        ...(hasActionsColumn ? [actionsColumn] : []),
    ]

    return {
        // State
        selectedItems,
        draggableColumns,
        displayColumns,
        hasActionsColumn,
        showColumnModal,
        isAdvancedSearchOpen,
        showConfirmModal,
        confirmMessage,
        formMethods,
        defaultValues,
        fixedColumns,
        actionsColumn,
        appliedFilters,
        appliedFiltersCount,

        // Setters
        setShowColumnModal,
        setIsAdvancedSearchOpen,
        setShowConfirmModal,
        setSelectedItems,

        // Handlers
        moveColumn,
        handleColumnToggle,
        handleActivateAllColumns,
        handleDeactivateAllColumns,
        handleSelectItem,
        handleSelectAll,
        handleAdvancedSearchSubmit: handleFiltersApply,
        handleClearFilters,
        handleBulkClick,
        handleActionWithConfirmation,
        handleConfirmAction,
    }
}
