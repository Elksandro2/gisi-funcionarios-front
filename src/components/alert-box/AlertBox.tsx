import React, { useEffect, useState } from 'react'
import './AlertBox.css'

interface AlertBoxProps {
    message: string
    type: 'success' | 'danger' | 'warning'
    onClose: () => void
    duration?: number
}

export const AlertBox: React.FC<AlertBoxProps> = ({
    message,
    type,
    onClose,
    duration = 3000,
}) => {
    const [progress, setProgress] = useState(100)

    useEffect(() => {
        if (!message) return

        const timer = setTimeout(() => {
            onClose()
        }, duration)

        const stepTime = duration / 100

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, stepTime)

        return () => {
            clearTimeout(timer)
            clearInterval(interval)
        }
    }, [message, onClose, duration])

    if (!message) return null

    return (
        <div className="alertbox__container">
            <div
                className={`alertbox alertbox--${type} alertbox--dismissible alertbox--fade alertbox--show`}
                role="alert"
            >
                <div className="alertbox__body">
                    <span className={`alertbox__icon alertbox__icon--${type}`}>
                        {type === 'success'
                            ? '✔'
                            : type === 'warning'
                              ? '⚠'
                              : '!'}
                    </span>
                    <div className="alertbox__message">{message}</div>
                    <button
                        type="button"
                        className="alertbox__close"
                        onClick={onClose}
                        aria-label="Close"
                    ></button>
                </div>
                <div
                    className={`alertbox__progress alertbox__progress--${type}`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    )
}
