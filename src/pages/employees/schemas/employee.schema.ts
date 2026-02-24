import * as yup from 'yup'
import { Gender } from '../../../types/Employee'

const addressSchema = yup.object().shape({
    street: yup.string().required('Rua é obrigatória'),
    number: yup.string().required('Número é obrigatório'),
    neighborhood: yup.string().required('Bairro é obrigatório'),
    city: yup.string().required('Cidade é obrigatória'),
    state: yup.string().required('Estado é obrigatório').length(2, 'Use a sigla (ex: PB)'),
    zipCode: yup
        .string()
        .required('CEP é obrigatório')
        .matches(/^\d{5}-?\d{3}$/, 'CEP inválido'),
    country: yup.string().default('Brasil'),
})

const baseEmployeeSchema = {
    name: yup
        .string()
        .required('Nome é obrigatório')
        .min(3, 'Mínimo de 3 caracteres')
        .max(100, 'Máximo de 100 caracteres'),
    email: yup
        .string()
        .email('E-mail inválido')
        .required('E-mail é obrigatório'),
    gender: yup
        .mixed<Gender>()
        .oneOf(Object.values(Gender), 'Selecione um gênero válido')
        .required('Gênero é obrigatório'),
    role: yup.string().required('Cargo é obrigatório'),
    department: yup.string().required('Departamento é obrigatório'),
    salary: yup
        .number()
        .typeError('Salário deve ser um número')
        .min(0, 'Salário não pode ser negativo')
        .required('Salário é obrigatório'),
    admissionDate: yup
        .string()
        .required('Data de admissão é obrigatória'),
    address: addressSchema,
}

export const employeeCreateSchema = yup.object().shape({
    ...baseEmployeeSchema,
})

export const employeeEditSchema = yup.object().shape({
    ...baseEmployeeSchema,
})

export type EmployeeCreateFormData = yup.InferType<typeof employeeCreateSchema>
export type EmployeeEditFormData = yup.InferType<typeof employeeEditSchema>