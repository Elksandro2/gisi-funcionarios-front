import { Row, Col, Form, Button } from 'react-bootstrap'
import { EmployeeFilter } from '../../../types/Employee'
import { useEffect, useMemo, useState } from 'react'

interface EmployeeFiltersProps {
    onSearch: (filters: EmployeeFilter) => void
    onClear: () => void
    departments: string[]
    currentFilters: EmployeeFilter
}

const FILTER_LABELS: Partial<Record<keyof EmployeeFilter, string>> = {
    name: 'Nome',
    department: 'Departamento',
}

function sanitizeFilters(filters: EmployeeFilter): EmployeeFilter {
    return Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            acc[key as keyof EmployeeFilter] = value as never
        }
        return acc
    }, {} as EmployeeFilter)
}

export function EmployeeFilters({ onSearch, onClear, departments, currentFilters }: EmployeeFiltersProps) {
    const [searchTerms, setSearchTerms] = useState<EmployeeFilter>({
        name: currentFilters.name ?? '',
        department: currentFilters.department ?? '',
    })

    useEffect(() => {
        setSearchTerms({
            name: currentFilters.name ?? '',
            department: currentFilters.department ?? '',
        })
    }, [currentFilters])

    const activeFilters = useMemo(() => {
        return Object.entries(sanitizeFilters(currentFilters)).filter(([key]) => key === 'name' || key === 'department')
    }, [currentFilters])

    const handleLocalClear = () => {
        const empty = { name: '', department: '' }
        setSearchTerms(empty)
        onClear()
    }

    const handleApplyFilters = () => {
        onSearch(sanitizeFilters(searchTerms))
    }

    const handleRemoveFilter = (filterKey: keyof EmployeeFilter) => {
        const nextFilters: EmployeeFilter = { ...currentFilters }
        delete nextFilters[filterKey]

        setSearchTerms((prev) => ({
            ...prev,
            [filterKey]: '',
        }))

        onSearch(sanitizeFilters(nextFilters))
    }

    return (
        <div className="bg-white p-3 rounded shadow-sm mb-4 border employee-filters">
            <h6 className="text-muted mb-3">Filtros de Busca</h6>
            <Row className="align-items-end g-3">
                <Col xs={12} md={4}>
                    <Form.Group>
                        <Form.Label className="small fw-bold">Nome</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nome do funcionário..."
                            value={searchTerms.name}
                            onChange={(e) => setSearchTerms({ ...searchTerms, name: e.target.value })}
                        />
                    </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                    <Form.Group>
                        <Form.Label className="small fw-bold">Departamento</Form.Label>
                        <Form.Select value={searchTerms.department} onChange={(e) => setSearchTerms({ ...searchTerms, department: e.target.value })}>
                            <option value="">Todos os Departamentos</option>
                            {departments.map((dept, index) => (
                                <option key={index} value={dept}>{dept}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col xs={12} md={3} lg={2}>
                    <div className="d-grid gap-2 d-sm-flex">
                        <Button variant="primary" className="w-100" onClick={handleApplyFilters}>
                            Buscar
                        </Button>
                        <Button variant="outline-secondary" className="w-100" onClick={handleLocalClear}>
                            Limpar
                        </Button>
                    </div>
                </Col>
            </Row>

            {activeFilters.length > 0 && (
                <div className="d-flex flex-wrap align-items-center gap-2 mt-3 pt-3 border-top">
                    <small className="text-muted fw-bold me-1">Ativos:</small>
                    {activeFilters.map(([key, value]) => (
                        <Button
                            key={key}
                            size="sm"
                            variant="outline-primary"
                            className="d-inline-flex align-items-center gap-2"
                            onClick={() => handleRemoveFilter(key as keyof EmployeeFilter)}
                            aria-label={`Remover filtro ${FILTER_LABELS[key as keyof EmployeeFilter] ?? key}`}
                        >
                            <span>{FILTER_LABELS[key as keyof EmployeeFilter] ?? key}: {String(value)}</span>
                            <span aria-hidden="true">x</span>
                        </Button>
                    ))}
                    <Button size="sm" variant="link" className="p-0 text-decoration-none" onClick={handleLocalClear}>
                        Limpar todos
                    </Button>
                </div>
            )}
        </div>
    )
}