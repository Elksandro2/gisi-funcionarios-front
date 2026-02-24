import React from 'react'
import './CustomButton.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:
        | 'primary'
        | 'secondary'
        | 'outline-primary'
        | 'outline-secondary'
        | 'only-text-primary'
        | 'only-text-secondary'
    size?: 'sm' | 'md' | 'lg'
    active?: boolean
    className?: string
    children: React.ReactNode
}

export function CustomButton({
    variant = 'primary',
    size = 'md',
    active = false,
    className = '',
    children,
    disabled = false,
    ...props
}: ButtonProps) {
    const baseClass = 'btn-custom'
    const variantClass = `btn-custom--${variant}`
    const sizeClass = `btn-custom--size-${size}`
    const activeClass = active ? 'btn-custom--active' : ''
    const disabledClass = disabled ? 'btn-custom--disabled' : ''

    return (
        <button
            className={`${baseClass} ${variantClass} ${sizeClass} ${activeClass} ${disabledClass} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    )
}
