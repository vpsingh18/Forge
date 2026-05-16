import { useState } from 'react'
import { TrendingUp, TrendingDown, Minus, ClipboardList, History, Save } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/helpers'
import Modal from '../../components/Modal'
import { analyzeTrends, mapGoalToEnum } from '../../utils/trendEngine'

// ─── Config ──────────────────────────────────────────────────────────────────
// 4 metrics shown on the card preview
const PREVIEW_METRICS = [
    { key: 'weight',     label: 'Weight',    unit: 'kg' },
    { key: 'bmi',        label: 'BMI',       unit: ''   },
    { key: 'bodyFat',    label: 'Body Fat',  unit: '%'  },
    { key: 'muscleMass', label: 'Muscle',    unit: 'kg' },
]

// All 8 metrics — used in the log form and history table
const ALL_METRICS = [
    { key: 'weight',        label: 'Weight',       unit: 'kg', placeholder: '75.0'  },
    { key: 'bmi',           label: 'BMI',          unit: '',   placeholder: '23.5'  },
    { key: 'bodyFat',       label: 'Body Fat',     unit: '%',  placeholder: '18.5'  },
    { key: 'muscleMass',    label: 'Muscle Mass',  unit: 'kg', placeholder: '35.0'  },
    { key: 'fatFreeWeight', label: 'Fat-Free Wt',  unit: 'kg', placeholder: '61.5'  },
    { key: 'visceralFat',   label: 'Visceral Fat', unit: '',   placeholder: '7'     },
    { key: 'boneMass',      label: 'Bone Mass',    unit: 'kg', placeholder: '3.2'   },
    { key: 'bodyWater',     label: 'Body Water',   unit: '%',  placeholder: '55.0'  },
]

const GOAL_META = {
    'Muscle Gain':     { color: '#60a5fa', bg: '#1e3a5f' },
    'Weight Loss':     { color: '#34d399', bg: '#064e3b' },
    'Strength':        { color: '#c084fc', bg: '#3b1d60' },
    'General Fitness': { color: '#a78bfa', bg: '#1c1c2e' },
    'Flexibility':     { color: '#4ade80', bg: '#1a2e1a' },
}

const SC = { POSITIVE: '#22c55e', NEGATIVE: '#ef4444', NEUTRAL: 'var(--text-muted)' }

function toToday() { return new Date().toISOString().split('T')[0] }
function fmtVal(v, u) { return v != null ? (u ? `${v}${u}` : `${v}`) : '—' }
function fmtDelta(d, u) { return d > 0 ? (u ? `${Number(d).toFixed(1)}${u}` : Number(d).toFixed(1)) : null }

