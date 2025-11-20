function Disclaimer({ onAccept }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <h2 className="text-2xl font-semibold text-sage-900 mb-4">Important Information</h2>

        <div className="space-y-4 text-sage-700">
          <div className="bg-warm-50 border-l-4 border-warm-500 p-4 rounded">
            <p className="font-semibold mb-2">This is NOT Professional Medical Care</p>
            <p className="text-sm">
              This AI recovery coach is a supportive tool designed to provide information and encouragement.
              It is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">What This Tool Provides:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Compassionate, trauma-informed support</li>
              <li>Recovery insights and perspectives</li>
              <li>Breathing exercises and grounding techniques</li>
              <li>Educational information about nervous system regulation</li>
              <li>Connection to professional crisis resources when needed</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">What This Tool Does NOT Provide:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Medical diagnosis or treatment</li>
              <li>Medication advice or prescriptions</li>
              <li>Therapy or professional counseling</li>
              <li>Emergency crisis intervention</li>
              <li>Legal or professional advice</li>
            </ul>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="font-semibold mb-2">If You're In Crisis:</p>
            <p className="text-sm mb-2">
              If you're experiencing a mental health emergency or thinking about harming yourself,
              please contact emergency services immediately:
            </p>
            <div className="text-sm space-y-1">
              <p><strong>National Suicide Prevention Lifeline:</strong> 988</p>
              <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
              <p><strong>Emergency Services:</strong> 911</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Your Privacy:</h3>
            <p className="text-sm">
              Conversations are stored to improve the service. Please do not share sensitive personal
              information like financial details, passwords, or information about others without their consent.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Professional Support:</h3>
            <p className="text-sm">
              We strongly encourage working with licensed mental health professionals, therapists,
              and medical providers as part of your recovery journey. This tool is meant to complement,
              not replace, professional care.
            </p>
          </div>

          <div className="bg-calm-50 border-l-4 border-calm-500 p-4 rounded">
            <p className="font-semibold mb-2">You Are Not Alone</p>
            <p className="text-sm">
              Recovery is possible, and you deserve support. This tool is here as one resource on your journey,
              alongside professional care, community support, and your own inner wisdom.
            </p>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            onClick={onAccept}
            className="btn-primary flex-1"
          >
            I Understand - Continue
          </button>
        </div>

        <p className="text-xs text-sage-500 mt-4 text-center">
          By continuing, you acknowledge that you have read and understood this disclaimer.
        </p>
      </div>
    </div>
  )
}

export default Disclaimer
