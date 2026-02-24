import React from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { Controller, Path, UseFormReturn, FieldValues } from 'react-hook-form'

/**
 * Interface para definir os campos de filtro no modal de busca avançada.
 * @template TFilter - O tipo do objeto de filtro.
 */
export interface FilterField<TFilter> {
    /**
     * Campo do filtro, que deve ser uma chave de TFilter.
     */
    name: Path<TFilter>
    /**
     * Chave para agrupar campos relacionados. Campos com o mesmo valor de "group" dispostas lado a lado no modal.
     * Ex.: "pickUpDate" para agrupar "pickUpDateStart" e "pickUpDateEnd".
     */
    group?: string
    /**
     * O rótulo a ser exibido para o campo de filtro no modal de busca avançada.
     */
    label: string
    /**
     * Tipo do campo de filtro, que determina o tipo de input a ser renderizado no modal de busca avançada.
     */
    type: 'text' | 'number' | 'date' | 'select' | 'radio'
    /**
     * Opções para campos do tipo "select" ou "radio". Cada opção deve conter um valor e um rótulo a ser exibido.
     */
    options?: { value: string | number; label: string }[]
}

/**
 * Interface para definir filtros pré-definidos que podem ser aplicados rapidamente no modal de busca avançada.
 * @template TFilter - O tipo do objeto de filtro.
 */
export interface PresetFilter<TFilter> {
    /**
     * Nome do filtro pré-definido, usado para identificar o filtro e exibir seu nome na interface.
     */
    label: string
    /**
     * Dados do filtro pré-definido, que devem corresponder à estrutura de TFilter. Esses dados serão aplicados quando o filtro pré-definido for selecionado.
     */
    data: TFilter
}

interface AdvancedSearchModalProps<TFilter extends FieldValues> {
    show: boolean
    onHide: () => void
    filterFields: FilterField<TFilter>[]
    formMethods: UseFormReturn<TFilter>
    onSubmit: (data: TFilter) => void
    children?: React.ReactNode
}

export function AdvancedSearchModal<TFilter extends FieldValues>({
    show,
    onHide,
    filterFields,
    formMethods,
    onSubmit,
    children,
}: AdvancedSearchModalProps<TFilter>) {
    const { control, handleSubmit } = formMethods

    // Se children foi passado como modal customizado, usa ele
    if (children && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement, {
            show,
            onHide,
        })
    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Busca Avançada</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {filterFields.map(({ name, label, type, options }) => (
                        <Form.Group
                            className="mb-3"
                            key={name}
                            controlId={name}
                        >
                            <Form.Label>{label}</Form.Label>
                            <Controller
                                name={name}
                                control={control}
                                render={({ field }) => {
                                    const fieldValue = field.value ?? ''
                                    return type === 'select' && options ? (
                                        <Form.Select
                                            {...field}
                                            value={
                                                fieldValue as string | number
                                            }
                                            onChange={(e) =>
                                                field.onChange(e.target.value)
                                            }
                                        >
                                            <option value="">
                                                Selecione...
                                            </option>
                                            {options.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    ) : (
                                        <Form.Control
                                            type={type}
                                            placeholder={label}
                                            {...field}
                                            value={
                                                fieldValue as string | number
                                            }
                                            onChange={(e) =>
                                                field.onChange(e.target.value)
                                            }
                                        />
                                    )
                                }}
                            />
                        </Form.Group>
                    ))}
                    <div className="d-flex justify-content-end">
                        <Button
                            variant="primary"
                            type="submit"
                            className="ms-2"
                        >
                            Buscar
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
