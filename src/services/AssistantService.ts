import api from './ApiService'

export interface AssistantRequest {
    message: string
}

export interface AssistantResponse {
    response: string
}

export class AssistantService {
    private readonly endpoint = '/assistant'

    async askAssistant(request: AssistantRequest): Promise<AssistantResponse> {
        const { data } = await api.post<AssistantResponse>(this.endpoint, request)
        return data
    }
}

export default AssistantService
