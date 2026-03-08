import './StatCard.css'

export default function StatCard({ label, value, trend, trendDirection = 'up', trendVariant, sub }) {
    return (
        <div className="stat-card">
            <div className="stat-card-header">
                <span className="stat-card-label">{label}</span>
                {trend && (
                    <span className={`tag ${trendVariant ? `tag-${trendVariant}` : trendDirection === 'up' ? 'tag-success' : 'tag-danger'}`}>
                        {trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : ''} {trend}
                    </span>
                )}
            </div>
            <div className="stat-card-value font-mono">{value}</div>
            {sub && <div className="stat-card-sub">{sub}</div>}
        </div>
    )
}
