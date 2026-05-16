import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Star, Users, Dumbbell, Award, Plus, Pencil, Trash2 } from 'lucide-react'
import { getInitials } from '../../utils/helpers'
import Modal from '../../components/Modal'
import './Trainers.css'

const EMPTY_TRAINER = {
    name: '', email: '', phone: '', specialization: 'Strength & Conditioning',
    experience: '', rating: 0, clientCount: 0, activeClients: [],
    certifications: [], status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
    sessionsThisMonth: 0, avatar: null
}

const SPECIALIZATIONS = [
    'Strength & Conditioning', 'Weight Loss & HIIT', 'Yoga & Mobility',
    'CrossFit', 'Bodybuilding', 'Functional Training', 'Sports Performance',
    'Rehabilitation', 'Nutrition & Wellness'
]

export default function Trainers() {
    const { state, dispatch } = useApp()
    const [modalOpen, setModalOpen] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(EMPTY_TRAINER)
    const [certInput, setCertInput] = useState('')

    const openAdd = () => {
        setEditing(null)
        setForm(EMPTY_TRAINER)
        setCertInput('')
        setModalOpen(true)
    }

    const openEdit = (trainer) => {
        setEditing(trainer)
        setForm({ ...trainer, experience: String(trainer.experience) })
        setCertInput('')
        setModalOpen(true)
    }

    const handleField = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

    const addCert = () => {
        if (!certInput.trim()) return
        setForm(prev => ({ ...prev, certifications: [...prev.certifications, certInput.trim()] }))
        setCertInput('')
    }

    const removeCert = (index) => {
        setForm(prev => ({
            ...prev,
            certifications: prev.certifications.filter((_, i) => i !== index)
        }))
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\+?[\d\s-]{10,}$/
    
    const isEmailOk = form.email.trim() !== '' && emailRegex.test(form.email)
    const isPhoneOk = form.phone.trim() === '' || phoneRegex.test(form.phone)
    
    const emailError = form.email && !emailRegex.test(form.email) ? 'Invalid email format' : ''
    const phoneError = form.phone && !phoneRegex.test(form.phone) ? 'Invalid phone format' : ''

    const handleSave = () => {
        if (!form.name.trim() || !isEmailOk || !isPhoneOk) return

        if (editing) {
            dispatch({
                type: 'UPDATE_TRAINER',
                payload: { ...form, experience: Number(form.experience) }
            })
        } else {
            dispatch({
                type: 'ADD_TRAINER',
                payload: { ...form, id: `trainer-${Date.now()}`, experience: Number(form.experience) }
            })
        }
        setModalOpen(false)
    }

    const handleDelete = (id) => {
        dispatch({ type: 'DELETE_TRAINER', payload: id })
        setDeleteConfirm(null)
    }

    return (
        <div className="animate-fade-in-up">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Trainers</h1>
                    <p>{state.trainers.length} trainers on the team</p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={openAdd} id="add-trainer-btn">
                    <Plus size={16} /> Add Trainer
                </button>
            </div>

            <div className="grid-3">
                {state.trainers.map(trainer => (
                    <div className="card" key={trainer.id}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
                            <div className="member-avatar" style={{ width: 52, height: 52, fontSize: 'var(--text-base)' }}>
                                {getInitials(trainer.name)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontWeight: 700 }}>{trainer.name}</h3>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{trainer.specialization}</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                            {[
                                { icon: Star, label: 'Rating', value: trainer.rating, mono: true },
                                { icon: Users, label: 'Clients', value: trainer.clientCount, mono: true },
                                { icon: Dumbbell, label: 'Sessions/Month', value: trainer.sessionsThisMonth, mono: true },
                                { icon: Award, label: 'Experience', value: `${trainer.experience} yrs`, mono: false }
                            ].map(({ icon: Icon, label, value, mono }) => (
                                <div key={label} style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)', color: 'var(--accent)' }}>
                                        <Icon size={14} />
                                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{label}</span>
                                    </div>
                                    <span style={{ fontWeight: 700, fontFamily: mono ? 'var(--font-mono)' : undefined }}>{value}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginBottom: 'var(--space-4)' }}>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>CERTIFICATIONS</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                                {trainer.certifications.map(cert => (
                                    <span key={cert} className="tag tag-info">{cert}</span>
                                ))}
                                {trainer.certifications.length === 0 && (
                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>No certifications listed</span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="member-actions">
                            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(trainer)} title="Edit">
                                <Pencil size={14} /> Edit
                            </button>
                            <button className="btn btn-ghost btn-sm btn-danger-text" onClick={() => setDeleteConfirm(trainer)} title="Delete">
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {state.trainers.length === 0 && (
                <div className="empty-state">
                    <p>No trainers yet. Add your first trainer to get started.</p>
                </div>
            )}

            {/* Add / Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Trainer' : 'Add New Trainer'}>
                <div className="crud-form">
                    <div className="crud-row">
                        <label className="crud-label">Full Name *</label>
                        <input className="input" value={form.name} onChange={e => handleField('name', e.target.value)} placeholder="Priya Sharma" />
                    </div>
                    <div className="crud-row-2">
                        <div className="crud-row" style={{ display: 'flex', flexDirection: 'column' }}>
                            <label className="crud-label">Email *</label>
                            <input className={`input ${emailError ? 'input-error' : ''}`} type="email" value={form.email} onChange={e => handleField('email', e.target.value)} placeholder="priya@forgegym.com" style={emailError ? { borderColor: 'var(--danger)' } : {}} />
                            {emailError && <span style={{ color: 'var(--danger)', fontSize: 11, marginTop: 4 }}>{emailError}</span>}
                        </div>
                        <div className="crud-row" style={{ display: 'flex', flexDirection: 'column' }}>
                            <label className="crud-label">Phone</label>
                            <input className={`input ${phoneError ? 'input-error' : ''}`} value={form.phone} onChange={e => handleField('phone', e.target.value)} placeholder="+91 99887 76655" style={phoneError ? { borderColor: 'var(--danger)' } : {}} />
                            {phoneError && <span style={{ color: 'var(--danger)', fontSize: 11, marginTop: 4 }}>{phoneError}</span>}
                        </div>
                    </div>
                    <div className="crud-row-2">
                        <div className="crud-row">
                            <label className="crud-label">Specialization</label>
                            <select className="input" value={form.specialization} onChange={e => handleField('specialization', e.target.value)}>
                                {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="crud-row">
                            <label className="crud-label">Experience (years)</label>
                            <input className="input" type="number" value={form.experience} onChange={e => handleField('experience', e.target.value)} placeholder="6" />
                        </div>
                    </div>
                    <div className="crud-row-2">
                        <div className="crud-row">
                            <label className="crud-label">Status</label>
                            <select className="input" value={form.status} onChange={e => handleField('status', e.target.value)}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="crud-row">
                            <label className="crud-label">Join Date</label>
                            <input className="input" type="date" value={form.joinDate} onChange={e => handleField('joinDate', e.target.value)} />
                        </div>
                    </div>

                    {/* Certifications */}
                    <div className="crud-row">
                        <label className="crud-label">Certifications</label>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <input
                                className="input"
                                value={certInput}
                                onChange={e => setCertInput(e.target.value)}
                                placeholder="e.g. ACE CPT"
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCert())}
                            />
                            <button className="btn btn-secondary btn-sm" type="button" onClick={addCert}>Add</button>
                        </div>
                        {form.certifications.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                                {form.certifications.map((c, i) => (
                                    <span key={i} className="tag tag-info" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => removeCert(i)}>
                                        {c} <span style={{ fontSize: 10, opacity: 0.7 }}>✕</span>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="crud-actions">
                        <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave} disabled={!form.name.trim() || !form.email.trim()}>
                            {editing ? 'Save Changes' : 'Add Trainer'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Trainer">
                <div className="crud-form">
                    <p style={{ marginBottom: 'var(--space-4)', color: 'var(--text-secondary)' }}>
                        Are you sure you want to remove <strong style={{ color: 'var(--text-primary)' }}>{deleteConfirm?.name}</strong> from the trainers list? Any assigned members will become unassigned.
                    </p>
                    <div className="crud-actions">
                        <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm.id)}>Delete Trainer</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
