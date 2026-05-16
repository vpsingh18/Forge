import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import Modal from '../../components/Modal'
import { getInitials } from '../../utils/helpers'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateTimeSlots() {
    const slots = []
    for (let h = 6; h <= 21; h++) {
        slots.push(`${String(h).padStart(2, '0')}:00`)
        if (h < 21) slots.push(`${String(h).padStart(2, '0')}:30`)
    }
    return slots
}
const TIME_SLOTS = generateTimeSlots()

function fmt12(t) {
    if (!t) return ''
    const [h, m] = t.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`
}

const GOAL_META = {
    'Muscle Gain':     { color: '#60a5fa', bg: '#1e3a5f' },
    'Weight Loss':     { color: '#34d399', bg: '#064e3b' },
    'Strength':        { color: '#c084fc', bg: '#3b1d60' },
    'General Fitness': { color: '#a78bfa', bg: '#1c1c2e' },
    'Flexibility':     { color: '#4ade80', bg: '#1a2e1a' },
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────
function MiniCalendar({ selected, onChange }) {
    const today = new Date()
    const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })

    const firstDay  = new Date(view.year, view.month, 1).getDay()
    const daysCount = new Date(view.year, view.month + 1, 0).getDate()
    const blanks    = (firstDay + 6) % 7 // Mon-start offset

    const monthLabel = new Date(view.year, view.month).toLocaleString('default', { month: 'long', year: 'numeric' })

    function toISO(d) {
        return `${view.year}-${String(view.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    }
    const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    return (
        <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', userSelect: 'none' }}>
            {/* Month nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <button onClick={() => setView(v => {
                    const d = new Date(v.year, v.month - 1)
                    return { year: d.getFullYear(), month: d.getMonth() }
                })} style={navBtn}><ChevronLeft size={14} /></button>
                <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{monthLabel}</span>
                <button onClick={() => setView(v => {
                    const d = new Date(v.year, v.month + 1)
                    return { year: d.getFullYear(), month: d.getMonth() }
                })} style={navBtn}><ChevronRight size={14} /></button>
            </div>
            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
                {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', padding: '4px 0' }}>{d}</div>
                ))}
            </div>
            {/* Day grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                {Array.from({ length: blanks }).map((_, i) => <div key={`b${i}`} />)}
                {Array.from({ length: daysCount }, (_, i) => i + 1).map(d => {
                    const iso  = toISO(d)
                    const isSel   = iso === selected
                    const isToday = iso === todayISO
                    const isPast  = iso < todayISO
                    return (
                        <button key={d} disabled={isPast} onClick={() => onChange(iso)} style={{
                            textAlign: 'center', fontSize: 12, fontWeight: isSel ? 800 : isToday ? 700 : 400,
                            padding: '6px 0', borderRadius: 6, border: 'none', cursor: isPast ? 'default' : 'pointer',
                            background: isSel ? 'var(--accent)' : isToday ? 'rgba(139,92,246,0.2)' : 'transparent',
                            color: isSel ? '#fff' : isPast ? 'var(--text-muted)' : 'var(--text-primary)',
                            opacity: isPast ? 0.35 : 1,
                        }}>{d}</button>
                    )
                })}
            </div>
        </div>
    )
}

// ─── Session Booking Modal ────────────────────────────────────────────────────
export default function SessionBookingModal({ isOpen, onClose, ptClients, onConfirm }) {
    const [step,     setStep]     = useState(1)
    const [clientId, setClientId] = useState(null)
    const [date,     setDate]     = useState('')
    const [timeFrom, setTimeFrom] = useState('')
    const [timeTo,   setTimeTo]   = useState('')
    const [notes,    setNotes]    = useState('')
    const [done,     setDone]     = useState(false)

    const selectedClient = ptClients.find(c => c.id === clientId)
    const toSlots = useMemo(() => TIME_SLOTS.filter(t => t > timeFrom), [timeFrom])

    function reset() {
        setStep(1); setClientId(null); setDate(''); setTimeFrom(''); setTimeTo(''); setNotes(''); setDone(false)
    }

    function handleClose() { reset(); onClose() }

    function handleConfirm() {
        onConfirm({ clientId, clientName: selectedClient.name, date, timeFrom, timeTo, notes })
        setDone(true)
        setTimeout(() => { reset(); onClose() }, 900)
    }

    const STEP_LABELS = ['Select Client', 'Pick Date', 'Time Slot']

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Book a Session">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

                {/* Step indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {STEP_LABELS.map((l, i) => {
                        const s = i + 1
                        const active = step === s
                        const done   = step > s
                        return (
                            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: s < 3 ? 1 : 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                                    <div style={{
                                        width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 10, fontWeight: 800, background: done ? '#22c55e' : active ? 'var(--accent)' : 'var(--bg-input)',
                                        color: done || active ? '#fff' : 'var(--text-muted)', flexShrink: 0,
                                    }}>{done ? '✓' : s}</div>
                                    <span style={{ fontSize: 10, fontWeight: active ? 700 : 400, color: active ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{l}</span>
                                </div>
                                {s < 3 && <div style={{ flex: 1, height: 1, background: done ? '#22c55e' : 'var(--border)' }} />}
                            </div>
                        )
                    })}
                </div>

                {/* ── Step 1: Select Client ── */}
                {step === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Select a PT client for this session</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxHeight: 300, overflowY: 'auto' }}>
                            {ptClients.map(c => {
                                const isSelected = clientId === c.id
                                const meta = GOAL_META[c.goal] ?? GOAL_META['General Fitness']
                                return (
                                    <div key={c.id} onClick={() => setClientId(c.id)} style={{
                                        border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                                        borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-4)', cursor: 'pointer',
                                        background: isSelected ? 'color-mix(in srgb, var(--accent) 8%, var(--bg-card))' : 'var(--bg-card)',
                                        display: 'flex', alignItems: 'center', gap: 'var(--space-3)', transition: 'all 0.15s',
                                    }}>
                                        <div className="member-avatar" style={{ width: 38, height: 38, fontSize: 13, flexShrink: 0 }}>
                                            {getInitials(c.name)}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{c.name}</p>
                                            <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: meta.bg, color: meta.color }}>{c.goal}</span>
                                        </div>
                                        {isSelected && <CheckCircle2 size={18} color="var(--accent)" style={{ flexShrink: 0 }} />}
                                    </div>
                                )
                            })}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn btn-primary btn-sm" disabled={!clientId} onClick={() => setStep(2)}
                                style={{ opacity: clientId ? 1 : 0.4 }}>Next →</button>
                        </div>
                    </div>
                )}

                {/* ── Step 2: Pick Date ── */}
                {step === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                            Booking session for <strong>{selectedClient?.name}</strong>
                        </p>
                        <MiniCalendar selected={date} onChange={setDate} />
                        {date && (
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--accent)', textAlign: 'center' }}>
                                Selected: {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'space-between' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => setStep(1)}>← Back</button>
                            <button className="btn btn-primary btn-sm" disabled={!date} onClick={() => setStep(3)}
                                style={{ opacity: date ? 1 : 0.4 }}>Next →</button>
                        </div>
                    </div>
                )}

                {/* ── Step 3: Time Slot ── */}
                {step === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                            <strong>{selectedClient?.name}</strong> · {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                            <div>
                                <label style={lbl}>From</label>
                                <select className="input" value={timeFrom} onChange={e => { setTimeFrom(e.target.value); setTimeTo('') }}>
                                    <option value="">Select time</option>
                                    {TIME_SLOTS.map(t => <option key={t} value={t}>{fmt12(t)}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={lbl}>To</label>
                                <select className="input" value={timeTo} onChange={e => setTimeTo(e.target.value)} disabled={!timeFrom}>
                                    <option value="">Select time</option>
                                    {toSlots.map(t => <option key={t} value={t}>{fmt12(t)}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={lbl}>Notes (optional)</label>
                            <textarea className="input" rows={2} style={{ resize: 'none' }}
                                placeholder="e.g. Focus on upper body, bring resistance bands…"
                                value={notes} onChange={e => setNotes(e.target.value)} />
                        </div>

                        {timeFrom && timeTo && (
                            <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                                <span style={{ fontWeight: 700 }}>Session Summary:</span>{' '}
                                <span style={{ color: 'var(--accent)' }}>{fmt12(timeFrom)} – {fmt12(timeTo)}</span>
                                {' '}({(() => {
                                    const [fh, fm] = timeFrom.split(':').map(Number)
                                    const [th, tm] = timeTo.split(':').map(Number)
                                    return (th * 60 + tm) - (fh * 60 + fm)
                                })()} min)
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'space-between', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border)' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => setStep(2)}>← Back</button>
                            <button className={`btn btn-sm ${done ? 'btn-secondary' : 'btn-primary'}`}
                                disabled={!timeFrom || !timeTo} onClick={handleConfirm}
                                style={{ minWidth: 148, opacity: timeFrom && timeTo ? 1 : 0.4 }}>
                                {done ? '✓ Session Booked!' : 'Confirm Session'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    )
}

const lbl = {
    display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-muted)',
    fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4,
}

const navBtn = {
    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)',
    padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center',
}
