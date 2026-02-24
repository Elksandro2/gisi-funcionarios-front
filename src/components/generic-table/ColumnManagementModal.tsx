import { Modal, Form, Button } from 'react-bootstrap'
import { TableColumn } from './GenericTable'

interface ColumnManagementModalProps {
    show: boolean
    onHide: () => void
    initialColumns: TableColumn[]
    draggableColumns: TableColumn[]
    onColumnToggle: (columnKey: string, isChecked: boolean) => void
    onActivateAll: () => void
    onDeactivateAll: () => void
}

export function ColumnManagementModal({
    show,
    onHide,
    initialColumns,
    draggableColumns,
    onColumnToggle,
    onActivateAll,
    onDeactivateAll,
}: ColumnManagementModalProps) {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Gerenciar Colunas</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="text-muted mb-3">
                    Ative ou desative as colunas que deseja exibir na tabela
                </p>

                {initialColumns.map((column) => {
                    const isFixedOrActions =
                        column.key === 'actions' || column.fixed
                    const isChecked = isFixedOrActions
                        ? true
                        : draggableColumns.some((c) => c.key === column.key)

                    return (
                        <div key={column.key} className="mb-2">
                            <Form.Check
                                type="switch"
                                id={`column-${column.key}`}
                                label={column.label}
                                checked={isChecked}
                                disabled={isFixedOrActions}
                                onChange={(e) =>
                                    onColumnToggle(column.key, e.target.checked)
                                }
                                className={isFixedOrActions ? 'opacity-75' : ''}
                            />
                        </div>
                    )
                })}
            </Modal.Body>

            <Modal.Footer>
                <div className="d-flex gap-2">
                    <Button variant="success" size="sm" onClick={onActivateAll}>
                        Ativar Todos
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={onDeactivateAll}
                    >
                        Desativar Todos
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}
