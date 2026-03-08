import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import ChatBubble from '../../components/ChatBubble'
import { Send } from 'lucide-react'

const INITIAL_MESSAGES = [
    { id: 1, senderId: 'trainer-1', receiverId: 'member-1', content: 'Hey Arjun! How did push day go today?', sentAt: '2026-03-02' },
    { id: 2, senderId: 'member-1', receiverId: 'trainer-1', content: 'It was tough but I completed all 5 exercises! The bench press felt much stronger.', sentAt: '2026-03-02' },
    { id: 3, senderId: 'trainer-1', receiverId: 'member-1', content: 'That\'s great progress! Make sure to rest tomorrow before pull day. Also hydrate well 💪', sentAt: '2026-03-02' },
    { id: 4, senderId: 'member-1', receiverId: 'trainer-1', content: 'Will do. Should I add any additional cardio on rest days?', sentAt: '2026-03-02' }
]

export default function Messages() {
    const { user } = useAuth()
    const { state, dispatch } = useApp()
    const [text, setText] = useState('')
    const [messages, setMessages] = useState(INITIAL_MESSAGES)

    const handleSend = () => {
        if (!text.trim()) return
        const msg = {
            id: Date.now(),
            senderId: user?.id || 'member-1',
            receiverId: 'trainer-1',
            content: text.trim(),
            sentAt: new Date().toISOString().split('T')[0]
        }
        setMessages(prev => [...prev, msg])
        setText('')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="animate-fade-in-up" style={{ height: 'calc(100vh - var(--topbar-height) - var(--space-16))', display: 'flex', flexDirection: 'column' }}>
            <div className="page-header" style={{ marginBottom: 'var(--space-4)' }}>
                <h1>Messages</h1>
                <p>Chat with your trainer</p>
            </div>

            {/* Trainer info bar */}
            <div className="card-flat" style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gradient-accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>PS</div>
                <div>
                    <p style={{ fontWeight: 700 }}>Priya Sharma</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--success)' }}>● Online</p>
                </div>
            </div>

            {/* Messages */}
            <div className="card-flat" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: 'var(--space-2)', gap: 'var(--space-1)' }}>
                    {messages.map(msg => (
                        <ChatBubble
                            key={msg.id}
                            message={msg}
                            isSender={msg.senderId === (user?.id || 'member-1')}
                        />
                    ))}
                </div>

                {/* Input */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end', marginTop: 'var(--space-2)' }}>
                    <textarea
                        className="input"
                        placeholder="Type a message..."
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={2}
                        style={{ flex: 1, resize: 'none' }}
                        id="message-input"
                    />
                    <button className="btn btn-primary" onClick={handleSend} disabled={!text.trim()} id="message-send">
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}
