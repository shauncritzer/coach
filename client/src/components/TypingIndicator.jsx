function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="message-bubble message-assistant">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-sage-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-sage-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-sage-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator
