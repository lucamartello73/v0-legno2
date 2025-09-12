"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { emailApi } from "@/lib/api"
import { Send, CheckCircle, AlertCircle } from "lucide-react"

export function AdminTestEmail() {
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await emailApi.sendTest(formData)
      setResult({
        success: true,
        message: "Email di test inviata con successo!",
      })
      // Reset form
      setFormData({ email: "", subject: "", message: "" })
    } catch (error) {
      setResult({
        success: false,
        message: "Errore nell'invio dell'email di test",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Invio Email</CardTitle>
        <p className="text-sm text-muted-foreground">Testa la funzionalità di invio email del configuratore</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="test-email">Email Destinatario</Label>
                <Input
                  id="test-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="test@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="test-subject">Oggetto</Label>
                <Input
                  id="test-subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="Test Email - LEGNO Configuratore"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="test-message">Messaggio</Label>
              <Textarea
                id="test-message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Questo è un messaggio di test per verificare il funzionamento del sistema email..."
                rows={6}
                required
              />
            </div>
          </div>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading || !formData.email || !formData.subject || !formData.message}
              className="emerald-gradient text-white"
            >
              <Send className="mr-2 h-4 w-4" />
              {isLoading ? "Invio in corso..." : "Invia Email Test"}
            </Button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Informazioni Test</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• L'email di test utilizza lo stesso sistema del configuratore</li>
            <li>• Verifica che la configurazione email sia corretta</li>
            <li>• I log di invio sono visibili nella console del browser</li>
            <li>• In produzione, integrare con un servizio email reale (SendGrid, Resend, etc.)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
