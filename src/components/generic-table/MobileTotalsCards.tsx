import React from 'react'
import { TableColumn } from './GenericTable'

interface MobileTotalsCardsProps {
    totalsRows: Array<{
        label: string
        items: Array<{ columnKey: string; value: React.ReactNode }>
    }>
    initialColumns: TableColumn[]
}

export function MobileTotalsCards({
    totalsRows,
    initialColumns,
}: MobileTotalsCardsProps) {
    if (!totalsRows || totalsRows.length === 0) return null

    return (
        <div className="d-md-none d-flex flex-column gap-2 mt-2">
            {totalsRows.map((row, i) => (
                <div className="card p-2" key={`m-${i}`}>
                    <div className="fw-semibold text-dark mb-1">
                        {row.label}
                    </div>
                    <div className="d-flex flex-column gap-1">
                        {row.items.map((it, j) => {
                            const colLabel =
                                initialColumns.find(
                                    (c) => c.key === it.columnKey
                                )?.label ?? it.columnKey
                            return (
                                <div
                                    className="d-flex justify-content-between"
                                    key={`mi-${i}-${j}`}
                                >
                                    <span className="small">{colLabel}</span>
                                    <span className="fw-semibold">
                                        {it.value}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}
