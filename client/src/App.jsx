import { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import CrisisResources from './components/CrisisResources'
import BreathingExercise from './components/BreathingExercise'
import EmailCollection from './components/EmailCollection'
import Disclaimer from './components/Disclaimer'

function App() {
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [showBreathing, setShowBreathing] = useState(false)
  const [showCrisis, setShowCrisis] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    // Check if user has seen disclaimer before
    const hasSeenDisclaimer = localStorage.getItem('hasSeenDisclaimer')
    if (hasSeenDisclaimer) {
      setShowDisclaimer(false)
    }
  }, [])

  const handleAcceptDisclaimer = () => {
    localStorage.setItem('hasSeenDisclaimer', 'true')
    setShowDisclaimer(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-sage-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-calm-500 to-calm-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🌱</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-sage-900">Recovery Coach</h1>
              <p className="text-xs text-sage-600">Compassionate AI Support</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowBreathing(true)}
              className="px-4 py-2 text-sm bg-calm-100 text-calm-700 rounded-full hover:bg-calm-200 transition-colors"
              title="Breathing Exercise"
            >
              🫁 Breathe
            </button>
            <button
              onClick={() => setShowCrisis(!showCrisis)}
              className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
              title="Crisis Resources"
            >
              🆘 Crisis Help
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 py-6">
        {/* Crisis Resources Banner */}
        {showCrisis && (
          <div className="mb-4 animate-slide-up">
            <CrisisResources onClose={() => setShowCrisis(false)} />
          </div>
        )}

        {/* Disclaimer Modal */}
        {showDisclaimer && (
          <Disclaimer onAccept={handleAcceptDisclaimer} />
        )}

        {/* Breathing Exercise Modal */}
        {showBreathing && (
          <BreathingExercise onClose={() => setShowBreathing(false)} />
        )}

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          <ChatInterface sessionId={sessionId} />
        </div>

        {/* Email Collection */}
        <div className="mt-6">
          <EmailCollection sessionId={sessionId} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-sage-200 py-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-sage-600">
            This is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <button
            onClick={() => setShowDisclaimer(true)}
            className="text-xs text-calm-600 hover:text-calm-700 mt-1 underline"
          >
            View Full Disclaimer
          </button>
        </div>
      </footer>
    </div>
  )
}

export default App
