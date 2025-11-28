"use client"

// import Image from "next/image" - Usando img standard
import Link from "next/link"
import { MapPin, Phone, Mail, Globe, MessageCircle } from "lucide-react"

export default function FooterMartello1930() {
  return (
    <footer className="bg-gradient-to-br from-green-700 to-green-900 text-white mt-auto">
      {/* Header con Logo */}
      <div className="border-b border-white/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <img
              src="/logo-martello-1930.png"
              alt="Martello 1930"
              className="h-28 w-auto md:h-32"
            />
          </div>
        </div>
      </div>

      {/* Contenuto Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Colonna 1: Chi Siamo */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Chi Siamo</h3>
            <p className="text-sm text-white/90 leading-relaxed">
              Dal 1930 realizziamo strutture in legno di qualità superiore. Pergole, carport, 
              pensiline e soluzioni artigianali su misura per valorizzare i tuoi spazi esterni.
            </p>
          </div>

          {/* Colonna 2: Contatti */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Contatti</h3>
            <div className="space-y-3 text-sm">
              <a
                href="tel:+390185167656"
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
              >
                <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>+39 0185 167 65 66</span>
              </a>
              <a
                href="https://wa.me/390185167656"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
              >
                <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>WhatsApp</span>
              </a>
              <a
                href="mailto:soluzioni@martello1930.net"
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
              >
                <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>soluzioni@martello1930.net</span>
              </a>
            </div>
          </div>

          {/* Colonna 3: Sede */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Dove Siamo</h3>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Via+Aurelia+Sestri+Levante+GE"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-white/90 hover:text-white transition-colors group"
            >
              <MapPin className="h-4 w-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-sm">
                Via Aurelia<br />
                Sestri Levante (GE)<br />
                Italia
              </span>
            </a>
          </div>

          {/* Colonna 4: Link Utili */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Link Utili</h3>
            <div className="space-y-3 text-sm">
              <a
                href="https://www.martello1930.net"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
              >
                <Globe className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>www.martello1930.net</span>
              </a>
              <Link
                href="/configurator/type"
                className="block text-white/90 hover:text-white transition-colors"
              >
                Configuratore Pergole
              </Link>
              <Link
                href="/"
                className="block text-white/90 hover:text-white transition-colors"
              >
                Torna alla Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright e Link Legali */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/80">
            <div className="text-center md:text-left">
              <p>© {new Date().getFullYear()} Martello 1930. Tutti i diritti riservati.</p>
              <p className="mt-1">Strutture in legno dal 1930 • Qualità artigianale italiana</p>
            </div>
            <div className="flex items-center gap-4 text-center">
              <span>P.IVA: 01234567890</span>
              <Link 
                href="/privacy-policy" 
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/cookie-policy" 
                className="hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
