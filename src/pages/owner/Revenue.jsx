import { useApp } from '../../context/AppContext'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { formatCurrency } from '../../utils/helpers'
import StatCard from '../../components/StatCard'
import { TrendingUp, TrendingDown, Clock } from 'lucide-react'

const TooltipStyle = { backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#F5F5F5' }
const PIE_COLORS = ['#22C55E', '#F59E0B', '#EF4444']

export default function Revenue() {
    const { state } = useApp()
    const { analytics } = state
    const { payments } = analytics

    const pieData = [
        { name: 'Collected', value: payments.collected },
        { name: 'Pending', value: payments.pending },
        { name: 'Overdue', value: payments.overdue }
    ]

    return (
        <div className="animate-fade-in-up">
            <div className="page-header">
                <h1>Revenue</h1>
                <p>Payment analytics and financial overview</p>
            </div>

            <div className="grid-stats stagger-children" style={{ marginBottom: 'var(--space-8)' }}>
                <StatCard icon={TrendingUp} label="Collected" value={formatCurrency(payments.collected)} variant="success" />
                <StatCard icon={Clock} label="Pending" value={formatCurrency(payments.pending)} variant="warning" />
                <StatCard icon={TrendingDown} label="Overdue" value={formatCurrency(payments.overdue)} variant="danger" />
            </div>

            <div className="grid-2" style={{ marginBottom: 'var(--space-8)' }}>
                <div className="card-flat">
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-1)' }}>Member Growth</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Last 6 months</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={analytics.members.breakdown}>
                            <XAxis dataKey="month" tick={{ fill: '#6B6B6B', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#6B6B6B', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={TooltipStyle} />
                            <Line type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={2.5} dot={{ fill: '#F59E0B', r: 4 }} name="Members" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="card-flat" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-1)', alignSelf: 'flex-start' }}>Payment Breakdown</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', alignSelf: 'flex-start' }}>Collected vs Pending vs Overdue</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                            </Pie>
                            <Tooltip contentStyle={TooltipStyle} formatter={v => formatCurrency(v)} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                        {pieData.map((d, i) => (
                            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i], display: 'inline-block' }} />
                                {d.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card-flat">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                    <h3 style={{ fontWeight: 700 }}>All Payments</h3>
                    {payments.overdueCount > 0 && (
                        <span className="tag tag-danger">⚠ {payments.overdueCount} overdue</span>
                    )}
                </div>
                {payments.recentPayments.map((p, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-2)', borderBottom: '1px solid var(--border)', alignItems: 'center', fontSize: 'var(--text-sm)' }}>
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                        <span className="font-mono">{formatCurrency(p.amount)}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>{p.date}</span>
                        <span className={`tag ${p.status === 'paid' ? 'tag-success' : p.status === 'pending' ? 'tag-warning' : 'tag-danger'}`}>{p.status}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
