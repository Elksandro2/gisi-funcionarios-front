import { useState } from 'react'
import { EmployeeResponse } from '../../../types/Employee'
import {
    EmployeeCreateFormData,
    EmployeeEditFormData,
} from '../schemas/employee.schema'

export const useEmployeeModel = ({
    saveEmployee,
    deleteEmployee,
}: {
    saveEmployee: (params: {
        data: EmployeeCreateFormData | EmployeeEditFormData
        isEditing: boolean
        id?: number
    }) => Promise<EmployeeResponse | void>
    deleteEmployee: (id: number) => void
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [currentEmployeeId, setCurrentEmployeeId] = useState<number | null>(
        null
    )
    const [initialEmployeeData, setInitialEmployeeData] =
        useState<EmployeeEditFormData | null>(null)

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(
        null
    )

    const handleSaveEmployee = async (
        data: EmployeeCreateFormData | EmployeeEditFormData
    ): Promise<EmployeeResponse | void> => {
        return await saveEmployee({
            data,
            isEditing,
            id: currentEmployeeId || undefined,
        })
    }

    const handleEditEmployee = (employee: EmployeeResponse) => {
        setInitialEmployeeData({
            name: employee.name,
            email: employee.email,
            gender: employee.gender,
            role: employee.role,
            department: employee.department,
            salary: employee.salary,
            admissionDate: employee.admissionDate,
            address: {
                street: employee.address.street,
                number: employee.address.number,
                neighborhood: employee.address.neighborhood,
                city: employee.address.city,
                state: employee.address.state,
                zipCode: employee.address.zipCode,
                country: employee.address.country,
            },
        })
        setCurrentEmployeeId(employee.id)
        setIsEditing(true)
        setIsModalOpen(true)
    }

    const handleDeleteRequest = (id: number) => {
        setEmployeeToDelete(id)
        setShowDeleteConfirm(true)
    }

    const confirmDelete = () => {
        if (employeeToDelete !== null) {
            deleteEmployee(employeeToDelete)
            setShowDeleteConfirm(false)
            setEmployeeToDelete(null)
        }
    }

    const cancelDelete = () => {
        setShowDeleteConfirm(false)
        setEmployeeToDelete(null)
    }

    const resetModal = () => {
        setInitialEmployeeData(null)
        setCurrentEmployeeId(null)
        setIsEditing(false)
        setIsModalOpen(false)
    }

    return {
        isModalOpen,
        setIsModalOpen,
        isEditing,
        initialEmployeeData,
        showDeleteConfirm,
        handleSaveEmployee,
        handleEditEmployee,
        handleDeleteRequest,
        confirmDelete,
        cancelDelete,
        resetModal,
    }
}
