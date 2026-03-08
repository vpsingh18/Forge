import './ProgressRing.css'

export default function ProgressRing({ value, max = 100, size = 80, strokeWidth = 6, label, color = 'var(--accent)' }) {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const percentage = Math.min((value / max) * 100, 100)
    const offset = circumference - (percentage / 100) * circumference

    return (
        <div className="progress-ring" style={{ width: size, height: size }}>
            <svg viewBox={`0 0 ${size} ${size}`}>
                <circle
                    className="progress-ring-bg"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <circle
                    className="progress-ring-fill"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    style={{
                        '--ring-circumference': circumference,
                        '--ring-offset': offset,
                        stroke: color
                    }}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="progress-ring-text">
                <span className="progress-ring-value font-mono">{Math.round(percentage)}%</span>
                {label && <span className="progress-ring-label">{label}</span>}
            </div>
        </div>
    )
}
