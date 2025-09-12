"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/configurator/type")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center martello-gradient">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-xl">Caricamento configuratore...</p>
      </div>
    </div>
  )
}
