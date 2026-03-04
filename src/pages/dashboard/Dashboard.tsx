import { useMemo } from 'react'
import { Row, Col, Card, Container } from 'react-bootstrap'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts'
import {
    People, CashStack, BarChart as BarIcon, GeoAlt, GraphUpArrow,
    PieChart as PieChartIcon,
} from 'react-bootstrap-icons'
import { useEmployeeService } from '../employees/services/useEmployeeService'
import { Loading } from '../../components/loading/Loading'
import { EmployeeFilters } from '../employees/components/EmployeeFilters'
import { formatBrazilianCurrency } from '../employees/utils/format.util'

export function Dashboard() {
    const { stats, isLoading, setFilters, allDepartments } = useEmployeeService()

    const chartData = useMemo(() => {
        if (!stats) return null
        return {
            gender: stats.genderDist,
            dept: stats.deptDist,
            cities: [...stats.cityDist].sort((a, b) => Number(b.value) - Number(a.value)).slice(0, 5),
            history: stats.yearDist
        }
    }, [stats])

    const COLORS = ['#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#fd7e14', '#ffc107']

    if (isLoading) return <Loading />
    if (!stats) return null

    return (
        <Container fluid className="mt-4 pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark mb-0">BI & Analytics RH</h2>
                <div className="d-flex align-items-center gap-3">
                    <span className="badge bg-light text-primary border p-2">
                        <GraphUpArrow className="me-1" /> Visão {stats.totalEmployees === 0 ? 'Vazia' : 'Dinâmica'}
                    </span>
                </div>
            </div>

            <EmployeeFilters onSearch={setFilters} onClear={() => setFilters({})} departments={allDepartments} />

            <Row className="mb-4 g-3">
                <Col md={6} lg={3}>
                    <Card className="border-0 shadow-sm border-start border-primary border-4 h-100">
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div><small className="text-muted fw-bold">EQUIPE FILTRADA</small><h3 className="mb-0 fw-bold">{stats.totalEmployees}</h3></div>
                            <People size={32} className="text-primary opacity-50" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={3}>
                    <Card className="border-0 shadow-sm border-start border-success border-4 h-100">
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div><small className="text-muted fw-bold">FOLHA MENSAL</small><h4 className="mb-0 fw-bold">{formatBrazilianCurrency(stats.totalSalary)}</h4></div>
                            <CashStack size={32} className="text-success opacity-50" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={3}>
                    <Card className="border-0 shadow-sm border-start border-info border-4 h-100">
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div><small className="text-muted fw-bold">MÉDIA SALARIAL</small><h3 className="mb-0 fw-bold">{formatBrazilianCurrency(stats.averageSalary)}</h3></div>
                            <GraphUpArrow size={28} className="text-info opacity-50" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={3}>
                    <Card className="border-0 shadow-sm border-start border-warning border-4 h-100">
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div><small className="text-muted fw-bold">CIDADES</small><h3 className="mb-0 fw-bold">{stats.cityDist.length}</h3></div>
                            <GeoAlt size={32} className="text-warning opacity-50" />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {stats.totalEmployees > 0 ? (
                <Row className="g-4">
                    <Col lg={12}>
                        <Card className="border-0 shadow-sm p-4 text-center">
                            <h5 className="fw-bold mb-4 text-start">Fluxo de Admissões (Filtro Atual)</h5>
                            <div className="d-flex justify-content-center overflow-auto">
                                <AreaChart width={1000} height={250} data={chartData?.history}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="value" stroke="#0d6efd" fill="#0d6efd" fillOpacity={0.1} />
                                </AreaChart>
                            </div>
                        </Card>
                    </Col>

                    <Col lg={6}>
                        <Card className="border-0 shadow-sm p-4 h-100 text-center">
                            <h5 className="fw-bold mb-4 text-start"><BarIcon className="me-2 text-primary" />Departamentos</h5>
                            <div className="d-flex justify-content-center overflow-auto">
                                <BarChart width={500} height={300} data={chartData?.dept}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis hide />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#0d6efd" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </div>
                        </Card>
                    </Col>

                    <Col lg={6}>
                        <Card className="border-0 shadow-sm p-4 h-100 text-center">
                            <h5 className="fw-bold mb-4 text-start"><PieChartIcon className="me-2 text-primary" />Gênero</h5>
                            <div className="d-flex justify-content-center">
                                <PieChart width={400} height={300}>
                                    <Pie
                                        data={chartData?.gender}
                                        innerRadius={60}
                                        outerRadius={80}
                                        dataKey="value"
                                        nameKey="name"
                                    >
                                        {chartData?.gender.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </div>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <div className="text-center py-5">
                    <h4 className="text-muted">Nenhum dado encontrado para os filtros aplicados.</h4>
                </div>
            )}
        </Container>
    )
}