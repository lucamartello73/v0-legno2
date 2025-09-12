import { Header } from "@/components/header"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, CheckCircle, Star, Users, Award, Palette } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center emerald-gradient">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <Badge variant="secondary" className="mb-6 bg-black/60 text-white border-white/50">
            Dal 1930 - Tradizione Italiana
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Configuratore Pergole
            <span className="block text-white">MARTELLO 1930</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto text-pretty">
            Progetta la tua pergola ideale in legno con il nostro configuratore avanzato. Scegli dimensioni, colori,
            coperture e accessori per creare la soluzione perfetta per il tuo spazio esterno.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href="/configurator/type">
                Inizia Configurazione
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
            >
              <Link href="#features">Scopri di Più</Link>
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/elegant-wooden-pergola-in-italian-garden.jpg"
            alt="Pergola in legno MARTELLO 1930"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Perché Scegliere LEGNO?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Oltre 90 anni di esperienza nella lavorazione del legno, combinati con tecnologia moderna per il
              configuratore più avanzato.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover-lift">
              <CardHeader>
                <Palette className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Personalizzazione Completa</CardTitle>
                <CardDescription>8 step guidati per configurare ogni dettaglio della tua pergola</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Dimensioni personalizzate</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">15+ colori disponibili</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Accessori premium</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <Award className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Qualità Garantita</CardTitle>
                <CardDescription>Legno selezionato e trattato secondo i più alti standard italiani</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Legno certificato FSC</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Garanzia 10 anni</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Resistente alle intemperie</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Servizio Completo</CardTitle>
                <CardDescription>Dalla progettazione all'installazione, ti seguiamo in ogni fase</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Preventivo immediato</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Installazione professionale</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Assistenza post-vendita</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cosa Dicono i Nostri Clienti</h2>
            <p className="text-xl text-muted-foreground">Oltre 1000 pergole realizzate con soddisfazione garantita</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Marco Rossi",
                location: "Milano",
                rating: 5,
                text: "Configuratore fantastico! Ho potuto vedere esattamente come sarebbe stata la mia pergola prima dell'acquisto. Qualità eccellente.",
              },
              {
                name: "Laura Bianchi",
                location: "Roma",
                rating: 5,
                text: "Servizio impeccabile dalla configurazione all'installazione. La pergola è ancora più bella di come l'avevo immaginata.",
              },
              {
                name: "Giuseppe Verdi",
                location: "Napoli",
                rating: 5,
                text: "Tradizione e innovazione perfettamente bilanciate. Il configuratore è intuitivo e il risultato finale supera le aspettative.",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="hover-lift">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 emerald-gradient">
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto a Creare la Tua Pergola Ideale?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Inizia subito con il nostro configuratore e ricevi un preventivo personalizzato in pochi minuti.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link href="/configurator/type">
              Configura Ora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MARTELLO 1930</h3>
              <p className="text-sm text-muted-foreground">
                Dal 1930 creiamo pergole in legno di qualità superiore, combinando tradizione artigianale e innovazione
                tecnologica.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Prodotti</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/configurator/type" className="hover:text-secondary transition-colors">
                    Pergole Addossate
                  </Link>
                </li>
                <li>
                  <Link href="/configurator/type" className="hover:text-secondary transition-colors">
                    Pergole Libere
                  </Link>
                </li>
                <li>
                  <Link href="/configurator/accessories" className="hover:text-secondary transition-colors">
                    Accessori
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Servizi</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/configurator/type" className="hover:text-secondary transition-colors">
                    Configuratore
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-secondary transition-colors">
                    Installazione
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-secondary transition-colors">
                    Assistenza
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contatti</h4>
              <ul className="space-y-2 text-sm">
                <li>Tel: +39 333 123 4567</li>
                <li>Email: info@martello1930.it</li>
                <li>Via Roma 123, Milano</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-muted-foreground/20 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 MARTELLO 1930. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
