import { Button, Modal } from 'react-bootstrap'
import { PencilSquare, Trash } from 'react-bootstrap-icons'
import GenericTable, { TableColumn } from '../../components/generic-table/GenericTable'
import { Loading } from '../../components/loading/Loading'
import { AlertBox } from '../../components/alert-box/AlertBox'
import { useEmployeeService } from './services/useEmployeeService'
import { useEmployeeModel } from './models/employee.model'
import { EmployeeResponse } from '../../types/Employee'
import { EmployeeForm } from './components/EmployeeForm'
import { EmployeeFilters } from './components/EmployeeFilters'
import { formatBrazilianCurrency } from './utils/format.util'
import { EmployeeStats } from './components/EmployeeStats'

export function Employees() {
    const {
        employees, stats, isLoading, alert, setAlert, saveEmployee, deleteEmployee,
        currentPage, setCurrentPage, pageSize, setPageSize, totalPages,
        sort, setSort, setFilters, allDepartments,
    } = useEmployeeService()

    const {
        isModalOpen, isEditing, initialEmployeeData, handleSaveEmployee,
        handleEditEmployee, handleDeleteRequest, showDeleteConfirm,
        confirmDelete, cancelDelete, resetModal, setIsModalOpen,
    } = useEmployeeModel({ saveEmployee, deleteEmployee })

    const columns: TableColumn[] = [
        { label: 'Nome', key: 'name', sortable: true },
        { label: 'Cargo', key: 'role', sortable: true },
        { label: 'Departamento', key: 'department', sortable: true },
        { label: 'Salário', key: 'salary', sortable: true },
        { label: 'Admissão', key: 'admissionDate', sortable: true },
        { label: 'Ações', key: 'actions', sortable: false },
    ]

    const renderRow = (employee: EmployeeResponse, columns: TableColumn[]) => (
        <>
            {columns.map((column) => (
                <td key={column.key}>
                    {column.key === 'name' && employee.name}
                    {column.key === 'role' && employee.role}
                    {column.key === 'department' && employee.department}
                    {column.key === 'salary' && formatBrazilianCurrency(employee.salary)}
                    {column.key === 'admissionDate' && new Date(employee.admissionDate).toLocaleDateString('pt-BR')}
                    {column.key === 'actions' && (
                        <div className="d-flex gap-2 justify-content-center">
                            <Button variant="outline-primary" size="sm" onClick={() => handleEditEmployee(employee)}>
                                <PencilSquare />
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteRequest(employee.id)}>
                                <Trash />
                            </Button>
                        </div>
                    )}
                </td>
            ))}
        </>
    )

    return (
        <div className="container-fluid mt-4 pb-5">
            {isLoading && <Loading />}

            {alert && (
                <AlertBox
                    message={alert.message}
                    type={alert.type as 'success' | 'danger' | 'warning'}
                    onClose={() => setAlert(null)}
                />
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark mb-0">Gestão de Funcionários</h2>
                <Button variant="success" className="shadow-sm" onClick={() => setIsModalOpen(true)}>
                    <i className="bi bi-plus-lg me-2"></i>Novo Funcionário
                </Button>
            </div>

            <EmployeeStats stats={stats} />

            <EmployeeFilters
                onSearch={setFilters}
                onClear={() => setFilters({})}
                departments={allDepartments}
            />

            <GenericTable<EmployeeResponse>
                columns={columns}
                data={employees}
                onSort={(key, order) => setSort(`${key},${order}`)}
                sortKey={sort.split(',')[0]}
                sortOrder={sort.split(',')[1]}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                setPageSize={setPageSize}
                renderRow={renderRow}
            />

            <Modal show={showDeleteConfirm} onHide={cancelDelete} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Tem certeza que deseja excluir este funcionário? <strong>Esta ação não pode ser desfeita.</strong>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={cancelDelete}>Cancelar</Button>
                    <Button variant="danger" onClick={confirmDelete}>Excluir Agora</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={isModalOpen} onHide={resetModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">{isEditing ? 'Editar Funcionário' : 'Novo Cadastro'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EmployeeForm
                        initialData={initialEmployeeData || undefined}
                        onCancel={resetModal}
                        onSubmit={async (data) => {
                            await handleSaveEmployee(data)
                            resetModal()
                        }}
                    />
                </Modal.Body>
            </Modal>
        </div>
    )
}