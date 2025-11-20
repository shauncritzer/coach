function Message({ message }) {
  const { role, content, crisis, requiresEscalation, timestamp } = message

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`message-bubble ${role === 'user' ? 'message-user' : 'message-assistant'}`}>
        {crisis && (
          <div className="mb-2 pb-2 border-b border-red-300">
            <span className="text-red-600 font-semibold text-sm">⚠️ Crisis Support Needed</span>
          </div>
        )}

        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {content}
        </div>

        <div className={`text-xs mt-2 ${role === 'user' ? 'text-calm-100' : 'text-sage-400'}`}>
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  )
}

export default Message
