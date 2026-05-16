import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { formatCurrency, getInitials, formatDate, daysUntil } from '../../utils/helpers'
import { Bell } from 'lucide-react'

export default function Renewals() {
    const { state } = useApp()
    const { members } = state

    const [activeTab, setActiveTab] = useState('expiring')
    const [search, setSearch] = useState('')
    const [notifyModal, setNotifyModal] = useState(null)

    // Data partitioning
    const expiringSoon = useMemo(() => {
        return members
            .filter(m => {
                const d = daysUntil(m.expiryDate)
                return m.status === 'expiring' || (d >= 0 && d <= 30)
            })
            .filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
    }, [members, search])

    const overdue = useMemo(() => {
        return members
            .filter(m => m.status === 'expired' || daysUntil(m.expiryDate) < 0)
            .filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
    }, [members, search])

    const displayList = activeTab === 'expiring' ? expiringSoon : overdue
    const totalExpiringAmount = expiringSoon.reduce((s, m) => s + (m.amountPaid || 0), 0)
    const totalOverdueAmount = overdue.reduce((s, m) => s + (m.amountPaid || 0), 0)

    const handleRemindAll = () => {
        setNotifyModal(activeTab)
    }

    const handleRemindSingle = (member) => {
        setNotifyModal(member)
    }

    return (
        <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div className="od-header">
                <div>
                    <h1 className="od-title">
                        <span className="font-mono" style={{ fontWeight: 800 }}>MEMBERSHIP</span>{' '}
                        <span className="text-gradient font-mono" style={{ fontWeight: 800 }}>RENEWALS</span>
                    </h1>
                    <p className="od-sub">Manage expiring and overdue accounts</p>
                </div>
            </div>

            <div className="grid-2">
                <div className="card-flat" style={{ border: activeTab === 'expiring' ? '2px solid var(--warning)' : '' }} onClick={() => setActiveTab('expiring')}>
                    <h3 style={{ color: 'var(--warning)', marginBottom: 8 }}>Expiring Soon (30 days)</h3>
                    <div style={{ fontSize: 32, fontWeight: 800 }}>{expiringSoon.length}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{formatCurrency(totalExpiringAmount)} at risk</div>
                </div>
                <div className="card-flat" style={{ border: activeTab === 'overdue' ? '2px solid var(--danger)' : '' }} onClick={() => setActiveTab('overdue')}>
                    <h3 style={{ color: 'var(--danger)', marginBottom: 8 }}>Overdue Payments</h3>
                    <div style={{ fontSize: 32, fontWeight: 800 }}>{overdue.length}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{formatCurrency(totalOverdueAmount)} pending</div>
                </div>
            </div>

            <div className="card-flat">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <h3 style={{ fontWeight: 700 }}>{activeTab === 'expiring' ? 'Expiring Members' : 'Overdue Members'}</h3>
                        <span className="tag tag-info">{displayList.length}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <input 
                            className="input" 
                            placeholder="Search name..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: 200 }}
                        />
                        <button className="btn btn-primary btn-sm" onClick={handleRemindAll}>
                            <Bell size={16} /> Remind All
                        </button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="rev-table" style={{ width: '100%', textAlign: 'left' }}>
                        <thead>
                            <tr>
                                <th>Member</th>
                                <th>Plan</th>
                                <th>Expiry Date</th>
                                <th>Days {activeTab === 'expiring' ? 'Left' : 'Overdue'}</th>
                                <th>Expected Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayList.map((m, i) => {
                                const d = daysUntil(m.expiryDate)
                                const isOverdue = d < 0
                                return (
                                    <tr key={m.id || i} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '12px 0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>
                                                    {getInitials(m.name)}
                                                </div>
                                                <span style={{ fontWeight: 600 }}>{m.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)' }}>{m.plan} ({m.membershipType})</td>
                                        <td style={{ fontFamily: 'var(--font-mono)' }}>{formatDate(m.expiryDate)}</td>
                                        <td>
                                            <span className={`tag ${isOverdue ? 'tag-danger' : 'tag-warning'}`}>
                                                {isOverdue ? `${Math.abs(d)} days` : `${d} days`}
                                            </span>
                                        </td>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{formatCurrency(m.amountPaid || 0)}</td>
                                        <td>
                                            <button className="btn btn-secondary btn-sm" onClick={() => handleRemindSingle(m)}>Remind</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {displayList.length === 0 && (
                        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No members found.
                        </div>
                    )}
                </div>
            </div>

            {/* Notification Modal */}
            {notifyModal && (
                <div className="rev-modal-overlay" onClick={() => setNotifyModal(null)}>
                    <div className="rev-modal" onClick={e => e.stopPropagation()}>
                        <div className="rev-modal-head">
                            <div className="rev-modal-title">SEND REMINDER</div>
                            <button className="rev-modal-close" onClick={() => setNotifyModal(null)}>✕</button>
                        </div>
                        <div className="rev-modal-body">
                            <p style={{ marginBottom: 16, fontSize: 14 }}>
                                Sending reminder to: <strong>
                                    {notifyModal === 'expiring' ? `${expiringSoon.length} expiring members` : 
                                     notifyModal === 'overdue' ? `${overdue.length} overdue members` : 
                                     notifyModal.name}
                                </strong>
                            </p>
                            <div className="rev-fg">
                                <label className="rev-fg-label">Channel</label>
                                <select className="rev-fg-input">
                                    <option>WhatsApp + SMS</option>
                                    <option>Push Notification</option>
                                </select>
                            </div>
                            <div className="rev-fg">
                                <label className="rev-fg-label">Message</label>
                                <textarea className="rev-fg-input" rows={4} defaultValue={
                                    notifyModal === 'overdue' || notifyModal?.status === 'expired' 
                                    ? `Hi {name}, your gym membership at Forge Fitness is overdue. Please clear your dues to continue your fitness journey!`
                                    : `Hi {name}, your gym membership at Forge Fitness is expiring soon. Renew now to maintain your streak!`
                                } />
                            </div>
                        </div>
                        <div className="rev-modal-foot">
                            <button className="btn btn-secondary btn-sm" onClick={() => setNotifyModal(null)}>Cancel</button>
                            <button className="btn btn-primary btn-sm" onClick={() => setNotifyModal(null)}>Send Reminder</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
