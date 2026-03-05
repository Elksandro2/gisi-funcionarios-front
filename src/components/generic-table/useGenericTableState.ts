import { useState, useCallback, useEffect } from 'react'
import { TableColumn } from './GenericTable'

interface UseGenericTableStateProps<T> {
    initialColumns: TableColumn[]
    data: T[]
    onPageChange: (page: number) => void
    onSelectionChange?: (items: T[]) => void
}

export function useGenericTableState<T>({
    data,
    onSelectionChange,
}: UseGenericTableStateProps<T>) {
    
    const [selectedItems, setSelectedItems] = useState<T[]>([])

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [confirmMessage, setConfirmMessage] = useState('')
    const [currentAction, setCurrentAction] = useState<(() => void) | null>(null)

    useEffect(() => {
        setSelectedItems([])
    }, [data])

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

    const handleActionWithConfirmation = useCallback(
        (action: () => void, message: string) => {
            setConfirmMessage(message)
            setCurrentAction(() => () => {
                action()
                setSelectedItems([])
            })
            setShowConfirmModal(true)
        },
        []
    )

    const handleConfirmAction = useCallback(() => {
        if (currentAction) currentAction()
        setShowConfirmModal(false)
    }, [currentAction])

    return {
        selectedItems,
        showConfirmModal,
        confirmMessage,
        setShowConfirmModal,
        setSelectedItems,
        handleSelectItem,
        handleSelectAll,
        handleActionWithConfirmation,
        handleConfirmAction,
    }
}