"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WhatsAppButton() {
  const whatsappNumber = "+393331234567"
  const message = "Ciao! Sono interessato al configuratore pergole LEGNO."

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber.replace("+", "")}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-green-500 p-0 shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300"
      aria-label="Contattaci su WhatsApp"
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </Button>
  )
}
