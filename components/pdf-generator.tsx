"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import type { Configuration } from "@/lib/types"

interface PDFGeneratorProps {
  configuration: Configuration
  onGenerate?: () => void
}

export function PDFGenerator({ configuration, onGenerate }: PDFGeneratorProps) {
  const generatePDF = async () => {
    onGenerate?.()

    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ configurationId: configuration.id }),
      })

      if (!response.ok) {
        throw new Error("Errore nella generazione del PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `preventivo-pergola-${configuration.id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Errore nella generazione del PDF:", error)
      alert("Errore nella generazione del PDF. Riprova più tardi.")
    }
  }

  return (
    <Button onClick={generatePDF} variant="outline" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Scarica PDF
    </Button>
  )
}
