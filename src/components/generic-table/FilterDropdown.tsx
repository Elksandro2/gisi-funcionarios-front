import { useState } from 'react'
import { Dropdown, Form, Button } from 'react-bootstrap'
import { Controller, FieldValues, UseFormReturn } from 'react-hook-form'
import { FilterField, PresetFilter } from './AdvancedSearchModal'

interface FilterDropdownProps<TFilter extends FieldValues> {
    filterFields: FilterField<TFilter>[]
    presetFilters?: PresetFilter<TFilter>[]
    formMethods: UseFormReturn<TFilter>
    onApply: (data: TFilter) => void
    onClear: () => void
    appliedFiltersCount: number
}

export function FilterDropdown<TFilter extends FieldValues>({
    filterFields,
    presetFilters,
    formMethods,
    onApply,
    onClear,
    appliedFiltersCount,
}: FilterDropdownProps<TFilter>) {
    const [isOpen, setIsOpen] = useState(false)
    const [activePresets, setActivePresets] = useState<Set<string>>(new Set())
    const { control, handleSubmit, getValues, reset } = formMethods

    const handleApply = handleSubmit((data) => {
        onApply(data)
        setIsOpen(false)
    })

    const handleClear = () => {
        onClear()
        setActivePresets(new Set())
        setIsOpen(false)
    }

    const handlePresetClick = (preset: PresetFilter<TFilter>) => {
        if (activePresets.has(preset.label)) {
            // Remover o preset: limpar os campos relacionados
            const currentValues = getValues()
            const newValues = { ...currentValues }

            Object.keys(preset.data).forEach((key) => {
                newValues[key as keyof TFilter] =
                    '' as unknown as TFilter[keyof TFilter]
            })

            reset(newValues)
            onApply(newValues)
            setActivePresets(new Set())
        } else {
            // Limpar preset anterior se houver
            if (activePresets.size > 0) {
                const currentValues = getValues()
                const newValues = { ...currentValues }

                // Limpar campos de todos os presets anteriores
                presetFilters?.forEach((prevPreset) => {
                    if (activePresets.has(prevPreset.label)) {
                        Object.keys(prevPreset.data).forEach((key) => {
                            newValues[key as keyof TFilter] =
                                '' as unknown as TFilter[keyof TFilter]
                        })
                    }
                })

                // Aplicar o novo preset
                Object.assign(newValues, preset.data)
                reset(newValues)
                onApply(newValues)
            } else {
                // Sem preset anterior, apenas aplicar o novo
                const currentValues = getValues()
                const newValues = { ...currentValues, ...preset.data }
                reset(newValues)
                onApply(newValues)
            }

            setActivePresets(new Set([preset.label]))
        }
    }

    const renderFilterField = (
        field: FilterField<TFilter>,
        isInGroup: boolean = false
    ) => {
        const { name, label, type, options } = field

        return (
            <Form.Group
                className={isInGroup ? '' : 'mb-3'}
                key={name as string}
            >
                <Form.Label className="filter-dropdown-label">
                    {label}
                </Form.Label>
                <Controller
                    name={name}
                    control={control}
                    render={({ field: controllerField }) => {
                        const fieldValue = controllerField.value ?? ''

                        if (type === 'select' && options) {
                            return (
                                <Form.Select
                                    {...controllerField}
                                    value={fieldValue as string | number}
                                    onChange={(e) =>
                                        controllerField.onChange(e.target.value)
                                    }
                                    size="sm"
                                >
                                    <option value="">Todos</option>
                                    {options.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </Form.Select>
                            )
                        }

                        if (type === 'date') {
                            return (
                                <Form.Control
                                    type="date"
                                    {...controllerField}
                                    value={fieldValue as string}
                                    onChange={(e) =>
                                        controllerField.onChange(e.target.value)
                                    }
                                    size="sm"
                                />
                            )
                        }

                        if (type === 'number') {
                            return (
                                <Form.Control
                                    type="number"
                                    placeholder={label}
                                    {...controllerField}
                                    value={fieldValue as string | number}
                                    onChange={(e) =>
                                        controllerField.onChange(e.target.value)
                                    }
                                    size="sm"
                                />
                            )
                        }

                        // Default: text
                        return (
                            <Form.Control
                                type="text"
                                placeholder={label}
                                {...controllerField}
                                value={fieldValue as string}
                                onChange={(e) =>
                                    controllerField.onChange(e.target.value)
                                }
                                size="sm"
                            />
                        )
                    }}
                />
            </Form.Group>
        )
    }

    // Agrupar campos por grupo
    const groupedFields = filterFields.reduce(
        (acc, field) => {
            if (field.group) {
                if (!acc.groups[field.group]) {
                    acc.groups[field.group] = []
                }
                acc.groups[field.group].push(field)
            } else {
                acc.standalone.push(field)
            }
            return acc
        },
        {
            groups: {} as Record<string, FilterField<TFilter>[]>,
            standalone: [] as FilterField<TFilter>[],
        }
    )

    return (
        <Dropdown show={isOpen} onToggle={setIsOpen} autoClose="outside">
            <Dropdown.Toggle
                variant="primary"
                size="sm"
                id="filter-dropdown"
                className="filter-dropdown-toggle"
            >
                <i className="bi bi-funnel-fill me-1" />
                <span className="d-none d-md-inline">Filtros</span>
                <span className="d-md-none">Filtros</span>
                {appliedFiltersCount > 0 && (
                    <span className="filter-badge ms-2">
                        {appliedFiltersCount}
                    </span>
                )}
            </Dropdown.Toggle>

            <Dropdown.Menu className="filter-dropdown-menu">
                <div className="filter-dropdown-header">
                    <span className="fw-semibold">Filtros</span>
                </div>

                <Form onSubmit={handleApply}>
                    {/* PresetFilters como botões */}
                    {presetFilters && presetFilters.length > 0 && (
                        <>
                            <div className="filter-preset-buttons mb-3">
                                <div className="d-flex flex-wrap gap-2">
                                    {presetFilters.map((preset) => (
                                        <Button
                                            key={preset.label}
                                            variant={
                                                activePresets.has(preset.label)
                                                    ? 'dark'
                                                    : 'outline-dark'
                                            }
                                            size="sm"
                                            type="button"
                                            onClick={() =>
                                                handlePresetClick(preset)
                                            }
                                            className="preset-filter-btn"
                                        >
                                            {preset.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <hr className="my-3" />
                        </>
                    )}

                    <div className="filter-dropdown-fields">
                        {/* Renderizar campos standalone */}
                        {groupedFields.standalone.map((field) =>
                            renderFilterField(field, false)
                        )}

                        <hr />
                        {/* Renderizar grupos de campos */}
                        {Object.entries(groupedFields.groups).map(
                            ([groupName, fields]) => (
                                <div
                                    key={groupName}
                                    className="filter-group mb-3"
                                >
                                    <div className="row g-2">
                                        {fields.map((field) => (
                                            <div
                                                key={field.name as string}
                                                className="col-12 col-md-6"
                                            >
                                                {renderFilterField(field, true)}
                                            </div>
                                        ))}
                                    </div>
                                    <hr />
                                </div>
                            )
                        )}
                    </div>

                    <div className="filter-dropdown-actions d-flex justify-content-between gap-2 pt-3 border-top">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={handleClear}
                            type="button"
                        >
                            Limpar
                        </Button>
                        <Button variant="primary" size="sm" type="submit">
                            Aplicar
                        </Button>
                    </div>
                </Form>
            </Dropdown.Menu>
        </Dropdown>
    )
}
