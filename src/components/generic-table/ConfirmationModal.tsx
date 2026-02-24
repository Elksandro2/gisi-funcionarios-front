import { Modal, Button } from 'react-bootstrap'

interface ConfirmationModalProps {
    show: boolean
    onHide: () => void
    onConfirm: () => void
    message: string
    title?: string
}

export function ConfirmationModal({
    show,
    onHide,
    onConfirm,
    message,
    title = 'Confirmação',
}: ConfirmationModalProps) {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={onConfirm}>
                    Continuar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
