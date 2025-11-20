import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import Message from './Message'
import TypingIndicator from './TypingIndicator'

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: `Hello, and welcome. I'm here to offer support on your recovery journey. 🌱

I understand trauma, addiction, and the challenges of healing. This is a safe space where you can share what's on your heart without judgment.

How are you doing today?`,
  timestamp: new Date()
}

function ChatInterface({ sessionId }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post('/api/chat', {
        messages: [...messages, userMessage].map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        sessionId
      })

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
        crisis: response.data.crisis,
        requiresEscalation: response.data.requiresEscalation
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      console.error('Chat error:', err)
      setError('I\'m having trouble connecting right now. Please try again in a moment.')

      // Remove the user message if there was an error
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  return (
    <div className="flex flex-col h-full min-h-[500px] card">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 chat-container">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {isLoading && <TypingIndicator />}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="border-t border-sage-200 pt-4 px-4 pb-2">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind..."
            className="input-field flex-1"
            disabled={isLoading}
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="btn-primary"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
        <p className="text-xs text-sage-500 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    </div>
  )
}

export default ChatInterface
