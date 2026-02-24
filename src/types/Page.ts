export interface Pageable {
    pageNumber: number
    pageSize: number
    sort: {
        sorted: boolean
        empty: boolean
        unsorted: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
}

export interface Sort {
    sorted: boolean
    empty: boolean
    unsorted: boolean
}

export interface Page<T> {
    content: T[]
    pageable: Pageable
    last: boolean
    totalPages: number
    totalElements: number
    first: boolean
    size: number
    number: number
    sort: Sort
    numberOfElements: number
    empty: boolean
}