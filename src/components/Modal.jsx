import { useEffect } from 'react'
import './Modal.css'

export default function Modal({ isOpen, onClose, title, children, className = '' }) {
    // Lock body scroll while any modal is open — fixes background scroll bleed
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="modal-overlay animate-fade-in" onClick={onClose}>
            <div className={`modal-content animate-scale-in ${className}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    )
}
