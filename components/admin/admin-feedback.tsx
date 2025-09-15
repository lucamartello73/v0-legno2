"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { createBrowserClient } from "@supabase/ssr"
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Eye, EyeOff, Award, Calendar, Mail, User } from "lucide-react"

interface Feedback {
  id: number
  configuration_id: number
  client_name: string
  client_email: string
  rating: number
  title: string
  comment: string
  service_rating: number
  quality_rating: number
  delivery_rating: number
  would_recommend: boolean
  is_approved: boolean
  is_featured: boolean
  admin_response: string
  created_at: string
}

export function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [adminResponse, setAdminResponse] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    loadFeedbacks()
  }, [])

  const loadFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from("configuratorelegno_feedback")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setFeedbacks(data || [])
    } catch (error) {
      console.error("Error loading feedbacks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateFeedbackStatus = async (id: number, updates: Partial<Feedback>) => {
    try {
      const { error } = await supabase
        .from("configuratorelegno_feedback")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)

      if (error) throw error
      await loadFeedbacks()
    } catch (error) {
      console.error("Error updating feedback:", error)
    }
  }

  const handleResponseSubmit = async () => {
    if (!selectedFeedback) return

    setIsUpdating(true)
    try {
      await updateFeedbackStatus(selectedFeedback.id, {
        admin_response: adminResponse,
        is_approved: true,
      })
      setSelectedFeedback(null)
      setAdminResponse("")
    } catch (error) {
      console.error("Error submitting response:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const openResponseDialog = (feedback: Feedback) => {
    setSelectedFeedback(feedback)
    setAdminResponse(feedback.admin_response || "")
  }

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const starSize = size === "sm" ? "h-4 w-4" : "h-5 w-5"
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getAverageRating = () => {
    if (feedbacks.length === 0) return 0
    const total = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0)
    return (total / feedbacks.length).toFixed(1)
  }

  const getApprovedCount = () => {
    return feedbacks.filter((f) => f.is_approved).length
  }

  const getFeaturedCount = () => {
    return feedbacks.filter((f) => f.is_featured).length
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Caricamento feedback...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{feedbacks.length}</p>
                <p className="text-xs text-muted-foreground">Feedback Totali</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{getAverageRating()}</p>
                <p className="text-xs text-muted-foreground">Valutazione Media</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{getApprovedCount()}</p>
                <p className="text-xs text-muted-foreground">Approvati</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{getFeaturedCount()}</p>
                <p className="text-xs text-muted-foreground">In Evidenza</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle>Gestione Feedback Clienti</CardTitle>
          <p className="text-sm text-muted-foreground">Gestisci le recensioni e i feedback ricevuti dai clienti</p>
        </CardHeader>
        <CardContent>
          {feedbacks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Nessun feedback ricevuto</p>
            </div>
          ) : (
            <div className="space-y-6">
              {feedbacks.map((feedback) => (
                <Card key={feedback.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {renderStars(feedback.rating, "md")}
                          <span className="font-semibold text-lg">{feedback.rating}/5</span>
                        </div>
                        <div className="flex gap-2">
                          {feedback.is_approved ? (
                            <Badge className="bg-green-500 text-white">
                              <Eye className="h-3 w-3 mr-1" />
                              Approvato
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <EyeOff className="h-3 w-3 mr-1" />
                              In Attesa
                            </Badge>
                          )}
                          {feedback.is_featured && (
                            <Badge className="bg-purple-500 text-white">
                              <Award className="h-3 w-3 mr-1" />
                              In Evidenza
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(feedback.created_at)}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{feedback.title}</h3>
                          <p className="text-gray-700 leading-relaxed">{feedback.comment}</p>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{feedback.client_name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{feedback.client_email}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {feedback.would_recommend ? (
                              <ThumbsUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <ThumbsDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-sm">
                              {feedback.would_recommend ? "Consiglierebbe" : "Non consiglierebbe"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-3">Valutazioni Dettagliate</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Servizio:</span>
                              {renderStars(feedback.service_rating)}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Qualità:</span>
                              {renderStars(feedback.quality_rating)}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Consegna:</span>
                              {renderStars(feedback.delivery_rating)}
                            </div>
                          </div>
                        </div>

                        {feedback.admin_response && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <h4 className="text-sm font-medium text-blue-900 mb-1">Risposta Admin:</h4>
                            <p className="text-sm text-blue-800">{feedback.admin_response}</p>
                          </div>
                        )}

                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`approved-${feedback.id}`} className="text-sm">
                              Approvato
                            </Label>
                            <Switch
                              id={`approved-${feedback.id}`}
                              checked={feedback.is_approved}
                              onCheckedChange={(checked) => updateFeedbackStatus(feedback.id, { is_approved: checked })}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`featured-${feedback.id}`} className="text-sm">
                              In Evidenza
                            </Label>
                            <Switch
                              id={`featured-${feedback.id}`}
                              checked={feedback.is_featured}
                              onCheckedChange={(checked) => updateFeedbackStatus(feedback.id, { is_featured: checked })}
                            />
                          </div>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => openResponseDialog(feedback)}>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {feedback.admin_response ? "Modifica Risposta" : "Rispondi"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Risposta al Feedback</DialogTitle>
                              <DialogDescription>
                                Scrivi una risposta al feedback di {feedback.client_name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="bg-gray-50 p-3 rounded">
                                <p className="text-sm font-medium mb-1">{feedback.title}</p>
                                <p className="text-sm text-gray-600">{feedback.comment}</p>
                              </div>
                              <div>
                                <Label htmlFor="admin-response">La tua risposta</Label>
                                <Textarea
                                  id="admin-response"
                                  value={adminResponse}
                                  onChange={(e) => setAdminResponse(e.target.value)}
                                  placeholder="Scrivi una risposta professionale al cliente..."
                                  rows={4}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleResponseSubmit} disabled={isUpdating || !adminResponse.trim()}>
                                {isUpdating ? "Invio..." : "Invia Risposta"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
