export interface AddressResponse {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    country: string
}

export interface AddressRequest {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    country?: string
}