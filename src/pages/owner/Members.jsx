import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { formatDate, daysUntil, getInitials } from '../../utils/helpers'
import { Search, Plus, Pencil, Trash2, RefreshCw } from 'lucide-react'
import { membershipPlans } from '../../data/plans'
import Modal from '../../components/Modal'
import './Members.css'

/* ── Factory: always produces a fresh default with today's date ── */
function freshMember() {
    return {
        name: '', email: '', phone: '', age: '', dob: '',
        goal: 'General Fitness', membershipType: 'regular', trainerId: '',
        status: 'active', joinDate: new Date().toISOString().split('T')[0],
        expiryDate: '', amountPaid: '', planId: '', discount: '',
        streak: 0, totalWorkouts: 0, weight: '', height: '',
        points: 0, badges: [], avatar: null
    }
}

const GOALS = ['Muscle Gain', 'Weight Loss', 'Strength', 'General Fitness', 'Flexibility', 'Stamina', 'Toning']

function addDays(dateStr, days) {
    const d = new Date(dateStr)
    d.setDate(d.getDate() + days)
    return d.toISOString().split('T')[0]
}

/* ── Convert member record to form-friendly strings ── */
function memberToForm(member) {
    return {
        ...member,
        age: String(member.age || ''),
        weight: String(member.weight || ''),
        height: String(member.height || ''),
        amountPaid: String(member.amountPaid || ''),
        discount: String(member.discount || ''),
        dob: member.dob || '',
        planId: member.planId || ''
    }
}

/* ── Modal config derived from mode ── */
const MODAL_CONFIG = {
    add: {
        title: step => step === 1 ? 'Add Member — Personal Details' : 'Add Member — Select Plan',
        saveLabel: 'Add Member',
        showSteps: true,
    },
    edit: {
        title: () => 'Edit Member — Personal Details',
        saveLabel: 'Save Changes',
        showSteps: false,
    },
    renew: {
        title: () => 'Renew Membership — Select Plan',
        saveLabel: 'Renew Membership',
        showSteps: false,
    },
}

