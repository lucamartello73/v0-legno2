import * as nodemailer from "nodemailer"

/**
 * Creates a Gmail SMTP transporter for sending emails
 * 
 * Configuration:
 * - GMAIL_USER: Your Gmail address (e.g., preventivi@martello1930.net)
 * - GMAIL_APP_PASSWORD: Google App Password (NOT your regular Gmail password)
 * 
 * To generate an App Password:
 * 1. Go to Google Account → Security
 * 2. Enable 2-Step Verification if not already enabled
 * 3. Go to "App passwords" section
 * 4. Generate a new app password for "Mail"
 * 5. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)
 * 
 * @returns Nodemailer transporter instance configured for Gmail SMTP
 */
export const createGmailTransport = () => {
  const gmailUser = process.env.GMAIL_USER
  const gmailPassword = process.env.GMAIL_APP_PASSWORD

  if (!gmailUser || !gmailPassword) {
    throw new Error(
      "Missing Gmail credentials. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables."
    )
  }

  console.log("📧 Creating Gmail SMTP transport...")
  console.log("🔑 GMAIL_USER:", gmailUser ? "✓ Set" : "✗ Missing")
  console.log("🔑 GMAIL_APP_PASSWORD:", gmailPassword ? "✓ Set" : "✗ Missing")

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // TLS port (recommended)
    secure: false, // false for port 587 (STARTTLS), true for 465 (SSL)
    auth: {
      user: gmailUser,
      pass: gmailPassword,
    },
    // Optional: enable debug output
    debug: process.env.NODE_ENV === "development",
    // Optional: log to console
    logger: process.env.NODE_ENV === "development",
  })
}

/**
 * Sends an email using Gmail SMTP
 * 
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param html - HTML email body
 * @param text - Plain text email body (optional, fallback for non-HTML clients)
 * @returns Promise with send result
 */
export const sendGmailEmail = async (
  to: string,
  subject: string,
  html: string,
  text?: string
) => {
  try {
    const transporter = createGmailTransport()
    const fromEmail = process.env.GMAIL_USER
    const fromName = process.env.GMAIL_FROM_NAME || "MARTELLO 1930"

    console.log(`📤 Sending email to: ${to}`)
    console.log(`📝 Subject: ${subject}`)

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML tags as fallback
    })

    console.log("✅ Email sent successfully!")
    console.log("📬 Message ID:", info.messageId)

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    }
  } catch (error) {
    console.error("❌ Failed to send email:", error)
    throw error
  }
}

/**
 * Sends multiple emails in parallel using Gmail SMTP
 * 
 * @param emails - Array of email configurations
 * @returns Promise with array of send results
 */
export const sendMultipleGmailEmails = async (
  emails: Array<{
    to: string
    subject: string
    html: string
    text?: string
  }>
) => {
  try {
    const transporter = createGmailTransport()
    const fromEmail = process.env.GMAIL_USER
    const fromName = process.env.GMAIL_FROM_NAME || "MARTELLO 1930"

    console.log(`📤 Sending ${emails.length} emails in parallel...`)

    const results = await Promise.allSettled(
      emails.map((email) =>
        transporter.sendMail({
          from: `"${fromName}" <${fromEmail}>`,
          to: email.to,
          subject: email.subject,
          html: email.html,
          text: email.text || email.html.replace(/<[^>]*>/g, ""),
        })
      )
    )

    const successful = results.filter((r) => r.status === "fulfilled").length
    const failed = results.filter((r) => r.status === "rejected").length

    console.log(`✅ Successfully sent: ${successful}/${emails.length}`)
    if (failed > 0) {
      console.warn(`⚠️  Failed to send: ${failed}/${emails.length}`)
    }

    return results.map((result, index) => ({
      to: emails[index].to,
      success: result.status === "fulfilled",
      messageId: result.status === "fulfilled" ? result.value.messageId : null,
      error: result.status === "rejected" ? result.reason : null,
    }))
  } catch (error) {
    console.error("❌ Failed to send multiple emails:", error)
    throw error
  }
}
