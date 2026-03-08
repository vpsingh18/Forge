import { useState } from 'react'
import { Bell, Send } from 'lucide-react'

const PRESET_NOTIFICATIONS = [
    { title: 'Renewal Reminder', body: 'Your membership expires in 7 days. Renew now to avoid interruption.' },
    { title: 'New Class Available', body: 'We\'ve added a new morning yoga class. Book your spot today!' },
    { title: 'Holiday Hours', body: 'The gym will be open 7am–2pm this Sunday. Plan accordingly.' }
]

export default function Notifications() {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [target, setTarget] = useState('all')
    const [sent, setSent] = useState([])

    const handleSend = () => {
        if (!title.trim() || !body.trim()) return
        const notification = { title, body, target, sentAt: new Date().toLocaleTimeString() }
        setSent([notification, ...sent])
        setTitle('')
        setBody('')
    }

    return (
        <div className="animate-fade-in-up">
            <div className="page-header">
                <h1>Notifications</h1>
                <p>Send announcements to your gym community</p>
            </div>

            <div className="grid-2" style={{ alignItems: 'start' }}>
                <div className="card-flat">
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-6)' }}>Compose Notification</h3>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 'var(--space-2)' }}>Send To</label>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            {['all', 'members', 'trainers'].map(t => (
                                <button key={t} className={`btn btn-sm ${target === t ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTarget(t)}>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 'var(--space-2)' }}>Title</label>
                        <input className="input" placeholder="Notification title..." value={title} onChange={e => setTitle(e.target.value)} id="notif-title" />
                    </div>

                    <div style={{ marginBottom: 'var(--space-6)' }}>
                        <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 'var(--space-2)' }}>Message</label>
                        <textarea className="input" placeholder="Write your message..." value={body} onChange={e => setBody(e.target.value)} rows={4} style={{ resize: 'vertical' }} id="notif-body" />
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSend} disabled={!title || !body} id="notif-send">
                        <Send size={16} /> Send Notification
                    </button>
                </div>

                <div>
                    <div className="card-flat" style={{ marginBottom: 'var(--space-4)' }}>
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Quick Templates</h3>
                        {PRESET_NOTIFICATIONS.map((n, i) => (
                            <button key={i} onClick={() => { setTitle(n.title); setBody(n.body) }}
                                style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', textAlign: 'left', cursor: 'pointer', marginBottom: 'var(--space-2)', transition: 'all var(--transition-fast)' }}>
                                <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>{n.title}</p>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{n.body}</p>
                            </button>
                        ))}
                    </div>

                    {sent.length > 0 && (
                        <div className="card-flat">
                            <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Sent ({sent.length})</h3>
                            {sent.map((n, i) => (
                                <div key={i} style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                                    <Bell size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{n.title}</p>
                                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>→ {n.target} · {n.sentAt}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
