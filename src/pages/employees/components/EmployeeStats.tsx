import { Row, Col, Card } from 'react-bootstrap'
import { People, CashStack, GraphUpArrow } from 'react-bootstrap-icons'
import { formatBrazilianCurrency } from '../utils/format.util'
import type { EmployeeStats as EmployeeStatsData } from '../../../types/Employee';

interface EmployeeStatsProps {
    stats?: EmployeeStatsData
}

export function EmployeeStats({ stats }: EmployeeStatsProps) {
    if (!stats) return null;

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
                            <h3 className="mb-0 fw-bold">{stats.totalEmployees}</h3>
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
                            <h6 className="mb-0 opacity-75">Folha Mensal Total</h6>
                            <h3 className="mb-0 fw-bold">{formatBrazilianCurrency(stats.totalSalary)}</h3>
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            <Col md={4}>
                <Card className="border-0 shadow-sm bg-info text-white">
                    <Card.Body className="d-flex align-items-center">
                        <div className="rounded-circle bg-white bg-opacity-25 p-3 me-3">
                            <GraphUpArrow size={20} />
                        </div>
                        <div>
                            <h6 className="mb-0 opacity-75">Média Salarial Global</h6>
                            <h3 className="mb-0 fw-bold">{formatBrazilianCurrency(stats.averageSalary)}</h3>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}