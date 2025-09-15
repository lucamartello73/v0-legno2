"use client"

import { AppointmentBooking } from "@/components/appointment-booking"

export default function PrenotaAppuntamentoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">Prenota un Appuntamento</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Prenota una consulenza gratuita con i nostri esperti. Ti aiuteremo a progettare la pergola perfetta per i
            tuoi spazi.
          </p>
        </div>

        <AppointmentBooking />
      </div>
    </div>
  )
}
