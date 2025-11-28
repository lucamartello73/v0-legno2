import { type NextRequest, NextResponse } from "next/server"
import { sendGmailEmail } from "@/lib/email/gmail-transport"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, subject, message } = body

    console.log("📧 [Test] Sending test email...")
    console.log("📧 [Test] To:", email)
    console.log("📝 [Test] Subject:", subject)

    const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧪 Test Email - LEGNO Configuratore</h1>
            </div>
            <div class="content">
              <div class="info-row">
                <span class="label">📧 Recipient:</span> ${email}
              </div>
              <div class="info-row">
                <span class="label">📝 Subject:</span> ${subject}
              </div>
              <div class="info-row">
                <span class="label">💬 Message:</span> ${message}
              </div>
              <div class="info-row">
                <span class="label">🕐 Sent at:</span> ${new Date().toLocaleString("it-IT", { 
                  timeZone: "Europe/Rome",
                  dateStyle: "full",
                  timeStyle: "long"
                })}
              </div>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
              <p style="font-size: 14px; color: #666;">
                ✅ Questo è un test email del sistema Gmail SMTP per MARTELLO 1930.<br>
                Se ricevi questo messaggio, la configurazione email è corretta!
              </p>
            </div>
            <div class="footer">
              <p>MARTELLO 1930 - Dal 1930, Tradizione Italiana</p>
              <p>info@martello1930.net</p>
            </div>
          </div>
        </body>
      </html>
    `

    const textContent = `
🧪 Test Email - LEGNO Configuratore

📧 Recipient: ${email}
📝 Subject: ${subject}
💬 Message: ${message}
🕐 Sent at: ${new Date().toLocaleString("it-IT")}

✅ Questo è un test email del sistema Gmail SMTP per MARTELLO 1930.
Se ricevi questo messaggio, la configurazione email è corretta!

---
MARTELLO 1930 - Dal 1930, Tradizione Italiana
info@martello1930.net
    `

    const result = await sendGmailEmail(email, subject, emailContent, textContent)

    console.log("✅ [Test] Email sent successfully!")

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully via Gmail SMTP",
      details: {
        to: email,
        subject,
        messageId: result.messageId,
        sentAt: new Date().toISOString(),
        provider: "Gmail SMTP",
      },
    })
  } catch (error) {
    console.error("❌ [Test] Error sending test email:", error)
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : "Unknown error",
        hint: "Check GMAIL_USER and GMAIL_APP_PASSWORD environment variables",
      },
      { status: 500 },
    )
  }
}
