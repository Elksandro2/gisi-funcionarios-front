export function formatBrazilianCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value)
}

export function formatBrazilianCurrencyCompact(value: number): string {
    if (value >= 1000000) {
        return `R$ ${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
        return `R$ ${(value / 1000).toFixed(1)}k`
    }
    return formatBrazilianCurrency(value)
}