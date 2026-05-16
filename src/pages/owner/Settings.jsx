import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Save } from 'lucide-react'

export default function Settings() {
    const { user } = useAuth()
    
    const [gymName, setGymName] = useState(user?.gymName || 'Iron Peak Gym')
    const [currency, setCurrency] = useState('INR (₹)')
    const [theme, setTheme] = useState('dark')

    const [tiers, setTiers] = useState([
        { id: 1, name: 'Basic', price: '1500', features: 'Access to gym equipment' },
        { id: 2, name: 'Standard', price: '2500', features: 'Equipment + Group Classes' },
        { id: 3, name: 'Premium (PT)', price: '6000', features: 'All access + Personal Trainer' }
    ])

    const handleSave = (e) => {
        e.preventDefault()
        // In a real app, this would dispatch an update to the backend/context
        alert('Settings saved successfully!')
    }

    return (
        <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 800 }}>
            <div className="od-header">
                <div>
                    <h1 className="od-title">
                        <span className="font-mono" style={{ fontWeight: 800 }}>SYSTEM</span>{' '}
                        <span className="text-gradient font-mono" style={{ fontWeight: 800 }}>SETTINGS</span>
                    </h1>
                    <p className="od-sub">Configure your gym's core details</p>
                </div>
                <button className="btn btn-primary" onClick={handleSave}>
                    <Save size={18} /> Save Changes
                </button>
            </div>

            <form className="card-flat" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                <div>
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--accent)' }}>General Details</h3>
                    <div className="grid-2">
                        <div className="rev-fg">
                            <label className="rev-fg-label">Gym Name</label>
                            <input className="input" value={gymName} onChange={e => setGymName(e.target.value)} />
                        </div>
                        <div className="rev-fg">
                            <label className="rev-fg-label">Currency</label>
                            <select className="input" value={currency} onChange={e => setCurrency(e.target.value)}>
                                <option>INR (₹)</option>
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                                <option>GBP (£)</option>
                            </select>
                        </div>
                    </div>
                    <div className="rev-fg" style={{ marginTop: 'var(--space-4)' }}>
                        <label className="rev-fg-label">Gym Logo URL</label>
                        <input className="input" placeholder="https://example.com/logo.png" />
                    </div>
                </div>

                <div style={{ height: 1, background: 'var(--border)' }} />

                <div>
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--accent)' }}>Membership Tiers</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {tiers.map((tier, index) => (
                            <div key={tier.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: 12, alignItems: 'end' }}>
                                <div className="rev-fg">
                                    <label className="rev-fg-label" style={{ fontSize: 10 }}>Tier Name</label>
                                    <input className="input" value={tier.name} onChange={e => {
                                        const newTiers = [...tiers]
                                        newTiers[index].name = e.target.value
                                        setTiers(newTiers)
                                    }} />
                                </div>
                                <div className="rev-fg">
                                    <label className="rev-fg-label" style={{ fontSize: 10 }}>Monthly Price</label>
                                    <input className="input" type="number" value={tier.price} onChange={e => {
                                        const newTiers = [...tiers]
                                        newTiers[index].price = e.target.value
                                        setTiers(newTiers)
                                    }} />
                                </div>
                                <div className="rev-fg">
                                    <label className="rev-fg-label" style={{ fontSize: 10 }}>Features (comma separated)</label>
                                    <input className="input" value={tier.features} onChange={e => {
                                        const newTiers = [...tiers]
                                        newTiers[index].features = e.target.value
                                        setTiers(newTiers)
                                    }} />
                                </div>
                                <button type="button" className="btn btn-secondary" style={{ padding: '8px 12px', borderColor: 'var(--danger)', color: 'var(--danger)' }}>✕</button>
                            </div>
                        ))}
                    </div>
                    <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--space-3)' }}>+ Add Tier</button>
                </div>

                <div style={{ height: 1, background: 'var(--border)' }} />

                <div>
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--accent)' }}>Appearance</h3>
                    <div className="rev-fg">
                        <label className="rev-fg-label">Default Theme</label>
                        <select className="input" style={{ width: 200 }} value={theme} onChange={e => setTheme(e.target.value)}>
                            <option value="dark">Dark Mode (Default)</option>
                            <option value="light">Light Mode</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>
    )
}
