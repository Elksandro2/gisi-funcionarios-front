import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Row, Col, Card, Container } from 'react-bootstrap'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
    PieChart, Pie, AreaChart, Area,
    Cell,
    ResponsiveContainer,
} from 'recharts'
import {
    People, CashStack, BarChart as BarIcon, GeoAlt, GraphUpArrow,
    PieChart as PieChartIcon,
    Coin} from 'react-bootstrap-icons'
import { useEmployeeService } from '../employees/services/useEmployeeService'
import { Loading } from '../../components/loading/Loading'
import { EmployeeFilters } from '../employees/components/EmployeeFilters'
import { formatBrazilianCurrencyCompact } from '../employees/utils/format.util'
import EmployeeService from '../../services/EmployeeService'

export function Dashboard() {
    const { stats, isLoading, setFilters, allDepartments, filters } = useEmployeeService()
    const employeeService = useMemo(() => new EmployeeService(), [])

    const { data: filteredEmployees = [] } = useQuery({
        queryKey: ['dashboard-all-employees', filters],
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            const response = await employeeService.findAll({
                ...filters,
                page: 0,
                size: 10000,
                sort: 'name,asc',
            })

            return response.content
        },
    })

    const chartData = useMemo(() => {
        if (!stats) return null

        const topCities = [...stats.cityDist]
            .sort((a, b) => Number(b.value) - Number(a.value))
            .slice(0, 5)

        const salaryBands = [
            { name: 'Até 2,5k', min: 0, max: 2500, value: 0 },
            { name: '2,5k - 5k', min: 2500, max: 5000, value: 0 },
            { name: '5k - 8k', min: 5000, max: 8000, value: 0 },
            { name: 'Acima de 8k', min: 8000, max: Number.POSITIVE_INFINITY, value: 0 },
        ].map((band) => ({
            ...band,
            value: filteredEmployees.filter(
                (employee) => employee.salary >= band.min && employee.salary < band.max,
            ).length,
        }))

        return {
            history: stats.yearDist,
            dept: stats.deptDist,
            gender: stats.genderDist,
            cities: topCities,
            salaryBands,
        }
    }, [filteredEmployees, stats])

    const COLORS = ['#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#fd7e14', '#ffc107']

    if (isLoading) return <Loading />
    if (!stats) return null

    return (
        <Container fluid className="mt-4 pb-5 dashboard-page">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
                <h2 className="fw-bold text-dark mb-0">Painel SG</h2>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                    <span className="badge bg-light text-primary border p-2">
                        <GraphUpArrow className="me-1" /> Dados em Tempo Real
                    </span>
                </div>
            </div>

            <EmployeeFilters onSearch={setFilters} onClear={() => setFilters({})} departments={allDepartments} currentFilters={filters} />

            <Row className="mb-4 g-3">
                <Col xs={12} md={6} lg={3}>
                    <Card className="border-0 shadow-sm border-start border-primary border-4 h-100">
                        <Card.Body className="d-flex justify-content-between align-items-center gap-3">
                            <div><small className="text-muted fw-bold">EQUIPE</small><h3 className="mb-0 fw-bold">{stats.totalEmployees}</h3></div>
                            <People size={32} className="text-primary" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={6} lg={3}>
                    <Card className="border-0 shadow-sm border-start border-success border-4 h-100">
                        <Card.Body className="d-flex justify-content-between align-items-center gap-3">
                            <div><small className="text-muted fw-bold">FOLHA MENSAL</small><h3 className="mb-0 fw-bold" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%'}}>{formatBrazilianCurrencyCompact(stats.totalSalary)}</h3></div>
                            <CashStack size={32} className="text-success" style={{flexShrink: 0}} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={6} lg={3}>
                    <Card className="border-0 shadow-sm border-start border-info border-4 h-100">
                        <Card.Body className="d-flex justify-content-between align-items-center gap-3">
                            <div><small className="text-muted fw-bold">MÉDIA SALARIAL</small><h3 className="mb-0 fw-bold" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%'}}>{formatBrazilianCurrencyCompact(stats.averageSalary)}</h3></div>
                            <GraphUpArrow size={28} className="text-info" style={{flexShrink: 0}} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={6} lg={3}>
                    <Card className="border-0 shadow-sm border-start border-warning border-4 h-100">
                        <Card.Body className="d-flex justify-content-between align-items-center gap-3">
                            <div><small className="text-muted fw-bold">CIDADES</small><h3 className="mb-0 fw-bold">{stats.cityDist.length}</h3></div>
                            <GeoAlt size={32} className="text-warning" />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {stats.totalEmployees > 0 ? (
                <Row className="g-4">
                    <Col lg={12}>
                        <Card className="border-0 shadow-sm p-4 text-center">
                            <h5 className="fw-bold mb-4 text-start">Fluxo de Admissões</h5>
                            <div className="dashboard-chart">
                                <ResponsiveContainer width="100%" height={280}>
                                    <AreaChart data={chartData?.history ?? []}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip labelFormatter={(label) => `Ano: ${label}`} />
                                        <Area name="Admissões" type="monotone" dataKey="value" stroke="#0d6efd" fill="#0d6efd" fillOpacity={0.1} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>

                    <Col lg={6}>
                        <Card className="border-0 shadow-sm p-4 h-100 text-center">
                            <h5 className="fw-bold mb-4 text-start"><BarIcon className="me-2 text-primary" />Departamentos</h5>
                            <div className="dashboard-chart">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData?.dept ?? []}>
                                        <XAxis dataKey="name" />
                                        <YAxis hide />
                                        <Tooltip />
                                        <Bar name="Funcionários" dataKey="value" fill="#0d6efd" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>

                    <Col lg={6}>
                        <Card className="border-0 shadow-sm p-4 h-100 text-center">
                            <h5 className="fw-bold mb-4 text-start"><PieChartIcon className="me-2 text-primary" />Gênero</h5>
                            <div className="dashboard-chart">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={chartData?.gender ?? []}
                                            innerRadius={60}
                                            outerRadius={90}
                                            dataKey="value"
                                            nameKey="name"
                                        >
                                            {(chartData?.gender ?? []).map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [value, 'Quantidade']} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>

                    <Col lg={6}>
                        <Card className="border-0 shadow-sm p-4 h-100 text-center">
                            <h5 className="fw-bold mb-4 text-start"><GeoAlt className="me-2 text-primary" />Top 5 Cidades</h5>
                            <div className="dashboard-chart">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData?.cities ?? []} layout="vertical" margin={{ left: 10, right: 24 }}>
                                        <XAxis type="number" allowDecimals={false} />
                                        <YAxis type="category" dataKey="name" width={100} />
                                        <Tooltip />
                                        <Bar name="Funcionários" dataKey="value" fill="#0b5ed7" radius={[0, 8, 8, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>

                    <Col lg={6}>
                        <Card className="border-0 shadow-sm p-4 h-100 text-center">
                            <h5 className="fw-bold mb-4 text-start"><Coin className="me-2 text-primary" /> Faixa Salarial</h5>
                            <div className="dashboard-chart">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData?.salaryBands ?? []} margin={{ left: 8, right: 12 }}>
                                        <XAxis dataKey="name" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar name="Funcionários" dataKey="value" fill="#198754" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
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