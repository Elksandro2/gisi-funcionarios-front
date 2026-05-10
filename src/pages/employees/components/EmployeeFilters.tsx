import { Row, Col, Form, Button } from 'react-bootstrap'
import { EmployeeFilter } from '../../../types/Employee'
import { useState } from 'react'

interface EmployeeFiltersProps {
    onSearch: (filters: EmployeeFilter) => void
    onClear: () => void
    departments: string[]
}

export function EmployeeFilters({ onSearch, onClear, departments }: EmployeeFiltersProps) {
    const [searchTerms, setSearchTerms] = useState<EmployeeFilter>({
        name: '',
        department: '',
    })

    const handleLocalClear = () => {
        const empty = { name: '', department: '' }
        setSearchTerms(empty)
        onClear()
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
                        <Button variant="primary" className="w-100" onClick={() => onSearch(searchTerms)}>
                            Buscar
                        </Button>
                        <Button variant="outline-secondary" className="w-100" onClick={handleLocalClear}>
                            Limpar
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    )
}