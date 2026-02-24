import React from 'react'
import { Pagination } from 'react-bootstrap'

interface CustomPaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (pageNumber: number) => void
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const handlePageChange = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return
        onPageChange(pageNumber)
    }

    const renderPageItems = () => {
        const maxButtons = 5 // Número máximo de botões visíveis
        const half = Math.floor(maxButtons / 2) // Metade dos botões para centralizar
        let startPage = Math.max(1, currentPage - half) // Página inicial do intervalo
        let endPage = Math.min(totalPages, startPage + maxButtons - 1) // Página final do intervalo

        // Ajusta o início se o fim estiver muito próximo do total
        if (endPage - startPage + 1 < maxButtons) {
            startPage = Math.max(1, endPage - maxButtons + 1)
        }

        const pages = []
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Pagination.Item
                    className="light-theme-override"
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Pagination.Item>
            )
        }
        return pages
    }

    return (
        <div className="d-flex align-items-center">
            <Pagination className="mb-0 light-theme-override rounded-2">
                <Pagination.First
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                />
                <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                {renderPageItems()}
                <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
                <Pagination.Last
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                />
            </Pagination>
        </div>
    )
}

export default CustomPagination
