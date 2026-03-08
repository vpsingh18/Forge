import './ChatBubble.css'
import { formatDate } from '../utils/helpers'

export default function ChatBubble({ message, isSender }) {
    return (
        <div className={`chat-bubble ${isSender ? 'chat-bubble-sender' : 'chat-bubble-receiver'}`}>
            <div className="chat-bubble-text">{message.content}</div>
            <div className="chat-bubble-time">{formatDate(message.sentAt)}</div>
        </div>
    )
}
