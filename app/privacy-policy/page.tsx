import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 to-green-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
            <p className="text-center text-muted-foreground">
              Informativa sul trattamento dei dati personali - MARTELLO 1930
            </p>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <section>
              <h3 className="text-lg font-semibold mb-3">1. Titolare del Trattamento</h3>
              <p>
                Il Titolare del trattamento dei dati è MARTELLO 1930, con sede in [Indirizzo], contattabile all'email
                info@martello1930.net
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">2. Finalità del Trattamento</h3>
              <p>I dati personali vengono raccolti e trattati per le seguenti finalità:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Elaborazione e invio di preventivi personalizzati per pergole</li>
                <li>Gestione delle richieste di contatto e assistenza clienti</li>
                <li>Comunicazioni commerciali e promozionali (previo consenso)</li>
                <li>Adempimenti di obblighi contrattuali e fiscali</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">3. Base Giuridica</h3>
              <p>
                Il trattamento è basato sul consenso dell'interessato (art. 6, par. 1, lett. a GDPR) e sull'esecuzione
                di misure precontrattuali (art. 6, par. 1, lett. b GDPR).
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">4. Dati Raccolti</h3>
              <p>Vengono raccolti i seguenti dati personali:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Dati anagrafici (nome, cognome)</li>
                <li>Dati di contatto (email, telefono, indirizzo)</li>
                <li>Preferenze di configurazione pergola</li>
                <li>Note e richieste specifiche</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">5. Conservazione dei Dati</h3>
              <p>
                I dati personali saranno conservati per il tempo necessario al raggiungimento delle finalità per cui
                sono stati raccolti e comunque non oltre 24 mesi dalla raccolta, salvo diversi obblighi di legge.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">6. Diritti dell'Interessato</h3>
              <p>L'interessato ha diritto di:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Accedere ai propri dati personali</li>
                <li>Richiedere la rettifica o la cancellazione</li>
                <li>Limitare il trattamento</li>
                <li>Opporsi al trattamento</li>
                <li>Richiedere la portabilità dei dati</li>
                <li>Revocare il consenso in qualsiasi momento</li>
              </ul>
              <p className="mt-2">Per esercitare tali diritti, contattare: info@martello1930.net</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">7. Sicurezza</h3>
              <p>
                Adottiamo misure tecniche e organizzative appropriate per garantire un livello di sicurezza adeguato al
                rischio, proteggendo i dati da accessi non autorizzati, perdita o distruzione.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">8. Aggiornamenti</h3>
              <p>
                La presente informativa può essere aggiornata. La versione più recente è sempre disponibile su questa
                pagina.
              </p>
              <p className="text-muted-foreground mt-2">
                Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
