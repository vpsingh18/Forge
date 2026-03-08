import React from 'react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/StatCard'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency, formatDate, daysUntil, getInitials } from '../../utils/helpers'
import './OwnerDashboard.css'

const TooltipStyle = { backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#F5F5F5' }

export default function OwnerDashboard() {
    const { state } = useApp()
    const { user } = useAuth()
    const { analytics } = state

    // ── Computed KPIs from state ──
    const totalMembers = state.members.length
    const activeMembers = state.members.filter(m => m.status === 'active').length
    const expiringMembers = state.members.filter(m => m.status === 'expiring').length
    const expiredMembers = state.members.filter(m => m.status === 'expired').length
    const totalRevenue = state.members.reduce((sum, m) => sum + (m.amountPaid || 0), 0)
    const expiringRevenue = state.members.filter(m => m.status === 'expiring').reduce((sum, m) => sum + (m.amountPaid || 0), 0)
    const ptMembers = state.members.filter(m => m.membershipType === 'pt').length
    const trainerCount = state.trainers.length

    // Renewals due (expiring members with their details)
    const renewalsList = state.members
        .filter(m => m.status === 'expiring' || (daysUntil(m.expiryDate) >= 0 && daysUntil(m.expiryDate) <= 30))
        .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
        .slice(0, 5)
        .map(m => ({
            name: `${m.name.split(' ')[0]} ${m.name.split(' ').pop()[0]}.`,
            plan: m.membershipType === 'pt' ? 'Premium' : 'Standard',
            expires: formatDate(m.expiryDate)
        }))

    // Trainer performance from actual trainer data
    const trainerPerformance = state.trainers
        .map(t => ({
            name: t.name,
            initials: getInitials(t.name),
            clients: t.clientCount,
            retention: `${Math.round(85 + t.rating * 2)}%`,
            rating: t.rating
        }))
        .sort((a, b) => b.rating - a.rating)

    return (
        <div className="owner-dashboard animate-fade-in-up">
            {/* Page Header */}
            <div className="od-header">
                <div>
                    <h1 className="od-title">
                        <span className="font-mono" style={{ fontWeight: 800 }}>BUSINESS</span>{' '}
                        <span className="text-gradient font-mono" style={{ fontWeight: 800 }}>OVERVIEW</span>
                    </h1>
                    <p className="od-sub">February 2026 · Iron Peak Gym, Bengaluru</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <button className="btn btn-secondary btn-sm">Export Report</button>
                    <button className="btn btn-primary btn-sm">Send Notification</button>
                </div>
            </div>

            {/* Main Layout: Content + Right Sidebar */}
            <div className="od-layout">
                <div className="od-main">
                    {/* KPI Stat Cards — all computed */}
                    <div className="grid-stats" style={{ marginBottom: 'var(--space-6)' }}>
                        <StatCard
                            label="Active Members"
                            value={activeMembers}
                            trend={`${totalMembers} total`}
                            trendDirection="none"
                            trendVariant="success"
                            sub={`${ptMembers} PT · ${totalMembers - ptMembers} Regular`}
                        />
                        <StatCard
                            label="Monthly Revenue"
                            value={`₹${(totalRevenue / 100000).toFixed(2)}L`}
                            trend={`${trainerCount} trainers`}
                            trendDirection="none"
                            trendVariant="warning"
                            sub={`From ${totalMembers} members`}
                        />
                        <StatCard
                            label="Renewals Due"
                            value={expiringMembers}
                            trend={`₹${Math.round(expiringRevenue / 1000)}K at risk`}
                            trendDirection="none"
                            trendVariant="danger"
                            sub={expiredMembers > 0 ? `${expiredMembers} already expired` : 'Next 30 days'}
                        />
                        <StatCard
                            label="Slot Utilization"
                            value={`${analytics.attendance.slotUtilization}%`}
                            trend={analytics.attendance.slotTrend}
                            trendDirection="up"
                            sub={`Peak: 94% (${analytics.attendance.slotPeak})`}
                        />
                    </div>

                    {/* Alerts & Actions */}
                    <h2 className="od-section-title" style={{ marginBottom: 'var(--space-4)' }}>ALERTS & ACTIONS</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                        {expiringMembers > 0 && (
                            <div className="od-alert od-alert-warning">
                                <span className="od-alert-icon">⚠️</span>
                                <div className="od-alert-body">
                                    <strong>{expiringMembers} memberships expiring soon</strong>
                                    <p>Send renewal reminders. Potential revenue at risk: ₹{expiringRevenue.toLocaleString('en-IN')}.</p>
                                </div>
                                <button className="btn btn-secondary btn-sm">View List</button>
                            </div>
                        )}
                        {expiredMembers > 0 && (
                            <div className="od-alert od-alert-danger">
                                <span className="od-alert-icon">📛</span>
                                <div className="od-alert-body">
                                    <strong>{expiredMembers} members with expired memberships</strong>
                                    <p>Reach out to these members for renewal or follow up on lapsed accounts.</p>
                                </div>
                                <button className="btn btn-secondary btn-sm">Assign Action</button>
                            </div>
                        )}
                        {analytics.alerts.filter(a => a.type === 'info').map((alert, i) => (
                            <div key={i} className={`od-alert od-alert-${alert.type}`}>
                                <span className="od-alert-icon">{alert.icon}</span>
                                <div className="od-alert-body">
                                    <strong>{alert.title}</strong>
                                    <p>{alert.desc}</p>
                                </div>
                                <button className="btn btn-secondary btn-sm">{alert.action}</button>
                            </div>
                        ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
                        <div className="card-flat">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                                <h3 style={{ fontWeight: 700 }}>Revenue Trend</h3>
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Last 7 months</span>
                            </div>
                            <ResponsiveContainer width="100%" height={180}>
                                <AreaChart data={analytics.revenue.breakdown}>
                                    <defs>
                                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="month" tick={{ fill: '#6B6B6B', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#6B6B6B', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} />
                                    <Tooltip contentStyle={TooltipStyle} formatter={v => [formatCurrency(v), 'Revenue']} />
                                    <Area type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} fill="url(#revGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}>
                                <div><span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>TOTAL COLLECTED</span><br /><strong>₹{totalRevenue.toLocaleString('en-IN')}</strong></div>
                                <div style={{ textAlign: 'right' }}><span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>AVG PER MEMBER</span><br /><strong>₹{totalMembers > 0 ? Math.round(totalRevenue / totalMembers).toLocaleString('en-IN') : 0}</strong></div>
                            </div>
                        </div>

                        <div className="card-flat">
                            <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Trainer Performance</h3>
                            {trainerPerformance.map((t, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) 0', borderBottom: i < trainerPerformance.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-muted)', width: 16 }}>{i + 1}</span>
                                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: ['var(--accent)', '#EC4899', '#8B5CF6', '#22C55E', '#3B82F6'][i % 5], color: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>{t.initials}</div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{t.name}</p>
                                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{t.clients} clients · {t.retention} retention</p>
                                    </div>
                                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)', fontWeight: 700 }}>★ {t.rating}</span>
                                </div>
                            ))}
                            {trainerPerformance.length === 0 && (
                                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No trainers added yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="od-right">
                    {/* Quick Send */}
                    <div className="card-flat">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>QUICK SEND</h3>
                        <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>AUDIENCE</label>
                        <select className="input" style={{ marginTop: 4, marginBottom: 'var(--space-3)' }}>
                            <option>All Members ({totalMembers})</option>
                            <option>Active Members ({activeMembers})</option>
                            <option>Expiring ({expiringMembers})</option>
                            <option>PT Members ({ptMembers})</option>
                        </select>
                        <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>MESSAGE</label>
                        <textarea className="input" rows={3} style={{ marginTop: 4, marginBottom: 'var(--space-3)', resize: 'none' }} placeholder="Hey! Your membership is expiring soon..." />
                        <button className="btn btn-primary btn-sm" style={{ width: '100%' }}>Send Push Notification</button>
                    </div>

                    {/* Renewals Due */}
                    <div className="card-flat">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>RENEWALS DUE</h3>
                        {renewalsList.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
                                <span style={{ color: 'var(--text-muted)', fontWeight: 800 }}>MEMBER</span>
                                <span style={{ color: 'var(--text-muted)', fontWeight: 800 }}>PLAN</span>
                                <span style={{ color: 'var(--text-muted)', fontWeight: 800 }}>EXPIRES</span>
                                {renewalsList.map((r, i) => (
                                    <React.Fragment key={i}>
                                        <span style={{ color: 'var(--text-primary)' }}>{r.name}</span>
                                        <span style={{ color: 'var(--text-secondary)' }}>{r.plan}</span>
                                        <span style={{ color: 'var(--danger)', fontWeight: 700 }}>{r.expires}</span>
                                    </React.Fragment>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>No renewals due</p>
                        )}
                        {expiringMembers > 0 && (
                            <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 'var(--space-3)' }}>View All {expiringMembers} →</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