export default function Members() {
    const { state, dispatch } = useApp()
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    // ── Modal state machine ──
    // mode: null | 'add' | 'edit' | 'renew'
    const [mode, setMode] = useState(null)
    const [step, setStep] = useState(1)
    const [form, setForm] = useState(freshMember)
    const [memberId, setMemberId] = useState(null) // id of member being edited/renewed

    const modalOpen = mode !== null
    const config = mode ? MODAL_CONFIG[mode] : null
    const showStep1 = mode === 'add' ? step === 1 : mode === 'edit'
    const showStep2 = mode === 'add' ? step === 2 : mode === 'renew'

    const filtered = state.members.filter(m => {
        const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase())
        const matchFilter = filter === 'all' || m.status === filter
        return matchSearch && matchFilter
    })

    // ── Openers ──
    const closeModal = () => setMode(null)

    const openAdd = () => {
        setMode('add')
        setStep(1)
        setForm(freshMember())
        setMemberId(null)
    }

    const openEdit = (member) => {
        setMode('edit')
        setStep(1)
        setForm(memberToForm(member))
        setMemberId(member.id)
    }

    const openRenew = (member) => {
        const today = new Date().toISOString().split('T')[0]
        // Expiring: start the day after current expiry for continuity
        // Expired: start from today
        const renewStart = member.status === 'expiring' && member.expiryDate
            ? addDays(member.expiryDate, 1)
            : today
        const prevPlan = membershipPlans.find(p => p.id === member.planId)
        const expiry = prevPlan ? addDays(renewStart, prevPlan.duration) : ''

        setMode('renew')
        setStep(2)
        setForm({
            ...memberToForm(member),
            discount: '',
            joinDate: renewStart,
            expiryDate: expiry,
            amountPaid: prevPlan ? String(prevPlan.price) : '',
            status: 'active'
        })
        setMemberId(member.id)
    }

    // ── Field handlers ──
    const handleField = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

    const selectPlan = (plan) => {
        const expiry = form.joinDate ? addDays(form.joinDate, plan.duration) : ''
        const disc = Number(form.discount) || 0
        setForm(prev => ({
            ...prev,
            planId: plan.id,
            amountPaid: String(Math.max(0, plan.price - disc)),
            expiryDate: expiry
        }))
    }

    const handleDiscount = (val) => {
        const disc = Number(val) || 0
        const plan = membershipPlans.find(p => p.id === form.planId)
        setForm(prev => ({
            ...prev,
            discount: val,
            amountPaid: plan ? String(Math.max(0, plan.price - disc)) : prev.amountPaid
        }))
    }

    const handleJoinDateChange = (date) => {
        const selectedPlan = membershipPlans.find(p => p.id === form.planId)
        setForm(prev => ({
            ...prev,
            joinDate: date,
            expiryDate: selectedPlan ? addDays(date, selectedPlan.duration) : prev.expiryDate
        }))
    }

    // ── Validation ──
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\+?[\d\s-]{10,}$/

    const isEmailOk = form.email.trim() !== '' && emailRegex.test(form.email)
    const isPhoneOk = form.phone.trim() === '' || phoneRegex.test(form.phone)

    const emailError = form.email && !emailRegex.test(form.email) ? 'Invalid email format' : ''
    const phoneError = form.phone && !phoneRegex.test(form.phone) ? 'Invalid phone format' : ''

    const canProceedStep1 = form.name.trim() && isEmailOk && isPhoneOk
    const canSavePlan = form.planId && form.joinDate

    // ── Save ──
    const handleSave = () => {
        const payload = {
            ...form,
            age: Number(form.age) || 0,
            weight: Number(form.weight) || 0,
            height: Number(form.height) || 0,
            amountPaid: Number(form.amountPaid) || 0,
            discount: Number(form.discount) || 0,
            trainerId: form.trainerId || null
        }

        if (mode === 'add') {
            if (!canProceedStep1 || !canSavePlan) return
            dispatch({ type: 'ADD_MEMBER', payload: { ...payload, id: `member-${Date.now()}` } })
        } else if (mode === 'edit') {
            if (!canProceedStep1) return
            dispatch({ type: 'UPDATE_MEMBER', payload })
        } else if (mode === 'renew') {
            if (!canSavePlan) return
            dispatch({ type: 'UPDATE_MEMBER', payload })
        }
        closeModal()
    }

    const handleDelete = (id) => {
        dispatch({ type: 'DELETE_MEMBER', payload: id })
        setDeleteConfirm(null)
    }

    const selectedPlan = membershipPlans.find(p => p.id === form.planId)

    return (
        <div className="animate-fade-in-up">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="members-title">MEMBERS</h1>
                </div>
                <button className="btn btn-primary btn-sm" onClick={openAdd} id="add-member-btn">
                    <Plus size={16} /> Add Member
                </button>
            </div>

            <div className="members-toolbar card-flat" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="members-search">
                    <Search size={16} />
                    <input
                        className="input"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        id="members-search"
                    />
                </div>
                <div className="members-filters">
                    {['all', 'active', 'expiring', 'expired'].map(f => (
                        <button
                            key={f}
                            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="members-grid">
                {filtered.map(member => {
                    const days = daysUntil(member.expiryDate)
                    const plan = membershipPlans.find(p => p.id === member.planId)
                    return (
                        <div className="card member-card" key={member.id}>
                            <div className="member-card-header">
                                <div className="member-avatar">{getInitials(member.name)}</div>
                                <div style={{ flex: 1 }}>
                                    <h3 className="member-name">{member.name}</h3>
                                    <p className="member-email">{member.email}</p>
                                </div>
                                <span className={`tag ${member.status === 'active' ? 'tag-success' : member.status === 'expiring' ? 'tag-warning' : 'tag-danger'}`}>
                                    {member.status}
                                </span>
                            </div>

                            <div className="member-meta">
                                <div className="member-meta-item">
                                    <span className="meta-label">Type</span>
                                    <span className={`tag ${member.membershipType === 'pt' ? 'tag-info' : 'tag-warning'}`}>
                                        {member.membershipType === 'pt' ? 'PT Member' : 'Regular'}
                                    </span>
                                </div>
                                <div className="member-meta-item">
                                    <span className="meta-label">Goal</span>
                                    <span className="meta-value">{member.goal}</span>
                                </div>
                                <div className="member-meta-item">
                                    <span className="meta-label">Plan</span>
                                    <span className="meta-value">{plan?.name || '—'}</span>
                                </div>
                                <div className="member-meta-item">
                                    <span className="meta-label">Paid</span>
                                    <span className="meta-value font-mono">₹{(member.amountPaid || 0).toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <div className="member-expiry">
                                <span className="meta-label">Expires: {member.expiryDate ? formatDate(member.expiryDate) : '—'}</span>
                                <span className={days < 0 ? 'text-danger' : days < 30 ? 'text-warning' : ''}>
                                    {member.expiryDate ? (days < 0 ? `Expired ${Math.abs(days)}d ago` : `${days} days left`) : '—'}
                                </span>
                            </div>

                            <div className="member-actions">
                                {(member.status === 'expiring' || member.status === 'expired') && (
                                    <button className="btn btn-ghost btn-sm" onClick={() => openRenew(member)} title="Renew">
                                        <RefreshCw size={14} /> Renew
                                    </button>
                                )}
                                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(member)} title="Edit">
                                    <Pencil size={14} /> Edit
                                </button>
                                <button className="btn btn-ghost btn-sm btn-danger-text" onClick={() => setDeleteConfirm(member)} title="Delete">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {
                filtered.length === 0 && (
                    <div className="empty-state">
                        <p>No members match your search.</p>
                    </div>
                )
            }

            {/* ──── Modal ──── */}
            <Modal isOpen={modalOpen} onClose={closeModal} title={config?.title(step)}>
                <div className="crud-form">
                    {/* Step Indicator — only for 'add' mode */}
                    {mode === 'add' && (
                        <div className="step-indicator">
                            <div className={`step-dot ${step >= 1 ? 'step-active' : ''}`}>1</div>
                            <div className="step-line" />
                            <div className={`step-dot ${step >= 2 ? 'step-active' : ''}`}>2</div>
                            <span className="step-label">{step === 1 ? 'Personal Details' : 'Membership Plan'}</span>
                        </div>
                    )}

                    {/* ─── Personal Details (add step 1, edit) ─── */}
                    {showStep1 && (
                        <>
                            <div className="crud-row">
                                <label className="crud-label">Full Name *</label>
                                <input className="input" value={form.name} onChange={e => handleField('name', e.target.value)} placeholder="Arjun Mehta" />
                            </div>
                            <div className="crud-row-2">
                                <div className="crud-row" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label className="crud-label">Email *</label>
                                    <input className={`input ${emailError ? 'input-error' : ''}`} type="email" value={form.email} onChange={e => handleField('email', e.target.value)} placeholder="arjun@email.com" style={emailError ? { borderColor: 'var(--danger)' } : {}} />
                                    {emailError && <span style={{ color: 'var(--danger)', fontSize: 11, marginTop: 4 }}>{emailError}</span>}
                                </div>
                                <div className="crud-row" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label className="crud-label">Phone</label>
                                    <input className={`input ${phoneError ? 'input-error' : ''}`} value={form.phone} onChange={e => handleField('phone', e.target.value)} placeholder="+91 98765 43210" style={phoneError ? { borderColor: 'var(--danger)' } : {}} />
                                    {phoneError && <span style={{ color: 'var(--danger)', fontSize: 11, marginTop: 4 }}>{phoneError}</span>}
                                </div>
                            </div>
                            <div className="crud-row-2">
                                <div className="crud-row">
                                    <label className="crud-label">Age</label>
                                    <input className="input" type="number" value={form.age} onChange={e => handleField('age', e.target.value)} placeholder="28" />
                                </div>
                                <div className="crud-row">
                                    <label className="crud-label">Date of Birth</label>
                                    <input className="input" type="date" value={form.dob} onChange={e => handleField('dob', e.target.value)} />
                                </div>
                            </div>
                            <div className="crud-row-2">
                                <div className="crud-row">
                                    <label className="crud-label">Goal</label>
                                    <select className="input" value={form.goal} onChange={e => handleField('goal', e.target.value)}>
                                        {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div className="crud-row">
                                    <label className="crud-label">Membership Type</label>
                                    <select className="input" value={form.membershipType} onChange={e => handleField('membershipType', e.target.value)}>
                                        <option value="regular">Regular</option>
                                        <option value="pt">PT (Personal Training)</option>
                                    </select>
                                </div>
                            </div>
                            {form.membershipType === 'pt' && (
                                <div className="crud-row">
                                    <label className="crud-label">Assign Trainer</label>
                                    <select className="input" value={form.trainerId || ''} onChange={e => handleField('trainerId', e.target.value || null)}>
                                        <option value="">— Unassigned —</option>
                                        {state.trainers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>)}
                                    </select>
                                </div>
                            )}
                        </>
                    )}

                    {/* ─── Plan Selection (add step 2, renew) ─── */}
                    {showStep2 && (
                        <>
                            <div className="crud-row">
                                <label className="crud-label">Select Plan *</label>
                                <div className="plan-grid">
                                    {membershipPlans.map(plan => (
                                        <div
                                            key={plan.id}
                                            className={`plan-card ${form.planId === plan.id ? 'plan-card-selected' : ''}`}
                                            onClick={() => selectPlan(plan)}
                                        >
                                            <div className="plan-name">{plan.name}</div>
                                            <div className="plan-price">₹{plan.price.toLocaleString('en-IN')}</div>
                                            <div className="plan-duration">{plan.duration} days</div>
                                            {form.planId === plan.id && <div className="plan-check">✓</div>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="crud-row-2">
                                <div className="crud-row">
                                    <label className="crud-label">Joining Date *</label>
                                    <input className="input" type="date" value={form.joinDate} onChange={e => handleJoinDateChange(e.target.value)} />
                                </div>
                                <div className="crud-row">
                                    <label className="crud-label">Expiry Date</label>
                                    <input className="input" type="date" value={form.expiryDate} readOnly style={{ opacity: 0.7 }} />
                                </div>
                            </div>

                            <div className="crud-row-3">
                                <div className="crud-row">
                                    <label className="crud-label">Discount (₹)</label>
                                    <input className="input" type="number" value={form.discount} onChange={e => handleDiscount(e.target.value)} placeholder="0" />
                                </div>
                                <div className="crud-row">
                                    <label className="crud-label">Amount Paid (₹)</label>
                                    <input className="input" type="number" value={form.amountPaid} onChange={e => handleField('amountPaid', e.target.value)} />
                                </div>
                                <div className="crud-row">
                                    <label className="crud-label">Status</label>
                                    <select className="input" value={form.status} onChange={e => handleField('status', e.target.value)}>
                                        <option value="active">Active</option>
                                        <option value="expiring">Expiring</option>
                                        <option value="expired">Expired</option>
                                    </select>
                                </div>
                            </div>

                            {/* Summary */}
                            {selectedPlan && (
                                <div className="plan-summary">
                                    <div className="plan-summary-row">
                                        <span>Plan</span><strong>{selectedPlan.name}</strong>
                                    </div>
                                    <div className="plan-summary-row">
                                        <span>Duration</span><strong>{selectedPlan.duration} days</strong>
                                    </div>
                                    <div className="plan-summary-row">
                                        <span>Price</span><strong>₹{selectedPlan.price.toLocaleString('en-IN')}</strong>
                                    </div>
                                    {Number(form.discount) > 0 && (
                                        <div className="plan-summary-row">
                                            <span>Discount</span><strong style={{ color: 'var(--success)' }}>−₹{Number(form.discount).toLocaleString('en-IN')}</strong>
                                        </div>
                                    )}
                                    <div className="plan-summary-row" style={{ fontWeight: 800 }}>
                                        <span style={{ color: 'var(--text-primary)' }}>Final Amount</span><strong style={{ color: 'var(--accent)', fontSize: 'var(--text-base)' }}>₹{Number(form.amountPaid).toLocaleString('en-IN')}</strong>
                                    </div>
                                    {form.expiryDate && (
                                        <div className="plan-summary-row">
                                            <span>Expires</span><strong>{formatDate(form.expiryDate)}</strong>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* ─── Action Buttons ─── */}
                    <div className="crud-actions">
                        {mode === 'add' && step === 2 && (
                            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                        )}
                        <div style={{ flex: 1 }} />
                        <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>

                        {mode === 'add' && step === 1 && (
                            <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!canProceedStep1}>
                                Next →
                            </button>
                        )}
                        {mode === 'edit' && (
                            <button className="btn btn-primary" onClick={handleSave} disabled={!canProceedStep1}>
                                {config.saveLabel}
                            </button>
                        )}
                        {(mode === 'add' && step === 2 || mode === 'renew') && (
                            <button className="btn btn-primary" onClick={handleSave} disabled={!canSavePlan}>
                                {config.saveLabel}
                            </button>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Member">
                <div className="crud-form">
                    <p style={{ marginBottom: 'var(--space-4)', color: 'var(--text-secondary)' }}>
                        Are you sure you want to remove <strong style={{ color: 'var(--text-primary)' }}>{deleteConfirm?.name}</strong> from the members list? This action cannot be undone.
                    </p>
                    <div className="crud-actions">
                        <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm.id)}>Delete Member</button>
                    </div>
                </div>
            </Modal>
        </div >
    )
}
