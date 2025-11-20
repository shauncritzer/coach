import { useState } from 'react'
import axios from 'axios'

function EmailCollection({ sessionId }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await axios.post('/api/collect-email', {
        email,
        name: name || null,
        sessionId
      })

      if (response.data.success) {
        setIsSubmitted(true)
        setTimeout(() => setIsExpanded(false), 3000)
      }
    } catch (err) {
      console.error('Email submission error:', err)
      setError(err.response?.data?.error || 'Unable to save your information. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isExpanded) {
    return (
      <div className="bg-gradient-to-r from-calm-50 to-warm-50 rounded-2xl p-4 border border-sage-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-sage-900 mb-1">Want personalized support?</h3>
            <p className="text-sm text-sage-600">Connect with a human recovery coach</p>
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="btn-primary whitespace-nowrap"
          >
            Get In Touch
          </button>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 rounded-2xl p-6 border border-green-200 text-center animate-fade-in">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="font-semibold text-green-900 mb-2">Thank you!</h3>
        <p className="text-sm text-green-700">
          We'll be in touch soon to continue your recovery journey together.
        </p>
      </div>
    )
  }

  return (
    <div className="card animate-slide-up">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-sage-900">Connect with a Human Coach</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-sage-400 hover:text-sage-600 text-2xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <p className="text-sm text-sage-600 mb-6">
        While I'm here to support you 24/7, sometimes it helps to connect with a real person.
        Leave your email and a human recovery coach will reach out.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-sage-700 mb-2">
            Name (optional)
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="How should we address you?"
            className="input-field"
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-sage-700 mb-2">
            Email address *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="input-field"
            required
            maxLength={200}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !email}
          className="btn-primary w-full"
        >
          {isSubmitting ? 'Sending...' : 'Send My Information'}
        </button>

        <p className="text-xs text-sage-500 text-center">
          We respect your privacy and will only use this to connect you with support.
        </p>
      </form>
    </div>
  )
}

export default EmailCollection
