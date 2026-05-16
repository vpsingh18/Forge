import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

const DEMO_ACCOUNTS = {
    'member@forge.io': { pass: 'member123', role: 'member', name: 'Arjun Mehta' },
    'trainer@forge.io': { pass: 'trainer123', role: 'trainer', name: 'Priya Sharma' },
    'owner@forge.io': { pass: 'owner123', role: 'owner', name: 'Rajesh Kumar' },
}

const ROLE_META = {
    member: { pillClass: 'login-pill-member', label: 'MEMBER MODULE', barColor: 'var(--accent)' },
    trainer: { pillClass: 'login-pill-trainer', label: 'TRAINER MODULE', barColor: '#8B5CF6' },
    owner: { pillClass: 'login-pill-owner', label: 'OWNER MODULE', barColor: '#F59E0B' },
}

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passVisible, setPassVisible] = useState(false)
    const [remember, setRemember] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [redirect, setRedirect] = useState(null) // { role, name }

    const { login } = useAuth()
    const navigate = useNavigate()

    const fill = (e, p) => {
        setEmail(e)
        setPassword(p)
        setError('')
    }

    const handleLogin = () => {
        setError('')
        if (!email.trim() || !password) {
            setError('Please enter your email and password.')
            return
        }

        setLoading(true)

        setTimeout(() => {
            const account = DEMO_ACCOUNTS[email.trim().toLowerCase()]
            if (!account || account.pass !== password) {
                setLoading(false)
                setError('Incorrect email or password. Please try again.')
                return
            }

            // Auth success — show redirect overlay
            setRedirect({ role: account.role, name: account.name })
            login(account.role)

            setTimeout(() => {
                navigate(`/${account.role}`)
            }, 1700)
        }, 800)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleLogin()
    }

    const meta = redirect ? ROLE_META[redirect.role] : null

    return (
        <div className="login-page" onKeyDown={handleKeyDown}>

            {/* Redirect overlay */}
            {redirect && (
                <div className="login-redirect-overlay">
                    <div className="login-redirect-logo">FORGE<span>.</span></div>
                    <div className={`login-redirect-pill ${meta.pillClass}`}>{meta.label}</div>
                    <div className="login-redirect-msg">
                        Welcome back, {redirect.name.split(' ')[0]}. Loading your dashboard...
                    </div>
                    <div className="login-redirect-bar-wrap">
                        <div
                            className="login-redirect-bar"
                            style={{ background: meta.barColor, width: '100%' }}
                        />
                    </div>
                </div>
            )}

            {/* Main login card */}
            <div className="login-wrap">
                {/* Accent top line */}
                <div className="login-wrap-topline" />

                {/* LEFT: Brand Panel */}
                <div className="login-brand">
                    <div>
                        <div className="login-brand-logo">FORGE<span>.</span></div>
                        <div className="login-brand-tagline">Athletic Performance Platform</div>
                    </div>

                    <div className="login-brand-hero">
                        <div className="login-brand-headline">
                            TRAIN<br />
                            <span className="login-hl">SMARTER.</span><br />
                            GROW FASTER.
                        </div>
                        <p className="login-brand-desc">
                            The all-in-one platform for gym owners, trainers, and athletes to manage workouts, nutrition, and performance.
                        </p>
                        <div className="login-brand-stats">
                            <div className="login-bstat">
                                <div className="login-bstat-val">12K+</div>
                                <div className="login-bstat-lbl">Athletes</div>
                            </div>
                            <div className="login-bstat">
                                <div className="login-bstat-val">340+</div>
                                <div className="login-bstat-lbl">Gyms</div>
                            </div>
                            <div className="login-bstat">
                                <div className="login-bstat-val">98%</div>
                                <div className="login-bstat-lbl">Retention</div>
                            </div>
                        </div>
                    </div>

                    <div className="login-brand-footer">© 2025 Forge Inc. — v2.4.1</div>
                </div>

                {/* RIGHT: Form Panel */}
                <div className="login-form-panel">
                    <h1 className="login-form-heading">WELCOME BACK</h1>
                    <p className="login-form-sub">Sign in — your role is detected automatically</p>

                    {/* Demo hint */}
                    <div className="login-hint">
                        <span>💡</span>
                        <div className="login-hint-text">
                            <strong>DEMO ACCOUNTS — click to fill</strong>
                            <div className="login-hint-creds">
                                <span className="login-hint-cred">
                                    Member: <b onClick={() => fill('member@forge.io', 'member123')}>member@forge.io</b>
                                </span>
                                <span className="login-hint-cred">
                                    Trainer: <b onClick={() => fill('trainer@forge.io', 'trainer123')}>trainer@forge.io</b>
                                </span>
                                <span className="login-hint-cred">
                                    Owner: <b onClick={() => fill('owner@forge.io', 'owner123')}>owner@forge.io</b>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="login-error">
                            <span>⚠</span> {error}
                        </div>
                    )}

                    {/* Email */}
                    <div className="login-fg">
                        <label className="login-label">Email Address</label>
                        <div className="login-input-wrap">
                            <input
                                className={`login-input ${error ? 'login-input-err' : ''}`}
                                type="email"
                                placeholder="you@forge.io"
                                value={email}
                                onChange={e => { setEmail(e.target.value); setError('') }}
                                autoComplete="email"
                                id="login-email"
                            />
                            <span className="login-input-icon">✉</span>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="login-fg">
                        <label className="login-label">Password</label>
                        <div className="login-input-wrap">
                            <input
                                className={`login-input ${error ? 'login-input-err' : ''}`}
                                type={passVisible ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError('') }}
                                autoComplete="current-password"
                                id="login-password"
                            />
                            <span
                                className="login-input-icon"
                                onClick={() => setPassVisible(!passVisible)}
                                style={{ cursor: 'pointer' }}
                            >
                                {passVisible ? '🙈' : '👁'}
                            </span>
                        </div>
                    </div>

                    {/* Remember + Forgot */}
                    <div className="login-meta-row">
                        <div className="login-remember" onClick={() => setRemember(!remember)}>
                            <div className={`login-checkbox ${remember ? 'login-checkbox-on' : ''}`}>
                                {remember && '✓'}
                            </div>
                            <span>Remember me</span>
                        </div>
                        <a className="login-forgot" href="#">Forgot password?</a>
                    </div>

                    {/* Submit */}
                    <button
                        className="login-submit-btn"
                        onClick={handleLogin}
                        disabled={loading}
                        id="login-submit"
                    >
                        {loading ? (
                            <><div className="login-spinner" /> SIGNING IN...</>
                        ) : (
                            'SIGN IN'
                        )}
                    </button>

                    <div className="login-or">or</div>
                    <button className="login-sso-btn">🔑 Continue with SSO</button>
                    <p className="login-signup-row">
                        Don't have an account? <a href="#">Get started free →</a>
                    </p>
                </div>
            </div>
        </div>
    )
}
