import { Button } from 'react-bootstrap'
import { FieldValues, UseFormReturn } from 'react-hook-form'
import { FilterField, PresetFilter } from './AdvancedSearchModal'
import { FilterDropdown } from './FilterDropdown'

interface TableToolbarProps<TFilter extends FieldValues> {
    hasFilterFields: boolean
    filterFields: FilterField<TFilter>[]
    presetFilters?: PresetFilter<TFilter>[]
    formMethods: UseFormReturn<TFilter>
    onApplyFilters: (data: TFilter) => void
    onClearFilters: () => void
    onColumnManagementClick: () => void
    appliedFiltersCount: number
}

export function TableToolbar<TFilter extends FieldValues>({
    hasFilterFields,
    filterFields,
    presetFilters,
    formMethods,
    onApplyFilters,
    onClearFilters,
    onColumnManagementClick,
    appliedFiltersCount,
}: TableToolbarProps<TFilter>) {
    return (
        <div className="d-flex flex-wrap gap-2 mb-3">
            {hasFilterFields && (
                <>
                    <FilterDropdown
                        filterFields={filterFields}
                        presetFilters={presetFilters}
                        formMethods={formMethods}
                        onApply={onApplyFilters}
                        onClear={onClearFilters}
                        appliedFiltersCount={appliedFiltersCount}
                    />
                    <Button variant="danger" onClick={onClearFilters} size="sm">
                        <i className="bi bi-x-circle me-1" />
                        <span className="d-none d-md-inline">
                            Limpar Filtros
                        </span>
                        <span className="d-md-none">Limpar</span>
                    </Button>
                </>
            )}
            <Button
                variant="dark"
                onClick={onColumnManagementClick}
                size="sm"
                title="Gerenciar Colunas"
            >
                <i className="bi bi-gear" />
                <span className="d-md-inline ms-1">Colunas</span>
            </Button>
        </div>
    )
}
