import { useApp } from '../../context/AppContext'

export default function Leaderboard() {
    const { state } = useApp()

    const ranked = [...state.members]
        .sort((a, b) => b.points - a.points)
        .map((m, i) => ({ ...m, rank: i + 1 }))

    const RANK_STYLE = {
        1: { bg: '#F59E0B', color: '#000', emoji: '🥇' },
        2: { bg: '#9CA3AF', color: '#000', emoji: '🥈' },
        3: { bg: '#92400E', color: '#FFF', emoji: '🥉' }
    }

    return (
        <div className="animate-fade-in-up">
            <div className="page-header">
                <h1>Leaderboard</h1>
                <p>Top members ranked by points this month</p>
            </div>

            {/* Top 3 Podium */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                {[ranked[1], ranked[0], ranked[2]].filter(Boolean).map((m) => {
                    const style = RANK_STYLE[m.rank] || {}
                    const heights = { 1: 120, 2: 90, 3: 70 }
                    return (
                        <div key={m.id} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>{style.emoji}</div>
                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: style.bg || 'var(--bg-card)', color: style.color || 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                                {m.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{m.name.split(' ')[0]}</p>
                            <p className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 700 }}>{m.points}pts</p>
                            <div style={{ width: 80, height: heights[m.rank] || 60, background: m.rank === 1 ? 'var(--gradient-accent)' : 'var(--bg-card)', marginTop: 'var(--space-2)', borderRadius: '8px 8px 0 0', border: '1px solid var(--border)' }} />
                        </div>
                    )
                })}
            </div>

            {/* Full Rankings */}
            <div className="card-flat">
                {ranked.map((m) => {
                    const isCurrentUser = m.id === 'member-1'
                    return (
                        <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-2)', borderBottom: '1px solid var(--border)', background: isCurrentUser ? 'var(--accent-glow)' : 'transparent', borderRadius: isCurrentUser ? 'var(--radius-md)' : 0, transition: 'background var(--transition-fast)' }}>
                            <div style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, color: m.rank <= 3 ? '#F59E0B' : 'var(--text-muted)', fontSize: m.rank <= 3 ? 'var(--text-lg)' : 'var(--text-base)' }}>
                                {m.rank <= 3 ? RANK_STYLE[m.rank].emoji : `#${m.rank}`}
                            </div>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 'var(--text-xs)', flexShrink: 0 }}>
                                {m.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: isCurrentUser ? 700 : 600, fontSize: 'var(--text-sm)' }}>{m.name} {isCurrentUser && <span style={{ color: 'var(--accent)', fontSize: 'var(--text-xs)' }}>← You</span>}</p>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>🔥 {m.streak} streak · {m.totalWorkouts} workouts</p>
                            </div>
                            <div className="font-mono" style={{ fontWeight: 700, color: 'var(--accent)' }}>{m.points}</div>
                            <div style={{ display: 'flex', gap: 4 }}>
                                {m.badges.slice(0, 3).map(b => {
                                    const icons = { 'first-flame': '🔥', 'iron-week': '⚡', 'forge-master': '💪', 'century': '👑', 'champion': '🏆' }
                                    return <span key={b} style={{ fontSize: '0.9rem' }}>{icons[b]}</span>
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
