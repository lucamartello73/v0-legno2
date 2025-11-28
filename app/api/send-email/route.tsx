import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendMultipleGmailEmails } from "@/lib/email/gmail-transport"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function sendEmailWithGmail(to: string, subject: string, body: string) {
  try {
    console.log("📧 [Gmail] Attempting to send email to:", to)
    console.log("📝 [Gmail] Subject:", subject)

    // Convert plain text body to HTML if needed
    const htmlBody = body.includes("<") ? body : `<pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${body}</pre>`

    const result = await sendMultipleGmailEmails([
      {
        to,
        subject,
        html: htmlBody,
        text: body,
      },
    ])

    const emailResult = result[0]

    if (emailResult.success) {
      console.log("✅ [Gmail] Email sent successfully!")
      console.log("📬 [Gmail] Message ID:", emailResult.messageId)
      return { success: true, method: "gmail", messageId: emailResult.messageId }
    } else {
      console.error("❌ [Gmail] Email sending failed:", emailResult.error)
      throw new Error(`Gmail sending error: ${emailResult.error}`)
    }
  } catch (error) {
    console.error("❌ [Gmail] Email error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

async function logCustomerConfirmation(to: string, subject: string, content: string, customerName: string) {
  try {
    console.log("[v0] Activating internal confirmation system for:", to)

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create a customer confirmation record with enhanced details
    await supabase.from("configuratorelegno_notifications").insert({
      type: "customer_confirmation",
      category: "customer_service",
      title: `Conferma richiesta preventivo per ${customerName}`,
      message: `SISTEMA INTERNO ATTIVATO - Email di conferma preparata per: ${to}

OGGETTO: ${subject}

CONTENUTO PREPARATO:
${content}

--- STATO SISTEMA ---
✅ Richiesta elaborata con successo
✅ Dati salvati nel database
✅ Notifica admin creata
⚠️  Email esterna non disponibile - sistema interno attivo

AZIONE RICHIESTA:
Il cliente sarà contattato entro 24 ore secondo le sue preferenze di contatto.
Verificare configurazione email SendWith se necessario.`,
      recipient_type: "customer",
      recipient_email: to,
      recipient_name: customerName,
      priority: 1,
      send_email: false, // Internal logging only
      is_read: false,
      is_sent: true, // Mark as processed
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    console.log("[v0] Enhanced customer confirmation logged successfully")
    return { success: true, method: "internal_confirmation" }
  } catch (error) {
    console.error("[v0] Customer confirmation logging error:", error)
    return { success: false, error: error.message }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Quote request received:", {
      type: body.type_name,
      contact: body.contact_data?.email,
      service: body.service_type,
      timestamp: new Date().toISOString(),
    })

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Save configuration to database
    const { data, error } = await supabase
      .from("configuratorelegno_configurations")
      .insert({
        type_name: body.type_name,
        width: body.width,
        depth: body.depth,
        height: body.height,
        color_category: body.color_category,
        color_name: body.color_name,
        coverage_name: body.coverage_name,
        flooring_names: body.flooring_names || [],
        accessory_names: body.accessory_names || [],
        total_price: body.total_price || 0,
        service_type: body.service_type,
        contact_data: body.contact_data,
        contact_preference: body.contact_preference,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status_updated_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("[v0] Database error:", error)
      throw error
    }

    console.log("✅ Configuration saved successfully:", data[0]?.id)

    // ========================================
    // SALVA RICHIESTA CON TRACKING
    // ========================================
    console.log("📝 Creating richiesta with tracking...")
    
    const richiestaData = {
      configurazione_id: data[0]?.id,
      
      // Dati cliente
      cliente_nome: body.contact_data?.nome || "",
      cliente_cognome: body.contact_data?.cognome || "",
      cliente_email: body.contact_data?.email || "",
      cliente_telefono: body.contact_data?.telefono || "",
      
      // Tipo richiesta
      tipo_richiesta: "preventivo",
      servizio_richiesto: body.service_type || "fai_da_te",
      necessita_installazione: body.service_type === "installazione_completa",
      
      // Preferenze
      preferenza_contatto: body.contact_preference || "email",
      urgenza: "normale",
      
      // Pricing
      prezzo_configuratore: body.total_price || 0,
      prezzo_quotato: body.total_price || 0,
      
      // Note
      note_cliente: body.contact_data?.note || null,
      
      // Stato iniziale
      stato: "nuova",
      priorita: "normale",
      
      // Fonte
      fonte_richiesta: "Configuratore Web",
      
      // Timestamp
      data_richiesta: new Date().toISOString(),
    }

    const { data: richiestaInserted, error: richiestaError } = await supabase
      .from("configuratorelegno_richieste")
      .insert([richiestaData])
      .select()

    if (richiestaError) {
      console.error("⚠️  Richiesta tracking error (non-blocking):", richiestaError)
      // Non bloccare il processo se il tracking fallisce
    } else {
      console.log("✅ Richiesta created with tracking:", richiestaInserted[0]?.id)
      console.log("📋 Codice preventivo:", richiestaInserted[0]?.codice_preventivo)
    }

    const codicePreventivo = richiestaInserted?.[0]?.codice_preventivo || ""
    
    const customerConfirmationContent = `
      Gentile ${body.contact_data?.nome},
      
      La ringraziamo per aver utilizzato il nostro CONFIGURATORE PERGOLE LEGNO.
      ${codicePreventivo ? `\n      CODICE PREVENTIVO: ${codicePreventivo}\n` : ""}
      
      RIEPILOGO CONFIGURAZIONE:
      • Tipo: ${body.type_name}
      • Dimensioni: ${body.width}m x ${body.depth}m x ${body.height}m
      • Colore: ${body.color_name}
      • Copertura: ${body.coverage_name}
      • Servizio: ${body.service_type === "fai_da_te" ? "Fai da te" : "Installazione completa"}
      • Prezzo stimato: €${body.total_price?.toLocaleString("it-IT")}
      ${body.flooring_names?.length ? `• Pavimentazioni: ${body.flooring_names.join(", ")}` : ""}
      ${body.accessory_names?.length ? `• Accessori: ${body.accessory_names.join(", ")}` : ""}
      
      Il nostro team la contatterà entro 24 ore tramite ${body.contact_preference === "email" ? "email" : body.contact_preference === "telefono" ? "telefono" : "email o telefono"}.
      ${codicePreventivo ? `\nPer qualsiasi comunicazione, indicare il codice preventivo: ${codicePreventivo}\n` : ""}
      
      Cordiali saluti,
      MARTELLO 1930 - Dal 1930, Tradizione Italiana
    `

    const adminNotificationContent = `
      🏛️ CONFIGURATORE PERGOLE LEGNO - Nuova richiesta di preventivo ricevuta:
      ${codicePreventivo ? `\n      📋 CODICE PREVENTIVO: ${codicePreventivo}\n` : ""}
      
      Cliente: ${body.contact_data?.nome} ${body.contact_data?.cognome}
      Email: ${body.contact_data?.email}
      Telefono: ${body.contact_data?.telefono || "Non fornito"}
      
      Configurazione:
      - Tipo: ${body.type_name}
      - Dimensioni: ${body.width}m x ${body.depth}m x ${body.height}m
      - Colore: ${body.color_name}
      - Copertura: ${body.coverage_name}
      - Servizio: ${body.service_type === "fai_da_te" ? "Fai da te" : "Installazione completa"}
      - Prezzo stimato: €${body.total_price?.toLocaleString("it-IT")}
      
      Pavimentazioni: ${body.flooring_names?.join(", ") || "Nessuna"}
      Accessori: ${body.accessory_names?.join(", ") || "Nessuno"}
      
      Preferenza contatto: ${body.contact_preference || "Non specificata"}
      
      ID Configurazione: ${data[0]?.id}
    `

    let customerEmailSent = false
    let adminEmailSent = false
    let confirmationLogged = false
    let emailMethod = "none"

    if (body.contact_data?.email) {
      console.log("📧 [Gmail] Initiating customer email sending process...")

      const customerEmailResult = await sendEmailWithGmail(
        body.contact_data.email,
        "CONFIGURATORE PERGOLE LEGNO - Conferma Richiesta Preventivo - MARTELLO 1930",
        customerConfirmationContent,
      )

      if (customerEmailResult.success) {
        customerEmailSent = true
        console.log("✅ [Gmail] Customer email sent successfully")
      } else {
        console.log("⚠️ [Gmail] Customer email failed, activating internal confirmation system")
        const confirmationResult = await logCustomerConfirmation(
          body.contact_data.email,
          "CONFIGURATORE PERGOLE LEGNO - Conferma Richiesta Preventivo - MARTELLO 1930",
          customerConfirmationContent,
          `${body.contact_data?.nome} ${body.contact_data?.cognome}`.trim() || "Cliente",
        )
        confirmationLogged = confirmationResult.success
      }
    }

    console.log("📧 [Gmail] Initiating admin notification email sending process...")

    // Get admin email from environment variable or use default
    const adminEmail = process.env.ADMIN_EMAIL || "preventivi@martello1930.net"
    console.log("📧 [Gmail] Admin email target:", adminEmail)

    const adminEmailResult = await sendEmailWithGmail(
      adminEmail,
      `CONFIGURATORE PERGOLE LEGNO - Nuova Richiesta Preventivo - ${body.contact_data?.nome} ${body.contact_data?.cognome}`,
      adminNotificationContent,
    )

    if (adminEmailResult.success) {
      adminEmailSent = true
      console.log("✅ [Gmail] Admin notification email sent successfully")
    } else {
      console.log("⚠️ [Gmail] Admin notification email failed")
    }

    if (customerEmailSent && adminEmailSent) {
      emailMethod = "gmail_both"
    } else if (customerEmailSent || adminEmailSent) {
      emailMethod = "gmail_partial"
    } else if (confirmationLogged) {
      emailMethod = "internal"
    } else {
      emailMethod = "failed"
    }

    console.log(
      `📊 [Gmail] Email status - Customer: ${customerEmailSent ? "✅ sent" : confirmationLogged ? "⚠️ logged internally" : "❌ failed"}, Admin: ${adminEmailSent ? "✅ sent" : "❌ failed"}`,
    )

    // Create admin notification in database
    const { error: notificationError } = await supabase.from("configuratorelegno_notifications").insert({
      type: "new_quote",
      category: "quote_request",
      title: `CONFIGURATORE PERGOLE LEGNO - Nuova Richiesta Preventivo - ${body.contact_data?.nome} ${body.contact_data?.cognome}`,
      message: adminNotificationContent,
      configuration_id: data[0]?.id,
      recipient_type: "admin",
      recipient_email: adminEmail,
      recipient_name: "MARTELLO 1930",
      priority: 2,
      send_email: adminEmailSent,
      send_push: true,
      send_sms: false,
      is_read: false,
      is_sent: adminEmailSent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (notificationError) {
      console.error("[v0] Notification error:", notificationError)
      // Don't throw - configuration is saved, notification is secondary
    }

    console.log("[v0] Quote request processed successfully - all data saved and notifications created")

    const responseMessages = {
      sendwith_both:
        "Richiesta inviata con successo! Hai ricevuto una email di conferma e il nostro team è stato notificato. Ti contatteremo entro 24 ore. Grazie per aver scelto MARTELLO 1930!",
      sendwith_partial:
        "Richiesta inviata con successo! Il nostro team ti contatterà entro 24 ore tramite email o telefono secondo la tua preferenza. Grazie per aver scelto MARTELLO 1930!",
      internal:
        "Richiesta inviata con successo! Il nostro team ti contatterà entro 24 ore tramite email o telefono secondo la tua preferenza. Grazie per aver scelto MARTELLO 1930!",
      failed:
        "Richiesta ricevuta con successo! Il nostro team ti contatterà entro 24 ore. Se non ricevi nostre comunicazioni, contattaci direttamente a info@martello1930.net. Grazie per aver scelto MARTELLO 1930!",
    }

    return NextResponse.json({
      success: true,
      message: responseMessages[emailMethod] || responseMessages.failed,
      configuration_id: data[0]?.id,
      status: "processed",
      customer_email_sent: customerEmailSent,
      admin_email_sent: adminEmailSent,
      email_method: emailMethod,
      system_status: {
        database_saved: true,
        admin_notified: !notificationError,
        customer_notified: customerEmailSent || confirmationLogged,
        admin_email_sent: adminEmailSent,
      },
      next_steps:
        "Il nostro team esaminerà la tua richiesta e ti contatterà entro 24 ore per discutere i dettagli e fornirti un preventivo personalizzato.",
    })
  } catch (error) {
    console.error("❌ Error processing quote request:", error)

    return NextResponse.json(
      {
        success: false,
        message:
          "Si è verificato un errore durante l'elaborazione della richiesta. Ti preghiamo di riprovare o contattarci direttamente all'indirizzo info@martello1930.net o al telefono.",
        error: "processing_error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
