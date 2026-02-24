import { Row, Col, Card } from 'react-bootstrap'
import { People, CashStack } from 'react-bootstrap-icons'
import { EmployeeResponse } from '../../../types/Employee'
import { formatBrazilianCurrency } from '../utils/format.util'

interface EmployeeStatsProps {
    employees: EmployeeResponse[]
}

export function EmployeeStats({ employees }: EmployeeStatsProps) {
    const totalEmployees = employees.length
    const totalSalary = employees.reduce((acc, emp) => acc + emp.salary, 0)
    const avgSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0

    return (
        <Row className="mb-4 g-3">
            <Col md={4}>
                <Card className="border-0 shadow-sm bg-primary text-white">
                    <Card.Body className="d-flex align-items-center">
                        <div className="rounded-circle bg-white bg-opacity-25 p-3 me-3">
                            <People size={24} />
                        </div>
                        <div>
                            <h6 className="mb-0 opacity-75">Total de Funcionários</h6>
                            <h3 className="mb-0 fw-bold">{totalEmployees}</h3>
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            <Col md={4}>
                <Card className="border-0 shadow-sm bg-success text-white">
                    <Card.Body className="d-flex align-items-center">
                        <div className="rounded-circle bg-white bg-opacity-25 p-3 me-3">
                            <CashStack size={24} />
                        </div>
                        <div>
                            <h6 className="mb-0 opacity-75">Folha Mensal</h6>
                            <h3 className="mb-0 fw-bold">{formatBrazilianCurrency(totalSalary)}</h3>
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            <Col md={4}>
                <Card className="border-0 shadow-sm bg-info text-white">
                    <Card.Body className="d-flex align-items-center">
                        <div className="rounded-circle bg-white bg-opacity-25 p-3 me-3">
                            <i className="bi bi-graph-up-arrow" style={{ fontSize: '17px' }}></i>
                        </div>
                        <div>
                            <h6 className="mb-0 opacity-75">Média Salarial</h6>
                            <h3 className="mb-0 fw-bold">{formatBrazilianCurrency(avgSalary)}</h3>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}