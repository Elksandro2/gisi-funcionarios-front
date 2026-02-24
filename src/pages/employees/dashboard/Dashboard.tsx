import { useMemo } from 'react'
import { Row, Col, Card, Container } from 'react-bootstrap'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from 'recharts'
import {
    People,
    CashStack,
    BarChart as BarIcon,
    GeoAlt,
    CalendarCheck,
    GraphUpArrow,
    PieChart as PieChartIcon,
} from 'react-bootstrap-icons'
import { Loading } from '../../../components/loading/Loading'
import { formatBrazilianCurrency } from '../utils/format.util'
import { useEmployeeService } from '../services/useEmployeeService'
import { EmployeeFilters } from '../components/EmployeeFilters'

export function Dashboard() {
    const { employees, isLoading, setFilters } = useEmployeeService()

    const chartData = useMemo(() => {
        if (!employees || employees.length === 0) return null

        const genderCounts: Record<string, number> = {}
        const cityCounts: Record<string, number> = {}
        const deptSalary: Record<string, { total: number; count: number }> = {}
        const hireHistory: Record<string, number> = {}

        employees.forEach((emp) => {
            // Gênero - CORRIGIDO AQUI
            genderCounts[emp.gender] = (genderCounts[emp.gender] || 0) + 1

            const city = emp.address.city || 'Não Informado'
            cityCounts[city] = (cityCounts[city] || 0) + 1

            if (!deptSalary[emp.department])
                deptSalary[emp.department] = { total: 0, count: 0 }
            deptSalary[emp.department].total += emp.salary
            deptSalary[emp.department].count += 1

            const year = new Date(emp.admissionDate).getFullYear().toString()
            hireHistory[year] = (hireHistory[year] || 0) + 1
        })

        return {
            gender: Object.entries(genderCounts).map(([name, value]) => ({
                name,
                value,
            })),
            deptSalary: Object.entries(deptSalary).map(([name, val]) => ({
                name,
                media: parseFloat((val.total / val.count).toFixed(2)),
            })),
            cities: Object.entries(cityCounts)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 5),
            history: Object.entries(hireHistory)
                .map(([year, value]) => ({ year, value }))
                .sort((a, b) => a.year.localeCompare(b.year)),
        }
    }, [employees])

    const summary = useMemo(() => {
        if (!employees.length) return { totalSalary: 0, avgTenure: '0' }
        const totalSalary = employees.reduce((acc, e) => acc + e.salary, 0)
        const totalYears = employees.reduce((acc, e) => {
            const diff =
                new Date().getTime() - new Date(e.admissionDate).getTime()
            return acc + diff / (1000 * 60 * 60 * 24 * 365.25)
        }, 0)
        return {
            totalSalary,
            avgTenure: (totalYears / employees.length).toFixed(1),
        }
    }, [employees])

    const COLORS = [
        '#0d6efd',
        '#6610f2',
        '#6f42c1',
        '#d63384',
        '#fd7e14',
        '#ffc107',
    ]

    if (isLoading) return <Loading />

    return (
        <Container fluid className="mt-4 pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark mb-0">BI & Analytics RH</h2>
                <span className="badge bg-white text-primary border border-primary p-2 d-flex align-items-center gap-2">
                    <GraphUpArrow /> Dashboard Dinâmico
                </span>
            </div>

            <EmployeeFilters
                onSearch={setFilters}
                onClear={() => setFilters({})}
            />

            <Row className="mb-4 g-3">
                <Col md={6} lg={3}>
                    <Card className="border-0 shadow-sm border-start border-primary border-4 h-100">
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <small className="text-muted fw-bold">
                                    EQUIPE TOTAL
                                </small>
                                <h3 className="mb-0 fw-bold">
                                    {employees.length}
                                </h3>
                            </div>
                            <People
                                size={32}
                                className="text-primary opacity-50"
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={3}>
                    <Card className="border-0 shadow-sm border-start border-success border-4 h-100">
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <small className="text-muted fw-bold">
                                    FOLHA MENSAL
                                </small>
                                <h4 className="mb-0 fw-bold">
                                    {formatBrazilianCurrency(
                                        summary.totalSalary
                                    )}
                                </h4>
                            </div>
                            <CashStack
                                size={32}
                                className="text-success opacity-50"
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={3}>
                    <Card className="border-0 shadow-sm border-start border-info border-4 h-100">
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <small className="text-muted fw-bold">
                                    MÉDIA DE CASA
                                </small>
                                <h3 className="mb-0 fw-bold">
                                    {summary.avgTenure} Anos
                                </h3>
                            </div>
                            <CalendarCheck
                                size={32}
                                className="text-info opacity-50"
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={3}>
                    <Card className="border-0 shadow-sm border-start border-warning border-4 h-100">
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <small className="text-muted fw-bold">
                                    CIDADES
                                </small>
                                <h3 className="mb-0 fw-bold">
                                    {chartData?.cities.length || 0}
                                </h3>
                            </div>
                            <GeoAlt
                                size={32}
                                className="text-warning opacity-50"
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                <Col lg={12}>
                    <Card className="border-0 shadow-sm p-4">
                        <h5 className="fw-bold mb-4 text-dark">
                            Fluxo de Admissões por Ano
                        </h5>
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <AreaChart data={chartData?.history}>
                                    <defs>
                                        <linearGradient
                                            id="colorValue"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#0d6efd"
                                                stopOpacity={0.2}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#0d6efd"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f0f0f0"
                                    />
                                    <XAxis
                                        dataKey="year"
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#0d6efd"
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>

                <Col lg={7}>
                    <Card className="border-0 shadow-sm p-4 h-100">
                        <h5 className="fw-bold mb-4 text-dark">
                            <BarIcon className="me-2 text-primary" />
                            Média Salarial por Depto.
                        </h5>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData?.deptSalary}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f0f0f0"
                                    />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: '#f8f9fa' }}
                                        formatter={(val: any) =>
                                            formatBrazilianCurrency(Number(val))
                                        }
                                    />
                                    <Bar
                                        dataKey="media"
                                        fill="#0d6efd"
                                        radius={[6, 6, 0, 0]}
                                        barSize={45}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>

                <Col lg={5}>
                    <Card className="border-0 shadow-sm p-4 h-100">
                        <h5 className="fw-bold mb-4 text-dark">
                            <PieChartIcon className="me-2 text-primary" />
                            Distribuição por Gênero
                        </h5>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={chartData?.gender}
                                        innerRadius={70}
                                        outerRadius={95}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData?.gender.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
