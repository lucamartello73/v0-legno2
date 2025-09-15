"use client"

import { FeedbackForm } from "@/components/feedback-form"

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">Lascia una Recensione</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Condividi la tua esperienza con i nostri servizi. Il tuo feedback ci aiuta a migliorare continuamente.
          </p>
        </div>

        <FeedbackForm />
      </div>
    </div>
  )
}
