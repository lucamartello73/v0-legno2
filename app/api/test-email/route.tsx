import { type NextRequest, NextResponse } from "next/server"

const SENDWITH_API_KEY = "7d4db474cad47167840902714f1dbc8583792fb2c077e935bf21292331776b54"
const SENDWITH_API_URL = "https://app.sendwith.email/api/send"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, subject, message } = body

    const emailContent = `
      <h1>Test Email - LEGNO Configuratore</h1>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>Sent to:</strong> ${email}</p>
      <p><em>Test email sent at ${new Date().toLocaleString("it-IT")}</em></p>
    `

    const emailData = {
      message: {
        to: [
          {
            email: email,
            name: "Test Recipient",
          },
        ],
        from: {
          email: "noreply@martello1930.net",
          name: "LEGNO Test System",
        },
        subject: subject,
        body: `Test message: ${message}`,
        HTMLbody: emailContent,
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

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      details: {
        to: email,
        subject,
        sentAt: new Date().toISOString(),
      },
      sendWithResponse: responseData,
    })
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json(
      {
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
