import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { configurationId } = await request.json()

    if (!configurationId) {
      return NextResponse.json({ error: "Configuration ID is required" }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )

    // Fetch configuration data
    const { data: configuration, error } = await supabase
      .from("configuratorelegno_configurations")
      .select("*")
      .eq("id", configurationId)
      .single()

    if (error || !configuration) {
      return NextResponse.json({ error: "Configuration not found" }, { status: 404 })
    }

    // Generate PDF content
    const pdfContent = generatePDFHTML(configuration)

    // Use Puppeteer or similar to generate PDF
    // For now, we'll create a simple HTML response that can be printed as PDF
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Preventivo Pergola - ${configuration.id}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #8B4513;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .company-name {
              font-size: 28px;
              font-weight: bold;
              color: #8B4513;
              margin-bottom: 5px;
            }
            .company-tagline {
              font-size: 14px;
              color: #666;
              font-style: italic;
            }
            .section {
              margin-bottom: 25px;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 8px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #8B4513;
              margin-bottom: 15px;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              padding: 5px 0;
            }
            .detail-label {
              font-weight: 500;
              color: #555;
            }
            .detail-value {
              color: #333;
            }
            .price {
              font-weight: bold;
              color: #8B4513;
              font-size: 16px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-pending { background-color: #fef3c7; color: #92400e; }
            .status-processing { background-color: #dbeafe; color: #1e40af; }
            .status-completed { background-color: #d1fae5; color: #065f46; }
            .status-cancelled { background-color: #fee2e2; color: #991b1b; }
            @media print {
              body { margin: 0; padding: 15px; }
              .section { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          ${pdfContent}
        </body>
      </html>
    `

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="preventivo-pergola-${configurationId}.html"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generatePDFHTML(configuration: any): string {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: "In Attesa",
      processing: "In Lavorazione",
      completed: "Completato",
      cancelled: "Annullato",
    }
    return statusMap[status] || "In Attesa"
  }

  const contactData =
    typeof configuration.contact_data === "string" ? JSON.parse(configuration.contact_data) : configuration.contact_data

  const accessories = configuration.accessory_names || []
  const floorings = configuration.flooring_names || []

  return `
    <div class="header">
      <div class="company-name">MARTELLO 1930</div>
      <div class="company-tagline">Pergole in Legno di Qualità</div>
      <div style="margin-top: 15px;">
        <span class="status-badge status-${configuration.status || "pending"}">
          ${getStatusLabel(configuration.status || "pending")}
        </span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Informazioni Preventivo</div>
      <div class="detail-row">
        <span class="detail-label">Numero Preventivo:</span>
        <span class="detail-value">#${configuration.id}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Data Richiesta:</span>
        <span class="detail-value">${formatDate(configuration.created_at)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Tipo di Servizio:</span>
        <span class="detail-value">
          ${configuration.service_type === "chiavi_in_mano" ? "Chiavi in Mano" : "Solo Fornitura"}
        </span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Dati Cliente</div>
      <div class="detail-row">
        <span class="detail-label">Nome Completo:</span>
        <span class="detail-value">${contactData?.nome || ""} ${contactData?.cognome || ""}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Email:</span>
        <span class="detail-value">${contactData?.email || ""}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Telefono:</span>
        <span class="detail-value">${contactData?.telefono || ""}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Indirizzo:</span>
        <span class="detail-value">${contactData?.indirizzo || ""}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Città:</span>
        <span class="detail-value">${contactData?.citta || ""}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Contatto Preferito:</span>
        <span class="detail-value">${configuration.contact_preference || ""}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Specifiche Pergola</div>
      <div class="detail-row">
        <span class="detail-label">Tipo di Pergola:</span>
        <span class="detail-value">${configuration.type_name || ""}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Dimensioni:</span>
        <span class="detail-value">
          ${configuration.width} × ${configuration.depth} × ${configuration.height} cm
        </span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Colore:</span>
        <span class="detail-value">
          ${configuration.color_category?.replace("_", " ") || ""} - ${configuration.color_name || ""}
        </span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Copertura:</span>
        <span class="detail-value">${configuration.coverage_name || ""}</span>
      </div>
    </div>

    ${
      floorings.length > 0
        ? `
    <div class="section">
      <div class="section-title">Pavimentazioni Selezionate</div>
      ${floorings
        .map(
          (flooring: string) => `
        <div class="detail-row">
          <span class="detail-value">• ${flooring}</span>
        </div>
      `,
        )
        .join("")}
    </div>
    `
        : ""
    }

    ${
      accessories.length > 0
        ? `
    <div class="section">
      <div class="section-title">Accessori Selezionati</div>
      ${accessories
        .map(
          (accessory: string) => `
        <div class="detail-row">
          <span class="detail-value">• ${accessory}</span>
        </div>
      `,
        )
        .join("")}
      ${
        configuration.total_price > 0
          ? `
      <div class="detail-row" style="border-top: 1px solid #ddd; margin-top: 15px; padding-top: 15px;">
        <span class="detail-label">Totale Accessori:</span>
        <span class="detail-value price">${formatPrice(configuration.total_price)}</span>
      </div>
      `
          : ""
      }
    </div>
    `
        : ""
    }

    ${
      contactData?.note
        ? `
    <div class="section">
      <div class="section-title">Note Cliente</div>
      <div class="detail-value">${contactData.note}</div>
    </div>
    `
        : ""
    }

    ${
      configuration.admin_notes
        ? `
    <div class="section">
      <div class="section-title">Note Amministrative</div>
      <div class="detail-value">${configuration.admin_notes}</div>
    </div>
    `
        : ""
    }

    <div class="footer">
      <p><strong>MARTELLO 1930</strong> - Pergole in Legno di Qualità</p>
      <p>Email: info@martello1930.net | Telefono: +39 XXX XXX XXXX</p>
      <p>Questo preventivo è valido per 30 giorni dalla data di emissione</p>
      <p style="margin-top: 15px; font-size: 10px;">
        Documento generato automaticamente il ${formatDate(new Date().toISOString())}
      </p>
    </div>
  `
}
