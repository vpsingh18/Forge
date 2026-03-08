import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { getInitials, formatDate, BADGES } from '../../utils/helpers'
import Badge from '../../components/Badge'

export default function Clients() {
    const { state } = useApp()
    const { user } = useAuth()
    const myClients = state.members.filter(m => m.trainerId === user?.id)

    return (
        <div className="animate-fade-in-up">
            <div className="page-header">
                <h1>My Clients</h1>
                <p>{myClients.length} clients assigned to you</p>
            </div>

            {myClients.length === 0 ? (
                <div className="card-flat" style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--text-muted)' }}>
                    No clients assigned yet.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                    {myClients.map(client => (
                        <div className="card" key={client.id}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
                                <div className="member-avatar" style={{ width: 56, height: 56, fontSize: 'var(--text-lg)', flexShrink: 0 }}>{getInitials(client.name)}</div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-1)' }}>
                                        <h3 style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>{client.name}</h3>
                                        <span className="tag tag-info">PT Member</span>
                                    </div>
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{client.email} · {client.phone}</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 'var(--space-6)', textAlign: 'center' }}>
                                    {[
                                        { label: 'Age', value: client.age },
                                        { label: 'Weight', value: `${client.weight}kg` },
                                        { label: 'Height', value: `${client.height}cm` },
                                    ].map(({ label, value }) => (
                                        <div key={label}>
                                            <div className="font-mono" style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{value}</div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                                <div>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>GOAL</p>
                                    <p style={{ fontWeight: 600 }}>{client.goal}</p>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                    {client.badges.map(b => <Badge key={b} badgeId={b} size="sm" />)}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Joined {formatDate(client.joinDate)}</p>
                                    <p style={{ fontSize: 'var(--text-xs)' }}>🔥 {client.streak} day streak · {client.totalWorkouts} workouts</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
