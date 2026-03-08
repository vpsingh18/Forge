import { BADGES } from '../utils/helpers'
import './Badge.css'

export default function Badge({ badgeId, size = 'md' }) {
    const badge = BADGES[badgeId]
    if (!badge) return null

    return (
        <div className={`badge-item badge-${size}`} title={badge.description}>
            <span className="badge-icon">{badge.icon}</span>
            {size !== 'sm' && <span className="badge-name">{badge.name}</span>}
        </div>
    )
}
