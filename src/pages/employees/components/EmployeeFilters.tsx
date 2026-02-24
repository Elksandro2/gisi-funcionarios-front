import { Row, Col, Form, Button } from 'react-bootstrap'
import { EmployeeFilter } from '../../../types/Employee'
import { useState } from 'react'

interface EmployeeFiltersProps {
    onSearch: (filters: EmployeeFilter) => void
    onClear: () => void
}

export function EmployeeFilters({ onSearch, onClear }: EmployeeFiltersProps) {
    const [searchTerms, setSearchTerms] = useState<EmployeeFilter>({
        name: '',
        department: '',
        role: '',
    })

    const handleLocalClear = () => {
        const empty = { name: '', department: '', role: '' }
        setSearchTerms(empty)
        onClear()
    }

    return (
        <div className="bg-white p-3 rounded shadow-sm mb-4 border">
            <h6 className="text-muted mb-3">Filtros de Busca</h6>
            <Row className="align-items-end g-2">
                <Col md={4}>
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
                <Col md={3}>
                    <Form.Group>
                        <Form.Label className="small fw-bold">Departamento</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="TI, RH..."
                            value={searchTerms.department}
                            onChange={(e) => setSearchTerms({ ...searchTerms, department: e.target.value })}
                        />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label className="small fw-bold">Cargo</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Analista, Diretor..."
                            value={searchTerms.role}
                            onChange={(e) => setSearchTerms({ ...searchTerms, role: e.target.value })}
                        />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <div className="d-flex gap-2">
                        <Button variant="primary" className="w-100" onClick={() => onSearch(searchTerms)}>
                            Buscar
                        </Button>
                        <Button variant="outline-secondary" onClick={handleLocalClear}>
                            Limpar
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    )
}