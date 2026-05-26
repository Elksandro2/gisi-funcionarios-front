import api from './ApiService'

export interface ChatRequest {
    message: string
}

export interface ChatResponse {
    response: string
}

export class ChatService {
    private readonly endpoint = '/chat'

    async askAssistant(request: ChatRequest): Promise<ChatResponse> {
        const { data } = await api.post<ChatResponse>(this.endpoint, request)
        return data
    }
}

export default ChatService
