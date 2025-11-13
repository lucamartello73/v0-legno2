"use client"

import Link from "next/link"
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react"

export default function FooterMartello1930() {
  return (
    <footer className="bg-wood-900 text-wood-100 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonna 1: Info azienda */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-wood-50">MARTELLO 1930</h3>
            <p className="text-sm mb-4 text-wood-300">
              Da oltre 90 anni realizziamo strutture in legno di qualità superiore.
              Pergole bioclimatiche, carport e coperture artigianali su misura.
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/martello1930" target="_blank" rel="noopener noreferrer" className="hover:text-wood-400 transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="https://www.instagram.com/martello1930" target="_blank" rel="noopener noreferrer" className="hover:text-wood-400 transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="https://www.linkedin.com/company/martello1930" target="_blank" rel="noopener noreferrer" className="hover:text-wood-400 transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Colonna 2: Link utili */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-wood-50">Link Utili</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/progetti" className="hover:text-wood-400 transition-colors">
                  I Nostri Progetti
                </Link>
              </li>
              <li>
                <Link href="/configurator" className="hover:text-wood-400 transition-colors">
                  Configuratore Online
                </Link>
              </li>
              <li>
                <Link href="/prenota-appuntamento" className="hover:text-wood-400 transition-colors">
                  Prenota Appuntamento
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-wood-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonna 3: Contatti */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-wood-50">Contatti</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0 text-wood-400" />
                <span>Via Martello, 123<br />12345 Città (Provincia)</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0 text-wood-400" />
                <a href="tel:+390123456789" className="hover:text-wood-400 transition-colors">
                  +39 012 345 6789
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0 text-wood-400" />
                <a href="mailto:info@martello1930.net" className="hover:text-wood-400 transition-colors">
                  info@martello1930.net
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-wood-800 mt-8 pt-6 text-center text-sm text-wood-400">
          <p>&copy; {new Date().getFullYear()} MARTELLO 1930. Tutti i diritti riservati.</p>
          <p className="mt-2">P.IVA: IT01234567890 | Codice SDI: ABCDEFG</p>
        </div>
      </div>
    </footer>
  )
}
