"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
// import Image from "next/image" - Usando img standard per compatibilità
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

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
    <header
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200"
    >
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="https://www.genspark.ai/api/files/s/bzknGl24"
              alt="Martello 1930"
              className="h-16 w-auto md:h-20"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[#1A1A1A]">MARTELLO 1930</span>
              <span className="text-xs text-[#666666]">Configuratore Pergole</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-[#666666] hover:text-[#3E2723] transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/configurator/type"
              className="text-[#666666] hover:text-[#3E2723] transition-colors font-medium"
            >
              Configuratore
            </Link>
            <Link
              href="/admin"
              className="text-[#666666] hover:text-[#3E2723] transition-colors font-medium"
            >
              Admin
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button asChild className="bg-[#3E2723] hover:bg-[#2C1810] text-white">
              <Link href="/configurator/type">Inizia Configurazione</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-[#1A1A1A]" />
            ) : (
              <Menu className="h-6 w-6 text-[#1A1A1A]" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <Link
                href="/"
                className="text-[#666666] hover:text-[#3E2723] transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/configurator/type"
                className="text-[#666666] hover:text-[#3E2723] transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Configuratore
              </Link>
              <Link
                href="/admin"
                className="text-[#666666] hover:text-[#3E2723] transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
              <Button asChild className="bg-[#3E2723] hover:bg-[#2C1810] text-white w-full">
                <Link href="/configurator/type" onClick={() => setIsMobileMenuOpen(false)}>
                  Inizia Configurazione
                </Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
