import React from 'react'
import { Form } from 'react-bootstrap'
import CustomPagination from './CustomPagination'
import './TableFooter.css'

interface TableFooterProps {
    currentPage: number
    totalPages: number
    pageSize: number
    setPageSize: (size: number) => void
    onPageChange: (pageNumber: number) => void
    footerElements?: React.ReactNode[]
}

export const TableFooter = ({
    currentPage,
    totalPages,
    pageSize,
    setPageSize,
    onPageChange,
    footerElements = [],
}: TableFooterProps) => {
    return (
        <div className="table-footer d-flex align-items-start align-items-md-center justify-content-between gap-3 mt-3 flex-column flex-md-row mb-3">
            <div className="table-footer__summary">
                {footerElements.length > 0 && (
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                        {footerElements.map((el, i) => (
                            <div key={i} className="table-footer-element">
                                {el}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="table-footer__controls d-flex flex-column flex-sm-row justify-content-end gap-3 flex-wrap">
                <div className="table-footer__page-size d-flex align-items-center justify-content-between justify-content-sm-start gap-2">
                    <span className="me-2 d-none d-md-inline">
                        Itens por página:
                    </span>
                    <Form.Select
                        className="light-theme-override"
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value))
                            onPageChange(1)
                        }}
                        style={{
                            width: '96px',
                            height: '32px',
                            padding: '4px',
                            fontSize: '0.875rem',
                        }}
                    >
                        {[10, 25, 50, 100].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </Form.Select>
                </div>

                <div className="table-footer__pagination d-flex justify-content-end">
                    <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>
        </div>
    )
}
