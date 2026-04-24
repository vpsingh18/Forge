import { useState } from 'react'
import { Save, Pencil, Dumbbell, ChevronDown, ChevronUp, CheckCircle2, Calendar } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { getInitials, formatDate, BADGES } from '../../utils/helpers'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'

export default function Clients() {
    const { state, dispatch } = useApp()
    const { user } = useAuth()
    const myClients = state.members.filter(m => m.trainerId === user?.id)

    // ── Body composition edit state ──
    const [editingClient, setEditingClient] = useState(null)
    const [form, setForm] = useState({})
    const [saved, setSaved] = useState(false)

    // ── Assign Program state ──
    const [programClient, setProgramClient]   = useState(null)
    const [selectedProgId, setSelectedProgId] = useState(null)
    const [expandedProgId, setExpandedProgId] = useState(null)
    const [assignSaved, setAssignSaved]       = useState(false)

    // ─── Body Composition handlers ───────────────────────
    function openEdit(client) {
        setEditingClient(client)
        setForm({
            height:        client.height        ?? '',
            weight:        client.weight        ?? '',
            bmi:           client.bmi           ?? '',
            bodyFat:       client.bodyFat       ?? '',
            fatFreeWeight: client.fatFreeWeight ?? '',
            visceralFat:   client.visceralFat   ?? '',
            muscleMass:    client.muscleMass    ?? '',
            boneMass:      client.boneMass      ?? '',
            bodyWater:     client.bodyWater     ?? '',
        })
        setSaved(false)
    }

    function closeEdit() {
        setEditingClient(null)
        setForm({})
        setSaved(false)
    }

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function handleSave() {
        const num = (key) => form[key] !== '' ? parseFloat(form[key]) : undefined
        dispatch({
            type: 'UPDATE_MEMBER',
            payload: {
                id:            editingClient.id,
                height:        num('height'),
                weight:        num('weight'),
                bmi:           num('bmi'),
                bodyFat:       num('bodyFat'),
                fatFreeWeight: num('fatFreeWeight'),
                visceralFat:   num('visceralFat'),
                muscleMass:    num('muscleMass'),
                boneMass:      num('boneMass'),
                bodyWater:     num('bodyWater'),
            }
        })
        setSaved(true)
        setTimeout(closeEdit, 500)
    }

    // ─── Assign Program handlers ─────────────────────────
    function openProgramModal(client) {
        setProgramClient(client)
        setSelectedProgId(client.assignedProgramId ?? null)
        setExpandedProgId(null)
        setAssignSaved(false)
    }

    function closeProgramModal() {
        setProgramClient(null)
        setSelectedProgId(null)
        setExpandedProgId(null)
        setAssignSaved(false)
    }

    function handleAssignProgram() {
        if (!selectedProgId) return
        dispatch({
            type: 'UPDATE_MEMBER',
            payload: { id: programClient.id, assignedProgramId: selectedProgId }
        })
        setAssignSaved(true)
        setTimeout(closeProgramModal, 800)
    }

    const fields = [
        { key: 'height',        label: 'Height',          unit: 'cm',    placeholder: '178'  },
        { key: 'weight',        label: 'Body Weight',     unit: 'kg',    placeholder: '75'   },
        { key: 'bmi',           label: 'BMI',             unit: '',      placeholder: '22.4' },
        { key: 'bodyFat',       label: 'Body Fat',        unit: '%',     placeholder: '18.5' },
        { key: 'fatFreeWeight', label: 'Fat-Free Weight', unit: 'kg',    placeholder: '61.5' },
        { key: 'visceralFat',   label: 'Visceral Fat',    unit: 'level', placeholder: '7'    },
        { key: 'muscleMass',    label: 'Muscle Mass',     unit: 'kg',    placeholder: '35'   },
        { key: 'boneMass',      label: 'Bone Mass',       unit: 'kg',    placeholder: '3.2'  },
        { key: 'bodyWater',     label: 'Body Water',      unit: '%',     placeholder: '55'   },
    ]

    return (
        <div className="animate-fade-in-up">
            <div className="page-header">
                <h1><span>My</span> <span className="text-gradient">Clients</span></h1>
                <p>{myClients.length} client{myClients.length !== 1 ? 's' : ''} · {myClients.filter(c => c.membershipType === 'pt').length} on Personal Training</p>
            </div>

            {myClients.length === 0 ? (
                <div className="card-flat" style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--text-muted)' }}>
                    No clients assigned yet.
                </div>
            ) : (
                /* ── Grid of box cards ── */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-5)', alignItems: 'stretch' }}>
                    {myClients.map(client => {
                        const assignedProg = state.programs.find(p => p.id === client.assignedProgramId)

                        return (
                            <div className="card" key={client.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 'var(--space-5)', height: '100%' }}>

                                {/* ── Avatar + Name + Membership type + Status ── */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <div className="member-avatar" style={{ width: 48, height: 48, fontSize: 'var(--text-base)', flexShrink: 0 }}>
                                            {getInitials(client.name)}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 700, fontSize: 'var(--text-base)', lineHeight: 1.3 }}>{client.name}</p>
                                            <span style={{
                                                display: 'inline-block',
                                                marginTop: 4,
                                                fontSize: 10,
                                                fontWeight: 700,
                                                padding: '2px 8px',
                                                borderRadius: 999,
                                                background: client.membershipType === 'pt' ? 'rgba(16, 1, 9, 0.15)' : 'var(--bg-input)',
                                                color: client.membershipType === 'pt' ? '#A78BFA' : 'var(--text-muted)',
                                                border: `1px solid ${client.membershipType === 'pt' ? 'rgba(139,92,246,0.35)' : 'var(--border)'}`,
                                            }}>
                                                {client.membershipType === 'pt' ? 'PT Member' : 'Regular Member'}
                                            </span>
                                        </div>
                                    </div>
                                    <span style={statusBadgeStyle(client.status)}>{client.status}</span>
                                </div>

                                {/* ── Age / Weight / Height ── */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)', textAlign: 'center' }}>
                                    {[
                                        { label: 'Age',    value: client.age },
                                        { label: 'Weight', value: `${client.weight}kg` },
                                        { label: 'Height', value: `${client.height}cm` },
                                    ].map(({ label, value }) => (
                                        <div key={label} style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2)' }}>
                                            <div style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>{value}</div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{label}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* ── Goal + Program (fixed 2-col, always same height) ── */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border)' }}>
                                    <div>
                                        <p style={fieldLabelStyle}>Goal</p>
                                        <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginTop: 3 }}>{client.goal}</p>
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={fieldLabelStyle}>Program</p>
                                        <p style={{ fontSize: 'var(--text-sm)', marginTop: 3, fontWeight: assignedProg ? 600 : 400, color: assignedProg ? 'var(--accent)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {assignedProg ? assignedProg.name : '—'}
                                        </p>
                                    </div>
                                </div>

                                {/* ── Badges ── */}
                                <div style={{ minHeight: 24, display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                    {client.badges.map(b => <Badge key={b} badgeId={b} size="sm" />)}
                                </div>

                                {/* ── Actions — right aligned ── */}
                                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border)' }}>
                                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(client)}>
                                        <Pencil size={13} /> Edit
                                    </button>
                                    <button className="btn btn-primary btn-sm" onClick={() => openProgramModal(client)}>
                                        <Calendar size={13} />
                                        {assignedProg ? 'Change Program' : 'Assign Program'}
                                    </button>
                                </div>

                            </div>
                        )
                    })}
                </div>
            )}

            {/* ══ Body Composition Modal ══ */}
            <Modal isOpen={!!editingClient} onClose={closeEdit} title={`Body Composition — ${editingClient?.name}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
                        {fields.map(({ key, label, unit, placeholder }) => (
                            <div key={key}>
                                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-2)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'capitalize' }}>
                                    {label}{unit ? ` (${unit})` : ''}
                                </label>
                                <input
                                    className="input"
                                    type="number"
                                    name={key}
                                    value={form[key] ?? ''}
                                    onChange={handleChange}
                                    placeholder={placeholder}
                                    min="0"
                                    step="0.1"
                                />
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border)' }}>
                        <button className="btn btn-secondary btn-sm" onClick={closeEdit}>Cancel</button>
                        <button className={`btn btn-sm ${saved ? 'btn-secondary' : 'btn-primary'}`} onClick={handleSave} style={{ minWidth: 140 }}>
                            <Save size={14} />
                            {saved ? '✓ Saved!' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ══ Assign Program Modal ══ */}
            <Modal isOpen={!!programClient} onClose={closeProgramModal} title={`Assign Program — ${programClient?.name}`} className="modal-content--xl">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
                        Select a workout program to assign. Create programs in <strong>Workout Builder</strong>.
                    </p>

                    {state.programs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)', border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
                            No programs saved yet. Go to <strong>Workout Builder</strong> to create one.
                        </div>
                    ) : (
                        /* Two-pane layout: left = program list, right = full preview panel */
                        <div style={{ display: 'flex', gap: 'var(--space-4)', minHeight: 0 }}>

                            {/* ── Left: program list (always fixed, never disrupted) ── */}
                            <div style={{ flex: expandedProgId ? '0 0 260px' : '1', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxHeight: 460, overflowY: 'auto', paddingRight: 4, transition: 'flex 0.2s ease' }}>
                                {state.programs.map(prog => {
                                    const isSelected = selectedProgId === prog.id
                                    const isExpanded = expandedProgId === prog.id
                                    const totalEx    = prog.days.reduce((a, d) => a + d.exercises.length, 0)
                                    return (
                                        <div key={prog.id} style={{
                                            border: `2px solid ${isSelected ? 'var(--accent)' : isExpanded ? 'rgba(139,92,246,0.4)' : 'var(--border)'}`,
                                            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                                            background: isSelected ? 'color-mix(in srgb, var(--accent) 8%, var(--bg-card))' : 'var(--bg-card)',
                                            transition: 'all 0.18s ease', flexShrink: 0,
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', cursor: 'pointer' }}
                                                onClick={() => setSelectedProgId(isSelected ? null : prog.id)}>
                                                <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`, background: isSelected ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.18s' }}>
                                                    {isSelected && <CheckCircle2 size={11} color="#fff" />}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontWeight: 700, fontSize: 'var(--text-xs)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prog.name}</p>
                                                    <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{prog.days.length}d/wk · {totalEx} ex</p>
                                                </div>
                                                <button className="btn btn-secondary btn-sm"
                                                    style={{ fontSize: 10, padding: '3px 8px', flexShrink: 0 }}
                                                    onClick={e => { e.stopPropagation(); setExpandedProgId(isExpanded ? null : prog.id) }}>
                                                    {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                                Preview</button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* ── Right: full preview panel (only when a preview is open) ── */}
                            {expandedProgId && (() => {
                                const prev = state.programs.find(p => p.id === expandedProgId)
                                if (!prev) return null
                                return (
                                    <div style={{ flex: 1, minWidth: 0, maxHeight: 460, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingRight: 2 }}>
                                        {/* Preview header */}
                                        <div style={{ flexShrink: 0, padding: 'var(--space-2) var(--space-3)', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{prev.name}</p>
                                                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
                                                    {prev.days.length} day{prev.days.length !== 1 ? 's' : ''}/week · {prev.days.reduce((a, d) => a + d.exercises.length, 0)} exercises
                                                </p>
                                            </div>
                                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16, padding: 4, lineHeight: 1 }}
                                                onClick={() => setExpandedProgId(null)}>×</button>
                                        </div>

                                        {/* Days + exercises */}
                                        {prev.days.map(day => (
                                            <div key={day.id} style={{ flexShrink: 0 }}>
                                                {/* Day header */}
                                                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6, paddingLeft: 2 }}>
                                                    {day.day}{day.label ? ` · ${day.label}` : ''}
                                                </p>
                                                {/* Exercise cards */}
                                                {day.exercises.map((ex, exIdx) => {
                                                    const hasWeight = ex.showWeight && !ex.isTimeBased
                                                    return (
                                                        <div key={`prev-${day.id}-${exIdx}`} style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: 8, overflow: 'hidden' }}>
                                                            {/* Ex header */}
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
                                                                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', minWidth: 20 }}>#{exIdx + 1}</span>
                                                                <span style={{ fontWeight: 700, fontSize: 'var(--text-xs)', flex: 1 }}>{ex.name}</span>
                                                                <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: ex.isTimeBased ? '#064e3b' : ex.type === 'Compound' ? '#1e3a5f' : '#3b1d60', color: '#fff', fontWeight: 700 }}>
                                                                    {ex.isTimeBased ? 'Timed' : ex.type}
                                                                </span>
                                                                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{ex.muscle}</span>
                                                            </div>
                                                            {/* Set rows */}
                                                            <div style={{ padding: '6px 12px' }}>
                                                                {/* Col headers */}
                                                                <div style={{ display: 'grid', gridTemplateColumns: hasWeight ? '24px 1fr 1fr' : '24px 1fr', gap: 6, marginBottom: 4 }}>
                                                                    <span style={miniThStyle}>SET</span>
                                                                    <span style={{ ...miniThStyle, textAlign: 'center' }}>{ex.isTimeBased ? 'TIME' : 'REPS'}</span>
                                                                    {hasWeight && <span style={{ ...miniThStyle, textAlign: 'center' }}>WEIGHT</span>}
                                                                </div>
                                                                {ex.sets.map((set, si) => (
                                                                    <div key={`prev-s${si}`} style={{ display: 'grid', gridTemplateColumns: hasWeight ? '24px 1fr 1fr' : '24px 1fr', gap: 6, marginBottom: 4, alignItems: 'center' }}>
                                                                        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center' }}>{si + 1}</span>
                                                                        <span style={{ textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '4px 0', fontSize: 11, fontWeight: 600 }}>
                                                                            {ex.isTimeBased ? `${set.duration ?? 30}s` : (set.reps ?? 10)}
                                                                        </span>
                                                                        {hasWeight && (
                                                                            <span style={{ textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '4px 0', fontSize: 11, fontWeight: 600 }}>
                                                                                {set.weight && set.weight !== '' ? `${set.weight}kg` : '—'}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                )
                            })()}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                        <button className="btn btn-secondary btn-sm" onClick={closeProgramModal}>Cancel</button>
                        <button
                            className={`btn btn-sm ${assignSaved ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={handleAssignProgram}
                            disabled={!selectedProgId}
                            style={{ minWidth: 168, opacity: selectedProgId ? 1 : 0.5 }}
                        >
                            <Calendar size={14} />
                            {assignSaved ? '✓ Program Assigned!' : 'Assign to Client'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const fieldLabelStyle = {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
}

const chipStyle = {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '3px 10px', borderRadius: 'var(--radius-full)',
    fontSize: 'var(--text-xs)', fontWeight: 600,
    background: 'var(--bg-input)', border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
}

const actionBtnStyle = {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--text-secondary)', fontSize: 'var(--text-sm)',
    fontWeight: 600, padding: 0,
}

function statusBadgeStyle(status) {
    const map = {
        active:   { bg: 'rgba(34,197,94,0.12)',  color: '#22c55e', border: 'rgba(34,197,94,0.3)'  },
        expiring: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
        expired:  { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', border: 'rgba(239,68,68,0.3)'  },
    }
    const c = map[status] ?? map.active
    return {
        display: 'inline-block', fontSize: 11, fontWeight: 700,
        padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap',
        background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }
}

const miniThStyle = {
    fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase',
    fontWeight: 700, letterSpacing: '0.05em',
}
