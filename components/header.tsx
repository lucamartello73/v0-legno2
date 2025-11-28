"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, Mail, Facebook, Instagram, MessageCircle } from "lucide-react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Top Bar Verde - Contatti e Social */}
      <div className="bg-[#6AB52B] text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-sm">
            {/* Contatti */}
            <div className="flex items-center gap-4">
              <a 
                href="tel:+390185167656" 
                className="flex items-center gap-2 hover:text-white/90 transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">+39 0185 167 566</span>
              </a>
              <a 
                href="mailto:soluzioni@martello1930.net" 
                className="flex items-center gap-2 hover:text-white/90 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">soluzioni@martello1930.net</span>
              </a>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/martello1930"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/90 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/martello1930"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/90 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/390185167656"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/90 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Bianco */}
      <div 
        className={`bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 transition-all duration-300 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Click va al sito principale */}
            <a 
              href="https://www.martello1930.net" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <img
                src="/logo-martello-1930.png"
                alt="Martello 1930"
                className="h-12 w-auto md:h-14"
              />
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold text-gray-900">MARTELLO 1930</span>
                <span className="text-xs text-gray-600">Configuratore Pergole in Legno</span>
              </div>
            </a>

            {/* Admin Icon - Discreto */}
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="text-gray-400 hover:text-[#6AB52B] transition-colors p-2 rounded-lg hover:bg-gray-100"
                title="Admin"
                aria-label="Pannello Admin"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-900" />
              ) : (
                <Menu className="h-6 w-6 text-gray-900" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4 pt-4">
                <a
                  href="https://www.martello1930.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-[#6AB52B] transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sito Principale
                </a>
                <Link
                  href="/configurator/type"
                  className="text-gray-700 hover:text-[#6AB52B] transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Configuratore
                </Link>
                <Link
                  href="/admin"
                  className="text-gray-500 hover:text-[#6AB52B] transition-colors font-medium text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