// ─── Trend indicator shown below a metric value ───────────────────────────────
function TrendRow({ mt, unit }) {
    if (!mt) return <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>baseline</div>
    const color = SC[mt.sentiment]
    if (mt.direction === 'STABLE') return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
            <Minus size={10} /> stable
        </div>
    )
    const Icon = mt.direction === 'UP' ? TrendingUp : TrendingDown
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <Icon size={10} color={color} />
            <span style={{ fontSize: 10, fontWeight: 700, color }}>{fmtDelta(mt.delta, unit)}</span>
        </div>
    )
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ProgressTracker() {
    const { state, dispatch } = useApp()
    const { user }            = useAuth()
    const ptClients = state.members.filter(m => m.membershipType === 'pt' && m.trainerId === user?.id)

    const [logClient,     setLogClient]     = useState(null)
    const [historyClient, setHistoryClient] = useState(null)
    const [logForm,       setLogForm]       = useState({})
    const [logSaved,      setLogSaved]      = useState(false)

    function getClientLogs(id) {
        return state.progressLogs.find(e => e.memberId === id)?.logs ?? []
    }

    function openLog(client) {
        setLogForm({
            date:          toToday(),
            weight:        '',
            bmi:           '',
            bodyFat:       '',
            muscleMass:    '',
            fatFreeWeight: '',
            visceralFat:   '',
            boneMass:      '',
            bodyWater:     '',
        })
        setLogSaved(false)
        setLogClient(client)
    }

    function closeLog() { setLogClient(null); setLogForm({}); setLogSaved(false) }

    function handleLogSave() {
        const num = k => logForm[k] !== '' && logForm[k] != null ? parseFloat(logForm[k]) : null
        dispatch({
            type: 'ADD_PROGRESS_LOG',
            payload: {
                memberId: logClient.id,
                log: {
                    id: `log-${Date.now()}`, date: logForm.date,
                    weight: num('weight'), bmi: num('bmi'), bodyFat: num('bodyFat'),
                    fatFreeWeight: num('fatFreeWeight'), visceralFat: num('visceralFat'),
                    muscleMass: num('muscleMass'), boneMass: num('boneMass'),
                    bodyWater: num('bodyWater'), age: logClient.age ?? null,
                }
            }
        })
        setLogSaved(true)
        setTimeout(closeLog, 800)
    }

    return (
        <div className="animate-fade-in-up">
            <div className="page-header">
                <h1><span>Progress</span> <span className="text-gradient">Tracker</span></h1>
                <p>Body composition check-ins · {ptClients.length} PT client{ptClients.length !== 1 ? 's' : ''}</p>
            </div>

            {ptClients.length === 0 ? (
                <div className="card-flat" style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--text-muted)' }}>
                    No PT clients assigned to you.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-5)', alignItems: 'stretch' }}>
                    {ptClients.map(client => {
                        const logs    = getClientLogs(client.id)
                        const latest  = logs[logs.length - 1] ?? null
                        const prev    = logs[logs.length - 2] ?? null
                        const goalKey = mapGoalToEnum(client.goal)
                        const trend   = analyzeTrends(latest, prev, goalKey)
                        const meta    = GOAL_META[client.goal] ?? GOAL_META['General Fitness']

                        return (
                            <div className="card" key={client.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 'var(--space-5)', height: '100%' }}>

                                {/* ── Avatar + Name + Goal + Status ── */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <div className="member-avatar" style={{ width: 48, height: 48, fontSize: 'var(--text-base)', flexShrink: 0 }}>
                                            {getInitials(client.name)}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 700, fontSize: 'var(--text-base)', lineHeight: 1.3 }}>{client.name}</p>
                                            <span style={{ display: 'inline-block', marginTop: 4, fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 999, background: meta.bg, color: meta.color }}>
                                                {client.goal}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <span style={statusPill(client.status)}>{client.status}</span>
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 5 }}>
                                            {logs.length === 0 ? 'No check-ins' : `${logs.length} check-in${logs.length !== 1 ? 's' : ''}`}
                                        </div>
                                        {latest && <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>Last: {latest.date}</div>}
                                    </div>
                                </div>

                                {/* ── 4-metric preview row ── */}
                                {latest ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-2)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border)', alignItems: 'stretch' }}>
                                        {PREVIEW_METRICS.map(({ key, label, unit }) => {
                                            const val = latest[key]
                                            const mt  = trend.status === 'TREND' ? trend.metrics?.[key] : null
                                            return (
                                                <div key={key} style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: '12px 6px 10px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                                                    {/* Label row — fixed height */}
                                                    <div style={{ height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                                                            {label}
                                                        </span>
                                                    </div>
                                                    {/* Value row — fixed height */}
                                                    <div style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
                                                        <span style={{ fontSize: 16, fontWeight: 800, lineHeight: 1, whiteSpace: 'nowrap' }}>
                                                            {fmtVal(val, unit)}
                                                        </span>
                                                    </div>
                                                    {/* Trend row — fixed height */}
                                                    <div style={{ height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
                                                        <TrendRow mt={mt} unit={unit} />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-1)' }}>
                                        No metrics logged yet.
                                    </div>
                                )}

                                {/* ── Actions ── */}
                                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border)' }}>
                                    {logs.length > 0 && (
                                        <button className="btn btn-secondary btn-sm" onClick={() => setHistoryClient(client)}>
                                            <History size={13} /> History ({logs.length})
                                        </button>
                                    )}
                                    <button className="btn btn-primary btn-sm" onClick={() => openLog(client)}>
                                        <ClipboardList size={13} /> Log Progress
                                    </button>
                                </div>

                            </div>
                        )
                    })}
                </div>
            )}

            {/* ══ Log Progress Modal ══ */}
            <Modal isOpen={!!logClient} onClose={closeLog} title={`Log Progress — ${logClient?.name}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {/* Date — full width */}
                    <div>
                        <label style={lbl}>Date</label>
                        <input className="input" type="date" value={logForm.date ?? ''}
                            onChange={e => setLogForm(p => ({ ...p, date: e.target.value }))} />
                    </div>

                    {/* Section header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Body Metrics</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    </div>

                    {/* 2-col metric grid — wide enough so labels never wrap */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
                        {ALL_METRICS.map(({ key, label, unit, placeholder }) => (
                            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                <label style={{ ...lbl, display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 0 }}>
                                    {label}
                                    {unit && <span style={{ fontWeight: 400, fontSize: 9, color: 'var(--text-muted)', textTransform: 'lowercase', letterSpacing: 0 }}>({unit})</span>}
                                </label>
                                <input className="input" type="number" min="0" step="0.1"
                                    placeholder={placeholder}
                                    value={logForm[key] ?? ''}
                                    onChange={e => setLogForm(p => ({ ...p, [key]: e.target.value }))} />
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border)' }}>
                        <button className="btn btn-secondary btn-sm" onClick={closeLog}>Cancel</button>
                        <button className={`btn btn-sm ${logSaved ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={handleLogSave} style={{ minWidth: 148 }}>
                            <Save size={13} />
                            {logSaved ? '✓ Saved!' : 'Save Progress'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ══ History Modal ══ */}
            <Modal isOpen={!!historyClient} onClose={() => setHistoryClient(null)}
                title={`Progress History — ${historyClient?.name}`} className="modal-content--xl">
                {historyClient && (() => {
                    const logs    = getClientLogs(historyClient.id)
                    const goalKey = mapGoalToEnum(historyClient.goal)
                    const meta    = GOAL_META[historyClient.goal] ?? GOAL_META['General Fitness']
                    return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 999, background: meta.bg, color: meta.color }}>{historyClient.goal}</span>
                                <span><span style={{ color: '#22c55e' }}>●</span> Positive</span>
                                <span><span style={{ color: '#ef4444' }}>●</span> Negative</span>
                                <span style={{ color: 'var(--text-muted)' }}><span style={{ color: 'var(--text-muted)' }}>●</span> Neutral</span>
                            </div>
                            <div style={{ overflowX: 'auto', maxHeight: 440, overflowY: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                                    <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1 }}>
                                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                            <th style={th}>Date</th>
                                            {ALL_METRICS.map(m => <th key={m.key} style={th}>{m.label}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...logs].reverse().map((entry, rIdx, arr) => {
                                            const prevEntry  = arr[rIdx + 1] ?? null
                                            const isBaseline = !prevEntry
                                            const isLatest   = rIdx === 0
                                            const t = analyzeTrends(entry, prevEntry, goalKey)
                                            return (
                                                <tr key={entry.id} style={{ borderBottom: '1px solid var(--border)', background: isLatest ? 'color-mix(in srgb, var(--accent) 5%, transparent)' : 'transparent' }}>
                                                    <td style={{ ...td, whiteSpace: 'nowrap' }}>
                                                        <div style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>{entry.date}</div>
                                                        {isBaseline && <span style={tag('#6d28d9', '#c4b5fd')}>Baseline</span>}
                                                        {isLatest && !isBaseline && <span style={tag('#065f46', '#34d399')}>Latest</span>}
                                                    </td>
                                                    {ALL_METRICS.map(({ key, unit }) => {
                                                        const m = t.status === 'TREND' ? t.metrics?.[key] : null
                                                        const color = m ? SC[m.sentiment] : null
                                                        return (
                                                            <td key={key} style={td}>
                                                                <div style={{ fontWeight: 600, fontSize: 'var(--text-xs)' }}>{fmtVal(entry[key], unit)}</div>
                                                                {m && m.delta > 0 ? (
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 2 }}>
                                                                        {m.direction === 'UP' ? <TrendingUp size={9} color={color} /> : m.direction === 'DOWN' ? <TrendingDown size={9} color={color} /> : <Minus size={9} color="var(--text-muted)" />}
                                                                        <span style={{ fontSize: 9, fontWeight: 700, color }}>{fmtDelta(m.delta, unit)}</span>
                                                                    </div>
                                                                ) : (
                                                                    <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{isBaseline ? 'baseline' : '—'}</div>
                                                                )}
                                                            </td>
                                                        )
                                                    })}
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                })()}
            </Modal>
        </div>
    )
}

// ── Styles ───────────────────────────────────────────────────────────────────
const lbl = {
    display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-muted)',
    fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4,
}
const th = {
    textAlign: 'left', padding: '8px 10px', fontSize: 10, fontWeight: 700,
    color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap',
}
const td = { padding: '10px 10px', verticalAlign: 'top' }

function tag(bg, color) {
    return { display: 'inline-block', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 999, background: bg, color, marginTop: 3 }
}

function statusPill(status) {
    const m = {
        active:   { bg: 'rgba(34,197,94,0.12)',  color: '#22c55e', border: 'rgba(34,197,94,0.3)'  },
        expiring: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
        expired:  { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', border: 'rgba(239,68,68,0.3)'  },
    }
    const c = m[status] ?? m.active
    return { display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: c.bg, color: c.color, border: `1px solid ${c.border}` }
}
