import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/VerificationPopup.css'

const VerificationPopup = ({ isOpen, onClose, type, redirectPath = '/client/profile' }) => {
    const navigate = useNavigate()

    if (!isOpen) return null

    const handleProfileRedirect = () => {
        onClose()
        navigate(redirectPath)
    }

    return (
        <div className="verification-popup-overlay">
            <div className="verification-popup">
                <div className="popup-icon">
                    {'⏳'}
                </div>

                <h3>
                    {'Information'}
                </h3>

                <p>
                    {'Cette action n\'est pas disponible pour le moment.'}
                </p>

                <div className="popup-actions">
                    <button className="btn btn-primary" onClick={onClose}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VerificationPopup
