import { useDrag, useDrop } from 'react-dnd'
import { TableColumn } from './GenericTable'
import { useRef } from 'react'

interface DraggableColumnProps {
    column: TableColumn
    index: number
    moveColumn: (dragIndex: number, hoverIndex: number) => void
    handleSort: (key: string) => void
    sortKey?: string
    sortOrder?: string
}

export function DraggableColumn({
    column,
    index,
    moveColumn,
    handleSort,
    sortKey,
    sortOrder,
}: DraggableColumnProps) {
    const ref = useRef<HTMLTableCellElement>(null)

    const [, drop] = useDrop({
        accept: 'column',
        hover(item: { index: number }, monitor) {
            if (column.fixed || item.index === index) return

            const dragIndex = item.index
            const hoverIndex = index

            const hoverBoundingRect = ref.current?.getBoundingClientRect()
            if (!hoverBoundingRect) return

            const clientOffset = monitor.getClientOffset()
            if (!clientOffset) return

            const hoverClientX = clientOffset.x - hoverBoundingRect.left
            const hoverWidth = hoverBoundingRect.width

            if (dragIndex < hoverIndex && hoverClientX > hoverWidth / 2) {
                moveColumn(dragIndex, hoverIndex)
                item.index = hoverIndex
            } else if (
                dragIndex > hoverIndex &&
                hoverClientX < hoverWidth / 2
            ) {
                moveColumn(dragIndex, hoverIndex)
                item.index = hoverIndex
            }
        },
    })

    const [{ isDragging }, drag] = useDrag({
        type: 'column',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: !column.fixed,
    })

    drag(drop(ref))

    return (
        <th
            ref={ref}
            onClick={() => column.sortable && handleSort(column.key)}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: column.sortable
                    ? 'pointer'
                    : column.fixed
                      ? 'default'
                      : 'move',
                transition: 'all 0.2s ease',
                border: isDragging ? '2px dashed #007bff' : 'none',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {!column.fixed && (
                    <i
                        className="bi bi-grip-vertical me-2"
                        style={{ cursor: 'move' }}
                    />
                )}
                {column.label}
                {column.sortable &&
                    (() => {
                        const isCurrentColumn = sortKey === column.key
                        const iconName =
                            isCurrentColumn && sortOrder === 'desc'
                                ? 'bi-sort-up-alt'
                                : 'bi-sort-down-alt'
                        const textColor = isCurrentColumn
                            ? 'text-primary'
                            : 'text-muted'

                        return (
                            <i
                                className={`bi ${iconName} ${textColor} fw-bold fs-5 ms-2`}
                            />
                        )
                    })()}
            </div>
        </th>
    )
}
