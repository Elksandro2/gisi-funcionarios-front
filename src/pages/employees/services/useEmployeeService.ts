import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import EmployeeService from '../../../services/EmployeeService'
import {
    EmployeeResponse,
    EmployeeFilter,
    EmployeeRequest,
    EmployeeStats,
} from '../../../types/Employee'
import { Page } from '../../../types/Page'
import {
    EmployeeCreateFormData,
    EmployeeEditFormData,
} from '../schemas/employee.schema'

export function useEmployeeService() {
    const queryClient = useQueryClient()

    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [sort, setSort] = useState<string>('name,asc')
    const [filters, setFilters] = useState<EmployeeFilter>({})

    const [alert, setAlert] = useState<{
        message: string
        type: 'success' | 'danger'
    } | null>(null)

    const employeeService = useMemo(() => new EmployeeService(), [])

    // Query para buscar a lista de funcionários
    const { data: employeesData, isLoading: isEmployeesLoading } = useQuery<
        Page<EmployeeResponse>,
        Error
    >({
        queryKey: ['employees', currentPage, pageSize, sort, filters],
        queryFn: async () => {
            const params: EmployeeFilter = {
                ...filters,
                page: currentPage - 1,
                size: pageSize,
                sort,
            }
            return await employeeService.findAll(params)
        },
    })

    const { data: statsData, isLoading: isStatsLoading } = useQuery<
        EmployeeStats,
        Error
    >({
        queryKey: ['employee-stats', filters],
        queryFn: () => employeeService.findStats(filters),
    })

    // Mutation para Criar/Editar
    const saveEmployeeMutation = useMutation({
        mutationFn: async ({
            data,
            isEditing,
            id,
        }: {
            data: EmployeeCreateFormData | EmployeeEditFormData
            isEditing: boolean
            id?: number
        }) => {
            if (isEditing && id) {
                return await employeeService.update(id, data as EmployeeRequest)
            }
            return await employeeService.create(data as EmployeeRequest)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] })
            setAlert({
                type: 'success',
                message: 'Funcionário salvo com sucesso!',
            })
        },
        onError: (error: any) => {
            setAlert({
                type: 'danger',
                message:
                    error.response?.data?.message ||
                    'Erro ao salvar funcionário.',
            })
        },
    })

    // Mutation para Deletar
    const deleteEmployeeMutation = useMutation({
        mutationFn: (id: number) => employeeService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] })
            setAlert({
                type: 'success',
                message: 'Funcionário removido com sucesso.',
            })
        },
        onError: () => {
            setAlert({
                type: 'danger',
                message: 'Erro ao remover funcionário.',
            })
        },
    })

    return {
        employees: employeesData?.content || [],
        stats: statsData,
        isLoading:
            isEmployeesLoading ||
            isStatsLoading ||
            saveEmployeeMutation.isPending ||
            deleteEmployeeMutation.isPending,
        alert,
        setAlert,
        saveEmployee: saveEmployeeMutation.mutateAsync,
        deleteEmployee: deleteEmployeeMutation.mutate,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalPages: employeesData?.totalPages || 1,
        sort,
        setSort,
        filters,
        setFilters,
    }
}
