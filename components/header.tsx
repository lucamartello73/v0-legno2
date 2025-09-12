"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-black/40 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <span className={`text-2xl font-bold ${isScrolled ? "text-foreground" : "text-white"}`}>MARTELLO 1930</span>
            <span className={`text-sm ${isScrolled ? "text-muted-foreground" : "text-white/80"}`}>
              Configuratore Pergole
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`hover:text-primary transition-colors ${isScrolled ? "text-foreground" : "text-white"}`}
            >
              Home
            </Link>
            <Link
              href="/configurator/type"
              className={`hover:text-primary transition-colors ${isScrolled ? "text-foreground" : "text-white"}`}
            >
              Configuratore
            </Link>
            <Link
              href="/admin"
              className={`hover:text-primary transition-colors ${isScrolled ? "text-foreground" : "text-white"}`}
            >
              Admin
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button asChild className="emerald-gradient text-white hover:opacity-90">
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
              <X className={`h-6 w-6 ${isScrolled ? "text-foreground" : "text-white"}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? "text-foreground" : "text-white"}`} />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col space-y-4 pt-4">
              <Link
                href="/"
                className={`hover:text-primary transition-colors ${isScrolled ? "text-foreground" : "text-white"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/configurator/type"
                className={`hover:text-primary transition-colors ${isScrolled ? "text-foreground" : "text-white"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Configuratore
              </Link>
              <Link
                href="/admin"
                className={`hover:text-primary transition-colors ${isScrolled ? "text-foreground" : "text-white"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
              <Button asChild className="emerald-gradient text-white w-full">
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
