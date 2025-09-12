import { type NextRequest, NextResponse } from "next/server"

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

    // In a real implementation, you would integrate with an email service like:
    // - SendGrid
    // - Resend
    // - Nodemailer with SMTP
    // - AWS SES

    // For now, we'll simulate email sending
    console.log("Email would be sent with content:", emailContent)

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
