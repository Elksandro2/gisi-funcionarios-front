import './Loading.css'

interface LoadingProps {
    type?: 'transparent' | 'opaque'
}

export function Loading({ type = 'transparent' }: LoadingProps) {
    const backgroundStyle =
        type === 'opaque' ? '#ffffff' : 'rgba(255,255,255,0.57)'

    return (
        <div
            className="loading-overlay d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
            style={{ background: backgroundStyle, zIndex: 9999 }}
            role="status"
            aria-live="polite"
            aria-label="Carregando"
        >
            <div
                className="position-relative"
                style={{ width: 140, height: 140 }}
            >
                {/* Anel de tinta (agora estático; quem se move é o dashoffset) */}
                <svg
                    className="position-absolute top-0 start-0"
                    width="140"
                    height="140"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <defs>
                        {/* Gradiente fixo no espaço do usuário: esquerda (0) laranja → direita (100) azul */}
                        <linearGradient
                            id="inkGradient"
                            x1="0"
                            y1="50"
                            x2="100"
                            y2="50"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop
                                offset="0%"
                                stopColor="var(--secondary-color)"
                            />
                            <stop
                                offset="50%"
                                stopColor="var(--secondary-color)"
                            />
                            <stop
                                offset="75%"
                                stopColor="var(--secondary-color)"
                            />
                            <stop
                                offset="100%"
                                stopColor="var(--secondary-color)"
                            />
                        </linearGradient>
                    </defs>

                    {/* trilha de fundo */}
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(0,0,0,0.06)"
                        strokeWidth="4"
                    />

                    {/* arcos visíveis que “caminham” direita → esquerda (CCW) */}
                    <circle
                        className="arc-walk arc-a"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#inkGradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            <span className="visually-hidden">Loading...</span>
        </div>
    )
}
