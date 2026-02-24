import { AddressRequest, AddressResponse } from "./Address"

export enum Gender {
    MASCULINO = 'MASCULINO',
    FEMININO = 'FEMININO',
    OUTRO = 'OUTRO',
}

export interface EmployeeResponse {
    id: number
    name: string
    email: string
    gender: Gender
    role: string
    department: string
    salary: number
    admissionDate: string
    address: AddressResponse
}

export interface EmployeeRequest {
    name: string
    email: string
    gender: Gender
    role: string
    department: string
    salary: number
    admissionDate: string
    address: AddressRequest
}

export interface EmployeeFilter {
    name?: string
    email?: string
    department?: string
    role?: string
    gender?: Gender
    minSalary?: number
    maxSalary?: number
    admissionDateStart?: string
    admissionDateEnd?: string
    page?: number
    size?: number
    sort?: string
}