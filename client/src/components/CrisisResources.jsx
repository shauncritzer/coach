import { useState, useEffect } from 'react'
import axios from 'axios'

function CrisisResources({ onClose }) {
  const [resources, setResources] = useState([])

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('/api/crisis-resources')
        setResources(response.data.resources)
      } catch (error) {
        console.error('Error fetching crisis resources:', error)
        // Fallback resources
        setResources([
          {
            name: 'National Suicide Prevention Lifeline',
            phone: '988',
            description: '24/7 free and confidential support',
            type: 'crisis'
          },
          {
            name: 'Crisis Text Line',
            text: '741741',
            description: 'Text HOME to 741741',
            type: 'crisis'
          }
        ])
      }
    }

    fetchResources()
  }, [])

  const getIcon = (type) => {
    switch (type) {
      case 'crisis': return '🆘'
      case 'emergency': return '🚨'
      case 'support': return '💙'
      default: return '📞'
    }
  }

  return (
    <div className="crisis-banner animate-fade-in">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-lg font-semibold text-red-900 flex items-center">
          <span className="mr-2">🆘</span>
          Crisis Resources
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>

      <p className="text-sm text-red-800 mb-4">
        If you're in crisis or thinking about harming yourself, please reach out for help immediately:
      </p>

      <div className="space-y-3">
        {resources.map((resource, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-red-200">
            <div className="flex items-start">
              <span className="text-2xl mr-3">{getIcon(resource.type)}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-sage-900">{resource.name}</h3>
                <p className="text-sm text-sage-600 mb-2">{resource.description}</p>
                {resource.phone && (
                  <a
                    href={`tel:${resource.phone.replace(/\D/g, '')}`}
                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-full text-sm transition-colors"
                  >
                    Call {resource.phone}
                  </a>
                )}
                {resource.text && (
                  <a
                    href={`sms:${resource.text}`}
                    className="inline-block bg-calm-600 hover:bg-calm-700 text-white font-semibold px-4 py-2 rounded-full text-sm transition-colors ml-2"
                  >
                    Text {resource.text}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-red-700 mt-4 italic">
        You are not alone. These services are free, confidential, and available 24/7.
      </p>
    </div>
  )
}

export default CrisisResources
