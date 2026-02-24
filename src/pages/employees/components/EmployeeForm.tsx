import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Row, Col, Button } from 'react-bootstrap'
import {
    employeeCreateSchema,
    EmployeeCreateFormData,
} from '../schemas/employee.schema'
import { Gender } from '../../../types/Employee'
import { NumericFormat } from 'react-number-format'

interface EmployeeFormProps {
    initialData?: EmployeeCreateFormData
    onSubmit: (data: EmployeeCreateFormData) => Promise<void>
    onCancel: () => void
}

export function EmployeeForm({
    initialData,
    onSubmit,
    onCancel,
}: EmployeeFormProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<EmployeeCreateFormData>({
        resolver: yupResolver(employeeCreateSchema),
        defaultValues: initialData,
    })

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <h5 className="mb-3 text-primary border-bottom pb-2">
                Dados Pessoais
            </h5>
            <Row className="mb-3">
                <Form.Group as={Col} md={6}>
                    <Form.Label>Nome Completo</Form.Label>
                    <Form.Control
                        type="text"
                        {...register('name')}
                        isInvalid={!!errors.name}
                        placeholder="Ex: João Silva"
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.name?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md={6}>
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control
                        type="email"
                        {...register('email')}
                        isInvalid={!!errors.email}
                        placeholder="joao@empresa.com"
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.email?.message}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>

            <Row className="mb-3">
                <Form.Group as={Col} md={4}>
                    <Form.Label>Gênero</Form.Label>
                    <Form.Select
                        {...register('gender')}
                        isInvalid={!!errors.gender}
                    >
                        <option value="">Selecione...</option>
                        <option value={Gender.MASCULINO}>Masculino</option>
                        <option value={Gender.FEMININO}>Feminino</option>
                        <option value={Gender.OUTRO}>Outro</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {errors.gender?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md={4}>
                    <Form.Label>Cargo</Form.Label>
                    <Form.Control
                        type="text"
                        {...register('role')}
                        isInvalid={!!errors.role}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.role?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md={4}>
                    <Form.Label>Departamento</Form.Label>
                    <Form.Control
                        type="text"
                        {...register('department')}
                        isInvalid={!!errors.department}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.department?.message}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>

            <Row className="mb-4">
                <Form.Group as={Col} md={6}>
                    <Form.Label>Salário</Form.Label>
                    <Controller
                        name="salary"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <NumericFormat
                                className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
                                thousandSeparator="."
                                decimalSeparator=","
                                prefix="R$ "
                                allowNegative={false}
                                decimalScale={2}
                                fixedDecimalScale
                                value={value}
                                onValueChange={(values) =>
                                    onChange(values.floatValue)
                                }
                            />
                        )}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.salary?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md={6}>
                    <Form.Label>Data de Admissão</Form.Label>
                    <Form.Control
                        type="date"
                        {...register('admissionDate')}
                        isInvalid={!!errors.admissionDate}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.admissionDate?.message}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>

            <h5 className="mb-3 text-primary border-bottom pb-2">Endereço</h5>
            <Row className="mb-3">
                <Form.Group as={Col} md={3}>
                    <Form.Label>CEP</Form.Label>
                    <Form.Control
                        type="text"
                        {...register('address.zipCode')}
                        isInvalid={!!errors.address?.zipCode}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.address?.zipCode?.message}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md={7}>
                    <Form.Label>Rua</Form.Label>
                    <Form.Control
                        type="text"
                        {...register('address.street')}
                        isInvalid={!!errors.address?.street}
                    />
                </Form.Group>
                <Form.Group as={Col} md={2}>
                    <Form.Label>Nº</Form.Label>
                    <Form.Control
                        type="text"
                        {...register('address.number')}
                        isInvalid={!!errors.address?.number}
                    />
                </Form.Group>
            </Row>

            <Row className="mb-4">
                <Form.Group as={Col} md={5}>
                    <Form.Label>Bairro</Form.Label>
                    <Form.Control
                        type="text"
                        {...register('address.neighborhood')}
                        isInvalid={!!errors.address?.neighborhood}
                    />
                </Form.Group>
                <Form.Group as={Col} md={5}>
                    <Form.Label>Cidade</Form.Label>
                    <Form.Control
                        type="text"
                        {...register('address.city')}
                        isInvalid={!!errors.address?.city}
                    />
                </Form.Group>
                <Form.Group as={Col} md={2}>
                    <Form.Label>UF</Form.Label>
                    <Form.Control
                        type="text"
                        maxLength={2}
                        {...register('address.state')}
                        isInvalid={!!errors.address?.state}
                    />
                </Form.Group>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4 border-top pt-3">
                <Button
                    variant="link"
                    className="text-decoration-none text-muted"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancelar
                </Button>
                <Button variant="success" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : 'Salvar Funcionário'}
                </Button>
            </div>
        </Form>
    )
}