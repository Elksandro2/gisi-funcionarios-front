import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Send, Bot, Sparkles, Trash2, ArrowRight, Mic, MicOff } from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts'
import ChatService from '../../services/ChatService'
import { AlertBox } from '../../components/alert-box/AlertBox'
import './Chatbot.css'

interface Message {
    id: string
    sender: 'user' | 'assistant'
    text: string
    timestamp: Date
}

export const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const recognitionRef = useRef<any>(null)
    const [alert, setAlert] = useState<{
        message: string
        type: 'success' | 'danger' | 'warning'
    } | null>(null)

    const chatService = useMemo(() => new ChatService(), [])
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition()
            recognition.continuous = false
            recognition.lang = 'pt-BR'
            recognition.interimResults = false

            recognition.onstart = () => {
                setIsListening(true)
            }

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript
                setInput((prev) => prev ? `${prev} ${transcript}` : transcript)
            }

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error', event.error)
                setIsListening(false)
                setAlert({
                    message: 'Erro no reconhecimento de voz. Tente novamente.',
                    type: 'danger'
                })
            }

            recognition.onend = () => {
                setIsListening(false)
            }

            recognitionRef.current = recognition
        }
    }, [])

    const toggleListening = () => {
        if (!recognitionRef.current) {
            setAlert({
                message: 'Reconhecimento de voz não suportado pelo seu navegador.',
                type: 'warning'
            })
            return
        }

        if (isListening) {
            recognitionRef.current.stop()
        } else {
            recognitionRef.current.start()
        }
    }

    // Renderizador de mensagens que intercepta tags de gráfico <chart>
    const renderMessageContent = (text: string) => {
        const chartRegex = /<chart\s+type="(\w+)"\s+title="([^"]+)"[^>]*>([\s\S]*?)<\/chart>/i
        const match = text.match(chartRegex)

        if (!match) {
            return <div className="msg-text">{text}</div>
        }

        const beforeText = text.substring(0, match.index)
        const afterText = text.substring(match.index! + match[0].length)
        const type = match[1]
        const title = match[2]
        const rawData = match[3]

        let data = []
        try {
            data = JSON.parse(rawData.trim())
        } catch (e) {
            console.error('Failed to parse chart data:', e)
            return <div className="msg-text">{text}</div>
        }

        const COLORS = ['#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#fd7e14', '#ffc107']

        return (
            <div className="msg-text">
                {beforeText && <p className="mb-2">{beforeText}</p>}
                <div className="chat-chart-card bg-white p-3 rounded shadow-sm my-2 border text-center mx-auto" style={{ minWidth: '280px', maxWidth: '100%', height: '240px' }}>
                    <h6 className="fw-bold mb-2 text-dark text-start" style={{ fontSize: '0.85rem' }}>{title}</h6>
                    <div style={{ width: '100%', height: '175px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            {type === 'pie' ? (
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={30}
                                        outerRadius={50}
                                        dataKey="value"
                                        nameKey="name"
                                    >
                                        {data.map((_entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip formatter={(val) => [val, 'Quantidade']} />
                                    <Legend wrapperStyle={{ fontSize: '9px', bottom: -5 }} />
                                </PieChart>
                            ) : (
                                <BarChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                                    <XAxis dataKey="name" style={{ fontSize: '9px' }} />
                                    <YAxis style={{ fontSize: '9px' }} allowDecimals={false} />
                                    <RechartsTooltip />
                                    <Bar dataKey="value" fill="#0d6efd" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>
                {afterText && <p className="mt-2">{afterText}</p>}
            </div>
        )
    }

    const suggestions = [
        'Quantos funcionários a empresa possui?',
        'Qual a média salarial dos funcionários?',
        'Quem tem o maior salário e qual o departamento?',
        'Liste os funcionários do departamento de Tecnologia.',
        'Qual a distribuição de funcionários por gênero?',
    ]

    // Auto-scroll para a última mensagem
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading])

    const handleSend = async (textToSend: string) => {
        if (!textToSend.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: textToSend,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const data = await chatService.askAssistant({ message: textToSend })
            
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'assistant',
                text: data.response,
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, assistantMessage])
        } catch (error: any) {
            console.error('Erro no chatbot:', error)
            const errorMessage = error.response?.data?.message || 
                                 error.message || 
                                 'Erro ao se comunicar com o servidor do Chatbot.'
            setAlert({
                message: `Falha na resposta: ${errorMessage}`,
                type: 'danger'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleSend(input)
    }

    const clearChat = () => {
        setMessages([])
        setAlert({
            message: 'Histórico de mensagens limpo com sucesso!',
            type: 'success'
        })
    }

    return (
        <div className="chatbot-container container-fluid mt-4 animate-fade-in pb-4">
            {alert && (
                <AlertBox
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}

            <div className="chatbot-card shadow-sm border-0">
                {/* Cabeçalho do Chatbot */}
                <div className="chat-header d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                        <div className="assistant-avatar-container">
                            <Bot className="assistant-avatar-icon text-white" size={24} />
                            <span className="status-dot"></span>
                        </div>
                        <div>
                            <h5 className="chat-title text-white mb-0 d-flex align-items-center gap-2">
                                Assistente Virtual GISI
                                <Sparkles size={16} className="text-warning animate-pulse" />
                            </h5>
                            <span className="chat-subtitle">Online • Especialista em Funcionários</span>
                        </div>
                    </div>
                    {messages.length > 0 && (
                        <button 
                            className="btn btn-outline-light border-0 rounded-circle btn-clear-chat" 
                            onClick={clearChat}
                            title="Limpar Conversa"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>

                {/* Corpo do Chat */}
                <div className="chat-body">
                    {messages.length === 0 ? (
                        <div className="chat-welcome text-center my-auto p-4">
                            <div className="welcome-icon-container mx-auto mb-3">
                                <Bot size={48} className="text-primary" />
                            </div>
                            <h4 className="fw-bold text-dark mb-2">Olá! Eu sou o Assistente GISI.</h4>
                            <p className="text-muted mx-auto welcome-text">
                                Eu posso responder dúvidas sobre os funcionários cadastrados, calcular salários médios, 
                                listar departamentos, analisar datas de admissão e mais. Escolha uma sugestão ou digite sua pergunta!
                            </p>

                            <div className="suggestions-grid mt-4">
                                {suggestions.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        className="suggestion-chip d-flex align-items-center justify-content-between text-start"
                                        onClick={() => handleSend(suggestion)}
                                    >
                                        <span className="suggestion-text">{suggestion}</span>
                                        <ArrowRight size={14} className="suggestion-arrow" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="messages-list">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`message-row ${msg.sender}`}>
                                    {msg.sender === 'assistant' && (
                                        <div className="msg-avatar">
                                            <Bot size={16} />
                                        </div>
                                    )}
                                    <div className="message-bubble shadow-sm">
                                        {renderMessageContent(msg.text)}
                                        <div className="msg-time">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="message-row assistant typing">
                                    <div className="msg-avatar">
                                        <Bot size={16} />
                                    </div>
                                    <div className="message-bubble typing-bubble shadow-sm">
                                        <div className="typing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Barra de Sugestões Persistente */}
                {messages.length > 0 && (
                    <div className="chat-suggestions-bar d-flex flex-wrap gap-2 px-3 py-2 bg-light border-top justify-content-center">
                        {suggestions.map((suggestion, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className="suggestion-pill-btn btn btn-sm text-nowrap rounded-pill"
                                onClick={() => handleSend(suggestion)}
                                disabled={isLoading}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}

                {/* Rodapé e Input */}
                <form onSubmit={handleSubmit} className="chat-footer p-3 bg-white border-top">
                    <div className="input-group chat-input-group shadow-sm">
                        <button
                            type="button"
                            className={`btn ${isListening ? 'btn-danger shadow-inner animate-pulse' : 'btn-light border'} px-3 d-flex align-items-center justify-content-center border-end-0`}
                            onClick={toggleListening}
                            title={isListening ? "Parar de ouvir" : "Falar"}
                            style={{ borderTopLeftRadius: '0.375rem', borderBottomLeftRadius: '0.375rem' }}
                        >
                            {isListening ? <Mic size={18} /> : <MicOff size={18} className="text-secondary" />}
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                            placeholder="Pergunte-me algo sobre os funcionários..."
                            className="form-control border-start-0 px-3 py-3 chat-input"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !input.trim()} 
                            className="btn btn-primary px-4 d-flex align-items-center justify-content-center chat-send-btn"
                            style={{ borderTopRightRadius: '0.375rem', borderBottomRightRadius: '0.375rem' }}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
