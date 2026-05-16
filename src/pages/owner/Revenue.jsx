import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency, getInitials, formatDate, daysUntil } from '../../utils/helpers'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../../components/StatCard'
import './Revenue.css'

const TooltipStyle = { backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#F5F5F5' }

const PLAN_COLORS = {
    pt: '#8B5CF6',
    premium: '#8B5CF6',
    regular: '#F59E0B',
    standard: '#F59E0B',
    basic: '#22C55E',
}

export default function Revenue() {
    const { state } = useApp()
    const { user } = useAuth()
    const { analytics, members } = state

    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState({ paid: true, overdue: true, pending: true })
    const [overdueOpen, setOverdueOpen] = useState(false)
    const [notifyModal, setNotifyModal] = useState(null)
    const [exportModal, setExportModal] = useState(false)

    // ── Computed data from members ──
    const totalMembers = members.length
    const totalRevenue = members.reduce((s, m) => s + (m.amountPaid || 0), 0)
    const prevMonthRevenue = analytics.revenue.lastMonth
    const revenueTarget = analytics.revenue.target
    const growthPct = prevMonthRevenue > 0 ? ((totalRevenue - prevMonthRevenue) / prevMonthRevenue * 100).toFixed(1) : 0
    const growthAmt = totalRevenue - prevMonthRevenue

    const overdueMembers = members.filter(m => m.status === 'expired')
    const overdueTotal = overdueMembers.reduce((s, m) => s + (m.amountPaid || 0), 0)
    const pendingMembers = members.filter(m => m.status === 'expiring')
    const pendingTotal = pendingMembers.reduce((s, m) => s + (m.amountPaid || 0), 0)
    const paidMembers = members.filter(m => m.status === 'active')
    const netProfit = totalRevenue - Math.round(totalRevenue * 0.31)
    const expenses = Math.round(totalRevenue * 0.31)

    // ── Plan breakdown ──
    const planBreakdown = useMemo(() => {
        const ptCount = members.filter(m => m.membershipType === 'pt').length
        const regularCount = members.filter(m => m.membershipType !== 'pt').length
        const ptRev = members.filter(m => m.membershipType === 'pt').reduce((s, m) => s + (m.amountPaid || 0), 0)
        const regRev = members.filter(m => m.membershipType !== 'pt').reduce((s, m) => s + (m.amountPaid || 0), 0)
        const total = ptRev + regRev || 1
        return [
            { name: 'Premium / PT', count: ptCount, revenue: ptRev, pct: Math.round(ptRev / total * 100), color: '#8B5CF6' },
            { name: 'Standard / Regular', count: regularCount, revenue: regRev, pct: Math.round(regRev / total * 100), color: '#F59E0B' },
        ]
    }, [members])

    // ── Revenue bar chart data ──
    const chartData = analytics.revenue.breakdown

    // ── Payment table rows ──
    const tableRows = useMemo(() => {
        const activeStatuses = Object.keys(statusFilter).filter(k => statusFilter[k])
        return members
            .map(m => {
                let status = 'paid'
                if (m.status === 'expired') status = 'overdue'
                else if (m.status === 'expiring') status = 'pending'
                return { ...m, payStatus: status }
            })
            .filter(m => {
                if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false
                if (activeStatuses.length > 0 && !activeStatuses.includes(m.payStatus)) return false
                return true
            })
    }, [members, search, statusFilter])

    const toggleStatus = (key) => {
        setStatusFilter(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const pillClass = (key) => {
        if (!statusFilter[key]) return 'rev-filter-pill'
        return `rev-filter-pill rev-pill-${key}`
    }

    return (
        <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {/* ── Header ── */}
            <div className="rev-header">
                <div>
                    <h1 className="rev-title">REVENUE</h1>
                    <p className="rev-meta">{user?.gymName || 'Iron Peak Gym'} · Feb 2026 · {totalMembers} active members</p>
                </div>
                <div className="rev-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => setExportModal(true)}>📥 Export Report</button>
                    <button className="btn btn-primary btn-sm" onClick={() => setNotifyModal('all')}>📣 Send Reminder</button>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="rev-stats">
                <StatCard
                    label="Monthly Revenue"
                    value={formatCurrency(totalRevenue)}
                    trend={`${Math.round(totalRevenue / (revenueTarget || 1) * 100)}% of goal`}
                    trendDirection="none"
                    trendVariant="warning"
                    sub={`Target: ${formatCurrency(revenueTarget)}`}
                />
                <StatCard
                    label="Collected"
                    value={formatCurrency(totalRevenue)}
                    trend={`↑ ${growthPct}%`}
                    trendDirection="up"
                    trendVariant="success"
                    sub={`From ${paidMembers.length} members`}
                />
                <StatCard
                    label="Overdue Payments"
                    value={formatCurrency(overdueTotal)}
                    trend={`⚠ ${overdueMembers.length} members`}
                    trendDirection="none"
                    trendVariant="danger"
                    sub="Action needed"
                />
                <StatCard
                    label="Net Profit"
                    value={formatCurrency(netProfit)}
                    trend={`↑ 8.2%`}
                    trendDirection="up"
                    trendVariant="success"
                    sub={`After ${formatCurrency(expenses)} expenses`}
                />
            </div>

            {/* ── Overdue Alert Banner ── */}
            {statusFilter.overdue && overdueMembers.length > 0 && (
                <div className="rev-overdue-banner">
                    <div className="rev-overdue-icon">⚠️</div>
                    <div className="rev-overdue-text">
                        <strong>{overdueMembers.length} overdue payments detected — {formatCurrency(overdueTotal)} at risk</strong>
                        <span>Memberships expired with no payment. Send reminders or view individual accounts below.</span>
                    </div>
                    <div className="rev-overdue-actions">
                        <button className="btn btn-sm btn-secondary" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => setOverdueOpen(true)}>View Overdue List</button>
                        <button className="btn btn-sm btn-danger" onClick={() => setNotifyModal('overdue')}>Send Reminder</button>
                    </div>
                </div>
            )}

            {/* ── Charts Row ── */}
            <div className="rev-charts-grid">
                {/* Revenue Trend */}
                <div className="rev-card">
                    <div className="rev-card-head">
                        <div className="rev-card-title">Monthly Revenue Trend</div>
                        <div className="rev-card-meta">{chartData[0]?.month} – {chartData[chartData.length - 1]?.month} 2026</div>
                    </div>
                    <div className="rev-card-body">
                        <ResponsiveContainer width="100%" height={160}>
                            <LineChart data={chartData}>
                                <XAxis dataKey="month" tick={{ fill: '#6B6B6B', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#6B6B6B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} />
                                <Tooltip contentStyle={TooltipStyle} formatter={v => [formatCurrency(v), 'Revenue']} />
                                <Line type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={2.5} dot={{ fill: '#F59E0B', r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="rev-chart-summary">
                            <div>
                                <div className="rev-cs-label">THIS MONTH</div>
                                <div className="rev-cs-val">{formatCurrency(totalRevenue)}</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div className="rev-cs-label">PREV MONTH</div>
                                <div className="rev-cs-val" style={{ color: 'var(--text-muted)' }}>{formatCurrency(prevMonthRevenue)}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div className="rev-cs-label">GROWTH</div>
                                <div className="rev-cs-val" style={{ color: 'var(--success)' }}>↑ {growthPct}%</div>
                                <div className="rev-cs-sub">+{formatCurrency(growthAmt)} MoM</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Breakdown */}
                <div className="rev-card">
                    <div className="rev-card-head">
                        <div className="rev-card-title">Payment Breakdown</div>
                        <div className="rev-card-meta">By plan type</div>
                    </div>
                    <div className="rev-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Donut */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                            <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
                                <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
                                    {planBreakdown.map((p, i) => {
                                        const r = 36, circ = 2 * Math.PI * r
                                        const prevOffset = planBreakdown.slice(0, i).reduce((s, x) => s + (x.pct / 100) * circ, 0)
                                        return (
                                            <circle key={i} cx="45" cy="45" r={r} fill="none" stroke={p.color} strokeWidth="12"
                                                strokeDasharray={`${(p.pct / 100) * circ} ${circ}`}
                                                strokeDashoffset={-prevOffset}
                                            />
                                        )
                                    })}
                                </svg>
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>{totalMembers}</div>
                                    <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>MEMBERS</div>
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>PLAN DISTRIBUTION</div>
                                {planBreakdown.map((p, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, marginBottom: 4 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                                        <span style={{ flex: 1 }}>{p.name}</span>
                                        <span style={{ fontFamily: 'var(--font-mono)', color: p.color, fontWeight: 700 }}>{p.pct}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ height: 1, background: 'var(--border)' }} />

                        {/* Value breakdown */}
                        {planBreakdown.map((p, i) => (
                            <div className="rev-breakdown-item" key={i}>
                                <div className="rev-breakdown-dot" style={{ background: p.color }} />
                                <div className="rev-breakdown-name">{p.name}</div>
                                <div className="rev-breakdown-bar-wrap">
                                    <div className="rev-breakdown-bar" style={{ width: `${p.pct}%`, background: p.color }} />
                                </div>
                                <div className="rev-breakdown-val" style={{ color: p.color }}>{formatCurrency(p.revenue)}</div>
                                <div className="rev-breakdown-pct">{p.pct}%</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Filter Bar ── */}
            <div className="rev-filter-bar">
                <span className="rev-filter-label">Filters</span>
                <div className="rev-filter-sep" />
                <div className="rev-filter-group">
                    <span>Date Range</span>
                    <select className="rev-filter-select">
                        <option>All Time</option>
                        <option>1 Month</option>
                        <option>3 Months</option>
                        <option>6 Months</option>
                    </select>
                </div>
                <div className="rev-filter-sep" />
                <div className="rev-filter-group">
                    <span>Plan Type</span>
                    <select className="rev-filter-select">
                        <option>All Plans</option>
                        <option>Premium / PT</option>
                        <option>Standard / Regular</option>
                    </select>
                </div>
                <div className="rev-filter-sep" />
                <div className="rev-filter-group" style={{ gap: 5 }}>
                    <span>Status</span>
                    <div className={pillClass('paid')} onClick={() => toggleStatus('paid')}>✓ Paid</div>
                    <div className={pillClass('overdue')} onClick={() => toggleStatus('overdue')}>⚠ Overdue</div>
                    <div className={pillClass('pending')} onClick={() => toggleStatus('pending')}>⏳ Pending</div>
                </div>
            </div>

            {/* ── Payment Status Table ── */}
            <div className="rev-card">
                <div className="rev-card-head">
                    <div className="rev-card-title">Payment Status — All Members</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="rev-card-meta">Showing {tableRows.length} records</div>
                        <input
                            className="input"
                            style={{ width: 180, padding: '6px 10px', fontSize: 12 }}
                            placeholder="🔍 Search member..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="rev-table">
                        <thead>
                            <tr>
                                <th>Member</th>
                                <th>Plan</th>
                                <th>Amount</th>
                                <th>Joined</th>
                                <th>Expires</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows.map((m, i) => {
                                const bgColors = ['#F59E0B', '#8B5CF6', '#22C55E', '#EC4899', '#3B82F6']
                                const statusBadge = {
                                    paid: <span className="tag tag-success">✓ Paid</span>,
                                    overdue: <span className="tag tag-danger">⚠ Overdue</span>,
                                    pending: <span className="tag tag-warning">⏳ Pending</span>,
                                }[m.payStatus]
                                return (
                                    <tr key={m.id || i}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                                <div className="rev-m-ava" style={{ background: bgColors[i % 5], color: '#000' }}>
                                                    {getInitials(m.name)}
                                                </div>
                                                <span style={{ fontWeight: 600 }}>{m.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.membershipType === 'pt' ? 'Premium' : 'Standard'} {m.plan}</td>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>{formatCurrency(m.amountPaid || 0)}</td>
                                        <td style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{formatDate(m.joinDate)}</td>
                                        <td style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: m.payStatus === 'overdue' ? 'var(--danger)' : m.payStatus === 'pending' ? 'var(--warning)' : '' }}>{formatDate(m.expiryDate)}</td>
                                        <td>{statusBadge}</td>
                                        <td>
                                            {m.payStatus === 'overdue' ? (
                                                <button className="btn btn-danger btn-sm" style={{ fontSize: 11 }} onClick={() => setNotifyModal('overdue')}>Send Reminder</button>
                                            ) : m.payStatus === 'pending' ? (
                                                <button className="btn btn-primary btn-sm" style={{ fontSize: 11 }}>Follow Up</button>
                                            ) : (
                                                <button className="btn btn-secondary btn-sm" style={{ fontSize: 11 }}>View</button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {tableRows.length === 0 && (
                        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>No members match filters</div>
                    )}
                </div>
            </div>

            {/* ── Overdue Slide Panel ── */}
            {overdueOpen && (
                <>
                    <div className="rev-panel-overlay" onClick={() => setOverdueOpen(false)} />
                    <div className="rev-panel">
                        <div className="rev-panel-head">
                            <div className="rev-panel-title">⚠ OVERDUE LIST</div>
                            <button className="rev-panel-close" onClick={() => setOverdueOpen(false)}>✕</button>
                        </div>
                        <div className="rev-panel-body">
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, fontFamily: 'var(--font-mono)' }}>
                                {overdueMembers.length} members · {formatCurrency(overdueTotal)} at risk
                            </div>
                            <button className="btn btn-danger btn-sm" style={{ width: '100%', marginBottom: 16 }} onClick={() => setNotifyModal('overdue')}>
                                📣 Send Reminder to All Overdue
                            </button>
                            {overdueMembers.map((m, i) => (
                                <div className="rev-overdue-row" key={m.id || i}>
                                    <div className="rev-m-ava" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
                                        {getInitials(m.name)}
                                    </div>
                                    <div className="rev-overdue-member">
                                        <div className="rev-overdue-member-name">{m.name}</div>
                                        <div className="rev-overdue-member-plan">{m.membershipType === 'pt' ? 'Premium' : 'Standard'} {m.plan}</div>
                                    </div>
                                    <div>
                                        <div className="rev-overdue-amount">{formatCurrency(m.amountPaid || 0)}</div>
                                        <div className="rev-overdue-days">{Math.abs(daysUntil(m.expiryDate))}d overdue</div>
                                    </div>
                                    <button className="btn btn-sm btn-secondary" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', fontSize: 11, marginLeft: 8 }}>Remind</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* ── Send Reminder Modal ── */}
            {notifyModal && (
                <div className="rev-modal-overlay" onClick={() => setNotifyModal(null)}>
                    <div className="rev-modal" onClick={e => e.stopPropagation()}>
                        <div className="rev-modal-head">
                            <div className="rev-modal-title">SEND REMINDER</div>
                            <button className="rev-modal-close" onClick={() => setNotifyModal(null)}>✕</button>
                        </div>
                        <div className="rev-modal-body">
                            <div className="rev-fg">
                                <label className="rev-fg-label">Recipients</label>
                                <select className="rev-fg-input" defaultValue={notifyModal}>
                                    <option value="overdue">Overdue Members ({overdueMembers.length})</option>
                                    <option value="expiring">Expiring This Week ({pendingMembers.length})</option>
                                    <option value="all">All Members ({totalMembers})</option>
                                </select>
                            </div>
                            <div className="rev-fg">
                                <label className="rev-fg-label">Channel</label>
                                <select className="rev-fg-input">
                                    <option>Push Notification + SMS</option>
                                    <option>Push Notification only</option>
                                    <option>WhatsApp</option>
                                </select>
                            </div>
                            <div className="rev-fg">
                                <label className="rev-fg-label">Message</label>
                                <textarea className="rev-fg-input" rows={4} defaultValue={`Hi {name}, your membership payment is overdue. Please renew at the front desk or via the FORGE app to continue your sessions. — ${user?.gymName || 'Iron Peak Gym'} 🏋️`} />
                            </div>
                        </div>
                        <div className="rev-modal-foot">
                            <button className="btn btn-secondary btn-sm" onClick={() => setNotifyModal(null)}>Cancel</button>
                            <button className="btn btn-primary btn-sm" onClick={() => setNotifyModal(null)}>📣 Send Now</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Export Modal ── */}
            {exportModal && (
                <div className="rev-modal-overlay" onClick={() => setExportModal(false)}>
                    <div className="rev-modal" onClick={e => e.stopPropagation()}>
                        <div className="rev-modal-head">
                            <div className="rev-modal-title">EXPORT REPORT</div>
                            <button className="rev-modal-close" onClick={() => setExportModal(false)}>✕</button>
                        </div>
                        <div className="rev-modal-body">
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Choose format to export the February 2026 Revenue Report</p>
                            <div className="rev-export-option" onClick={() => setExportModal(false)}>
                                <div className="rev-export-icon">📄</div>
                                <div><div className="rev-export-name">PDF Report</div><div className="rev-export-desc">Formatted report with charts and summary for printing</div></div>
                                <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>~240 KB</div>
                            </div>
                            <div className="rev-export-option" onClick={() => setExportModal(false)}>
                                <div className="rev-export-icon">📊</div>
                                <div><div className="rev-export-name">Excel / CSV</div><div className="rev-export-desc">Raw payment data, all members, filterable spreadsheet</div></div>
                                <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>~48 KB</div>
                            </div>
                            <div className="rev-export-option" onClick={() => setExportModal(false)}>
                                <div className="rev-export-icon">📲</div>
                                <div><div className="rev-export-name">Share Summary</div><div className="rev-export-desc">Send key metrics summary via WhatsApp or email</div></div>
                                <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>Text</div>
                            </div>
                        </div>
                        <div className="rev-modal-foot">
                            <button className="btn btn-secondary btn-sm" onClick={() => setExportModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
