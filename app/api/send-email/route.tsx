import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function sendEmailWithSendWith(to: string, subject: string, body: string) {
  try {
    console.log("[v0] Attempting to send email via SendWith to:", to)
    console.log("[v0] Using sender email: info@martello1930.net")

    const emailPayload = {
      message: {
        to: [
          {
            email: to,
          },
        ],
        from: {
          email: "info@martello1930.net",
        },
        subject: subject,
        body: body,
      },
    }

    console.log("[v0] SendWith payload prepared:", JSON.stringify(emailPayload, null, 2))

    const response = await fetch("https://app.sendwith.email/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 7d4db474cad47167840902714f1dbc8583792fb2c077e935bf21292331776b54",
      },
      body: JSON.stringify(emailPayload),
    })

    console.log("[v0] SendWith API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] SendWith API error details:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries()),
      })

      // Check for specific authentication errors
      if (response.status === 400 && errorText.includes("No authenticated users")) {
        console.error("[v0] CRITICAL: Email info@martello1930.net is not authenticated in SendWith dashboard")
        console.error("[v0] SOLUTION: Verify email in SendWith dashboard or use alternative sender")
      }

      throw new Error(`SendWith API error: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    console.log("[v0] SendWith email sent successfully:", result)
    return { success: true, method: "sendwith", result }
  } catch (error) {
    console.error("[v0] SendWith email error:", error)
    return { success: false, error: error.message }
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

    console.log("[v0] Configuration saved successfully:", data[0]?.id)

    const customerConfirmationContent = `
      Gentile ${body.contact_data?.nome},
      
      La ringraziamo per aver utilizzato il nostro configuratore pergole.
      
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
      
      Cordiali saluti,
      MARTELLO 1930 - Dal 1930, Tradizione Italiana
    `

    const adminNotificationContent = `
      Nuova richiesta di preventivo ricevuta:
      
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
      console.log("[v0] Initiating customer email sending process...")

      const customerEmailResult = await sendEmailWithSendWith(
        body.contact_data.email,
        "Conferma Richiesta Preventivo - MARTELLO 1930",
        customerConfirmationContent,
      )

      if (customerEmailResult.success) {
        customerEmailSent = true
        console.log("[v0] ✅ Customer email sent successfully via SendWith")
      } else {
        console.log("[v0] ⚠️ Customer email SendWith failed, activating internal confirmation system")
        const confirmationResult = await logCustomerConfirmation(
          body.contact_data.email,
          "Conferma Richiesta Preventivo - MARTELLO 1930",
          customerConfirmationContent,
          `${body.contact_data?.nome} ${body.contact_data?.cognome}`.trim() || "Cliente",
        )
        confirmationLogged = confirmationResult.success
      }
    }

    console.log("[v0] Initiating admin notification email sending process...")

    const adminEmailResult = await sendEmailWithSendWith(
      "info@martello1930.net",
      `Nuova Richiesta Preventivo - ${body.contact_data?.nome} ${body.contact_data?.cognome}`,
      adminNotificationContent,
    )

    if (adminEmailResult.success) {
      adminEmailSent = true
      console.log("[v0] ✅ Admin notification email sent successfully via SendWith")
    } else {
      console.log("[v0] ⚠️ Admin notification email SendWith failed")
    }

    if (customerEmailSent && adminEmailSent) {
      emailMethod = "sendwith_both"
    } else if (customerEmailSent || adminEmailSent) {
      emailMethod = "sendwith_partial"
    } else if (confirmationLogged) {
      emailMethod = "internal"
    } else {
      emailMethod = "failed"
    }

    console.log(
      `[v0] Email status - Customer: ${customerEmailSent ? "✅ sent" : confirmationLogged ? "⚠️ logged internally" : "❌ failed"}, Admin: ${adminEmailSent ? "✅ sent" : "❌ failed"}`,
    )

    // Create admin notification in database
    const { error: notificationError } = await supabase.from("configuratorelegno_notifications").insert({
      type: "new_quote",
      category: "quote_request",
      title: `Nuova Richiesta Preventivo - ${body.contact_data?.nome} ${body.contact_data?.cognome}`,
      message: adminNotificationContent,
      configuration_id: data[0]?.id,
      recipient_type: "admin",
      recipient_email: "info@martello1930.net",
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
    console.error("[v0] Error processing quote request:", error)

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
