import api from './ApiService'
import { EmployeeResponse, EmployeeRequest, EmployeeFilter } from '../types/Employee'
import { Page } from '../types/Page'

class EmployeeService {
    private readonly endpoint = '/employees'

    async findAll(filters: EmployeeFilter): Promise<Page<EmployeeResponse>> {
        const { data } = await api.get<Page<EmployeeResponse>>(this.endpoint, {
            params: filters,
        })
        return data
    }

    async findById(id: number): Promise<EmployeeResponse> {
        const { data } = await api.get<EmployeeResponse>(`${this.endpoint}/${id}`)
        return data
    }

    async create(request: EmployeeRequest): Promise<EmployeeResponse> {
        const { data } = await api.post<EmployeeResponse>(this.endpoint, request)
        return data
    }

    async update(id: number, request: EmployeeRequest): Promise<EmployeeResponse> {
        const { data } = await api.put<EmployeeResponse>(`${this.endpoint}/${id}`, request)
        return data
    }

    async delete(id: number): Promise<void> {
        await api.delete(`${this.endpoint}/${id}`)
    }
}

export default EmployeeService