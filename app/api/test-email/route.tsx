import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, subject, message } = body

    // Test email template
    const emailContent = `
      <h1>Test Email - LEGNO Configuratore</h1>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>Sent to:</strong> ${email}</p>
      <p><em>Test email sent at ${new Date().toLocaleString("it-IT")}</em></p>
    `

    // Simulate email sending
    console.log("Test email would be sent:", emailContent)

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      details: {
        to: email,
        subject,
        sentAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json({ error: "Failed to send test email" }, { status: 500 })
  }
}
