import { type NextRequest, NextResponse } from "next/server"

const SENDWITH_API_KEY = "7d4db474cad47167840902714f1dbc8583792fb2c077e935bf21292331776b54"
const SENDWITH_API_URL = "https://app.sendwith.email/api/send"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Email template for quote request
    const emailContent = `
      <h1>Richiesta Preventivo Pergola - MARTELLO 1930</h1>
      
      <h2>Configurazione Selezionata:</h2>
      <ul>
        <li><strong>Tipo:</strong> ${body.type_name}</li>
        <li><strong>Dimensioni:</strong> ${body.width}x${body.depth}x${body.height} cm</li>
        <li><strong>Colore:</strong> ${body.color_category?.replace("_", " ")} - ${body.color_name}</li>
        <li><strong>Copertura:</strong> ${body.coverage_name}</li>
        ${body.flooring_names?.length > 0 ? `<li><strong>Pavimentazioni:</strong> ${body.flooring_names.join(", ")}</li>` : ""}
        ${body.accessory_names?.length > 0 ? `<li><strong>Accessori:</strong> ${body.accessory_names.join(", ")}</li>` : ""}
        ${body.total_price > 0 ? `<li><strong>Totale Accessori:</strong> €${body.total_price.toFixed(2)}</li>` : ""}
        <li><strong>Tipo Servizio:</strong> ${body.service_type === "chiavi_in_mano" ? "Chiavi in Mano" : "Fai da Te"}</li>
      </ul>

      <h2>Dati Cliente:</h2>
      <ul>
        <li><strong>Nome:</strong> ${body.contact_data?.nome} ${body.contact_data?.cognome}</li>
        <li><strong>Email:</strong> ${body.contact_data?.email}</li>
        <li><strong>Telefono:</strong> ${body.contact_data?.telefono}</li>
        <li><strong>Indirizzo:</strong> ${body.contact_data?.indirizzo}, ${body.contact_data?.citta}</li>
        <li><strong>Preferenza Contatto:</strong> ${body.contact_preference}</li>
        ${body.contact_data?.note ? `<li><strong>Note:</strong> ${body.contact_data.note}</li>` : ""}
      </ul>

      <p><em>Richiesta inviata il ${new Date().toLocaleString("it-IT")}</em></p>
    `

    const emailData = {
      message: {
        to: [
          {
            email: "info@martello1930.net",
          },
        ],
        from: {
          email: "info@martello1930.net",
        },
        subject: `Richiesta Preventivo Pergola - ${body.contact_data?.nome} ${body.contact_data?.cognome}`,
        body: emailContent,
      },
    }

    const response = await fetch(SENDWITH_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDWITH_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("SendWith API error:", response.status, errorData)
      throw new Error(`SendWith API error: ${response.status}`)
    }

    const responseData = await response.json()
    console.log("Email sent successfully via SendWith:", responseData)

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      sendWithResponse: responseData,
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
