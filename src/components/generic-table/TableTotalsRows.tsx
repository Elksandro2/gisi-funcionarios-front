import React from 'react'
import { TableColumn } from './GenericTable'

interface TotalsRow {
    label: string
    items: Array<{ columnKey: string; value: React.ReactNode }>
}

interface TableTotalsRowsProps {
    totalsRows: TotalsRow[]
    displayColumns: TableColumn[]
    selectable: boolean
}

export function TableTotalsRows({
    totalsRows,
    displayColumns,
    selectable,
}: TableTotalsRowsProps) {
    if (!totalsRows || totalsRows.length === 0) return null

    const visibleKeys = displayColumns.map((c) => c.key)

    const rows = totalsRows.map((row, rowIdx) => {
        // Mapeia colKey -> value
        const itemsMap = new Map<string, React.ReactNode>()
        const indices: number[] = []
        row.items.forEach(({ columnKey, value }) => {
            if (visibleKeys.includes(columnKey)) {
                itemsMap.set(columnKey, value)
                indices.push(visibleKeys.indexOf(columnKey))
            }
        })
        if (indices.length === 0) return null

        indices.sort((a, b) => a - b)
        const leftMostIdx = indices[0]
        // O label deve ficar na coluna imediatamente anterior ao primeiro valor, quando possível
        const labelIdx = leftMostIdx > 0 ? leftMostIdx - 1 : -1

        return (
            <tr className="bg-body-tertiary" key={`totalrow-${rowIdx}`}>
                {selectable && <td />}

                {displayColumns.map((col, i) => {
                    const hasValue = itemsMap.has(col.key)
                    const isLabelCell = i === labelIdx

                    // Se não existe coluna anterior, colocamos label + (se for o primeiro valor) juntos
                    if (labelIdx < 0 && i === leftMostIdx) {
                        return (
                            <td
                                key={`t-${rowIdx}-${col.key}`}
                                className="text-end fw-semibold total-value-cell"
                            >
                                <div className="d-flex justify-content-between w-100">
                                    <span className="text-muted me-2">
                                        {row.label}
                                    </span>
                                    <span>{itemsMap.get(col.key)}</span>
                                </div>
                            </td>
                        )
                    }

                    if (isLabelCell) {
                        return (
                            <td
                                key={`t-${rowIdx}-${col.key}`}
                                className="text-end text-muted total-label-cell"
                            >
                                {row.label}
                            </td>
                        )
                    }

                    if (hasValue) {
                        return (
                            <td
                                key={`t-${rowIdx}-${col.key}`}
                                className="text-end fw-semibold total-value-cell"
                            >
                                {itemsMap.get(col.key)}
                            </td>
                        )
                    }

                    return <td key={`t-${rowIdx}-${col.key}`} />
                })}
            </tr>
        )
    })

    return <tfoot>{rows}</tfoot>
}
