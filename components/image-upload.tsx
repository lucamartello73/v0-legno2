"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadApi } from "@/lib/api"
import { Upload, X, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  className?: string
}

export function ImageUpload({ value, onChange, label = "Immagine", className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    try {
      const result = await uploadApi.uploadImage(file)
      onChange(result.url)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Errore durante l'upload dell'immagine")
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemove = () => {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={className}>
      <Label className="text-sm font-medium">{label}</Label>

      {value ? (
        <div className="mt-2 space-y-3">
          <div className="relative inline-block">
            <img src={value || "/placeholder.svg"} alt="Preview" className="h-32 w-32 object-cover rounded-lg border" />
            <Button
              onClick={handleRemove}
              size="sm"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">Clicca per sostituire l'immagine</div>
        </div>
      ) : null}

      <div
        className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        <div className="space-y-3">
          <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
          <div>
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Caricamento..." : "Seleziona Immagine"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Trascina un'immagine qui o clicca per selezionare
            <br />
            Formati supportati: JPEG, PNG, WebP (max 5MB)
          </p>
        </div>
      </div>
    </div>
  )
}
