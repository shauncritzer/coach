import { useState, useEffect } from 'react'
import axios from 'axios'

function BreathingExercise({ onClose }) {
  const [exercise, setExercise] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentCycle, setCurrentCycle] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [selectedType, setSelectedType] = useState('box')

  useEffect(() => {
    fetchExercise(selectedType)
  }, [selectedType])

  useEffect(() => {
    if (!isActive || !exercise) return

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      // Move to next step
      const nextStep = (currentStep + 1) % exercise.steps.length
      const nextCycle = nextStep === 0 ? currentCycle + 1 : currentCycle

      if (nextCycle >= exercise.cycles) {
        // Exercise complete
        setIsActive(false)
        setCurrentCycle(0)
        setCurrentStep(0)
      } else {
        setCurrentStep(nextStep)
        setCurrentCycle(nextCycle)
        setCountdown(exercise.steps[nextStep].duration)
      }
    }
  }, [countdown, isActive, exercise, currentStep, currentCycle])

  const fetchExercise = async (type) => {
    try {
      const response = await axios.get(`/api/breathing-exercise/${type}`)
      setExercise(response.data)
    } catch (error) {
      console.error('Error fetching breathing exercise:', error)
    }
  }

  const startExercise = () => {
    setIsActive(true)
    setCurrentStep(0)
    setCurrentCycle(0)
    setCountdown(exercise.steps[0].duration)
  }

  const stopExercise = () => {
    setIsActive(false)
    setCurrentStep(0)
    setCurrentCycle(0)
    setCountdown(0)
  }

  if (!exercise) return null

  const currentStepData = exercise.steps[currentStep]
  const progress = ((currentCycle * exercise.steps.length + currentStep) / (exercise.cycles * exercise.steps.length)) * 100

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full animate-fade-in">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold text-sage-900">🫁 Breathing Exercise</h2>
          <button
            onClick={onClose}
            className="text-sage-400 hover:text-sage-600 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Exercise Type Selector */}
        {!isActive && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-sage-700 mb-2">
              Choose an exercise:
            </label>
            <div className="flex space-x-2">
              {['box', '4-7-8', 'calm'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === type
                      ? 'bg-calm-600 text-white'
                      : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                  }`}
                >
                  {type === 'box' ? 'Box' : type === '4-7-8' ? '4-7-8' : 'Calm'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Exercise Info */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg text-sage-900 mb-1">{exercise.name}</h3>
          <p className="text-sm text-sage-600">{exercise.description}</p>
        </div>

        {/* Breathing Circle */}
        <div className="flex justify-center mb-6">
          <div
            className="breathing-circle transition-all duration-1000"
            style={{
              transform: isActive && currentStepData.action.includes('in') ? 'scale(1.3)' : 'scale(1)',
              opacity: isActive ? 1 : 0.7
            }}
          >
            {isActive ? (
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{countdown}</div>
                <div className="text-sm">{currentStepData.action}</div>
              </div>
            ) : (
              <div className="text-2xl">Ready</div>
            )}
          </div>
        </div>

        {/* Current Instruction */}
        {isActive && (
          <div className="text-center mb-4">
            <p className="text-sage-700 font-medium">{currentStepData.instruction}</p>
            <p className="text-sm text-sage-500 mt-2">
              Cycle {currentCycle + 1} of {exercise.cycles}
            </p>
            {/* Progress Bar */}
            <div className="w-full bg-sage-200 rounded-full h-2 mt-3">
              <div
                className="bg-calm-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex space-x-3">
          {!isActive ? (
            <button onClick={startExercise} className="btn-primary flex-1">
              Start Breathing
            </button>
          ) : (
            <button onClick={stopExercise} className="btn-secondary flex-1">
              Stop
            </button>
          )}
        </div>

        <p className="text-xs text-sage-500 mt-4 text-center">
          Find a comfortable position and allow yourself to relax
        </p>
      </div>
    </div>
  )
}

export default BreathingExercise
