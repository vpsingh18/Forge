import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import StatCard from '../../components/StatCard'

const TooltipStyle = { backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px', color: '#F5F5F5' }

export default function Analytics() {
    const { state } = useApp()
    
    // Mock heatmap data for Peak Hours (7 days x 14 hours roughly, 6 AM to 8 PM)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const hours = ['6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p']
    
    const generateHeatmap = () => {
        let grid = []
        for (let d = 0; d < days.length; d++) {
            let dayArr = []
            for (let h = 0; h < hours.length; h++) {
                // Generate a random intensity between 0 and 100
                // Higher intensity in mornings (6-9) and evenings (5-8)
                let base = 20
                if (h <= 3 || h >= 11) base = 60
                let val = Math.floor(base + Math.random() * 40)
                if (d >= 5) val = Math.floor(val * 0.6) // Weekends less crowded
                dayArr.push(val)
            }
            grid.push(dayArr)
        }
        return grid
    }

    const [heatmapData] = useState(generateHeatmap())

    const getHeatColor = (value) => {
        if (value > 80) return '#EF4444' // red/danger
        if (value > 50) return '#F59E0B' // amber/warning
        if (value > 20) return '#22C55E' // green/success
        return '#2A2A2A' // low
    }

    // Trainer Performance
    const trainerPerformance = state.trainers.map(t => ({
        name: t.name.split(' ')[0],
        rating: t.rating,
        clients: t.clientCount,
        score: Math.round((t.rating / 5) * 100)
    })).sort((a, b) => b.score - a.score)

    return (
        <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div className="od-header">
                <div>
                    <h1 className="od-title">
                        <span className="font-mono" style={{ fontWeight: 800 }}>GYM</span>{' '}
                        <span className="text-gradient font-mono" style={{ fontWeight: 800 }}>ANALYTICS</span>
                    </h1>
                    <p className="od-sub">Usage trends and performance metrics</p>
                </div>
                <div>
                    <select className="input" style={{ width: 150 }}>
                        <option>This Week</option>
                        <option>Last Week</option>
                        <option>This Month</option>
                    </select>
                </div>
            </div>

            <div className="grid-3">
                <StatCard label="Avg. Daily Footfall" value="142" trend="+12% vs last week" trendDirection="up" trendVariant="success" />
                <StatCard label="Peak Hour" value="6:00 PM" trend="~85 members" trendDirection="none" trendVariant="warning" />
                <StatCard label="Avg Session Duration" value="68 min" trend="-2 min" trendDirection="down" trendVariant="info" />
            </div>

            <div className="grid-2">
                {/* Heatmap */}
                <div className="card-flat">
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Peak Hour Usage</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', paddingLeft: 40, gap: 4 }}>
                            {hours.map(h => <div key={h} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'var(--text-muted)' }}>{h}</div>)}
                        </div>
                        {days.map((day, dIdx) => (
                            <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 36, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{day}</div>
                                {heatmapData[dIdx].map((val, hIdx) => (
                                    <div 
                                        key={hIdx} 
                                        style={{ 
                                            flex: 1, 
                                            height: 24, 
                                            background: getHeatColor(val), 
                                            borderRadius: 4,
                                            opacity: 0.8
                                        }} 
                                        title={`${day} ${hours[hIdx]}: ~${val} members`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 'var(--space-4)', fontSize: 12, color: 'var(--text-muted)', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, background: '#2A2A2A', borderRadius: 2 }}/> Low</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, background: '#22C55E', borderRadius: 2 }}/> Moderate</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, background: '#F59E0B', borderRadius: 2 }}/> Busy</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, background: '#EF4444', borderRadius: 2 }}/> Peak</div>
                    </div>
                </div>

                {/* Trainer Performance */}
                <div className="card-flat">
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Trainer Performance Score</h3>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trainerPerformance} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#A3A3A3', fontSize: 12 }} width={70} />
                                <Tooltip contentStyle={TooltipStyle} cursor={{ fill: '#2A2A2A' }} />
                                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                                    {trainerPerformance.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.score > 90 ? '#8B5CF6' : entry.score > 80 ? '#F59E0B' : '#3B82F6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}
