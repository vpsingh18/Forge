import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Onboarding.css'

const STEPS = {
    owner: [
        { title: 'Welcome, Owner 👔', desc: 'Monitor your gym\'s health at a glance — members, revenue, and trainer performance.' },
        { title: 'Manage Everything', desc: 'Add members, assign trainers, set membership plans, and send announcements — all from one place.' },
        { title: 'Data-Driven Decisions', desc: 'Track revenue trends, payment due dates, and class utilization with real-time charts.' }
    ],
    trainer: [
        { title: 'Welcome, Trainer 🏋️', desc: 'Build customized workout and diet plans for your clients in minutes.' },
        { title: 'Track Progress', desc: 'Log measurements, capture progress photos, and monitor client improvements over time.' },
        { title: 'Stay Connected', desc: 'Message your clients directly, view their attendance, and keep them motivated.' }
    ],
    member: [
        { title: 'Welcome to Forge 🔥', desc: 'Your personal fitness companion — workouts, nutrition, and progress all in one place.' },
        { title: 'Log & Earn', desc: 'Check off your exercises, earn streaks, unlock badges, and climb the leaderboard.' },
        { title: 'Check In Smart', desc: 'Use your QR code to check in at the gym and never miss an attendance record again.' }
    ]
}

export default function Onboarding() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [step, setStep] = useState(0)
    const steps = STEPS[user?.role] || STEPS.member
    const isLast = step === steps.length - 1

    const handleNext = () => {
        if (isLast) {
            navigate(`/${user?.role}`)
        } else {
            setStep(step + 1)
        }
    }

    return (
        <div className="onboarding-page">
            <div className="onboarding-bg-glow" />
            <div className="onboarding-container animate-fade-in">
                <div className="onboarding-logo">
                    <span>⚒️</span>
                    <span className="text-gradient" style={{ fontWeight: 800, letterSpacing: '0.1em' }}>FORGE</span>
                </div>

                <div className="onboarding-card card-flat">
                    <div className="onboarding-step-dots">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`onboarding-dot ${i === step ? 'onboarding-dot-active' : i < step ? 'onboarding-dot-done' : ''}`}
                            />
                        ))}
                    </div>

                    <div className="onboarding-content" key={step}>
                        <h2 className="onboarding-title">{steps[step].title}</h2>
                        <p className="onboarding-desc">{steps[step].desc}</p>
                    </div>

                    <button
                        className="btn btn-primary btn-lg onboarding-btn"
                        onClick={handleNext}
                        id="onboarding-next"
                    >
                        {isLast ? 'Go to Dashboard →' : 'Next →'}
                    </button>

                    {!isLast && (
                        <button
                            className="btn btn-ghost onboarding-skip"
                            onClick={() => navigate(`/${user?.role}`)}
                        >
                            Skip
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
