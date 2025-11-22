import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * GET /api/richieste
 * Recupera richieste con filtri opzionali
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { searchParams } = new URL(request.url)

    // Parametri di filtro
    const stato = searchParams.get("stato")
    const priorita = searchParams.get("priorita")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")
    const searchQuery = searchParams.get("search")
    const view = searchParams.get("view") // "active", "all", "completed"

    console.log("📊 GET /api/richieste - Filters:", {
      stato,
      priorita,
      limit,
      offset,
      searchQuery,
      view,
    })

    let query = supabase.from("configuratorelegno_richieste").select(
      `
        *,
        configurazione:configurazione_id (
          type_name,
          width,
          depth,
          height,
          color_name,
          coverage_name,
          flooring_names,
          accessory_names,
          total_price
        )
      `,
      { count: "exact" }
    )

    // Applica filtri
    if (view === "active") {
      query = query.not("stato", "in", "(completata,annullata,persa)")
    } else if (view === "completed") {
      query = query.in("stato", ["completata", "annullata", "persa"])
    }

    if (stato) {
      query = query.eq("stato", stato)
    }

    if (priorita) {
      query = query.eq("priorita", priorita)
    }

    if (searchQuery) {
      query = query.or(
        `cliente_nome.ilike.%${searchQuery}%,cliente_cognome.ilike.%${searchQuery}%,cliente_email.ilike.%${searchQuery}%,codice_preventivo.ilike.%${searchQuery}%`
      )
    }

    // Ordinamento e paginazione
    query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error("❌ Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`✅ Retrieved ${data?.length} richieste (total: ${count})`)

    return NextResponse.json({
      data,
      count,
      limit,
      offset,
    })
  } catch (error) {
    console.error("❌ GET /api/richieste error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/richieste
 * Crea una nuova richiesta (usato raramente, di solito creata da send-email)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const body = await request.json()

    console.log("📝 POST /api/richieste - Creating new richiesta")

    const { data, error } = await supabase.from("configuratorelegno_richieste").insert([body]).select().single()

    if (error) {
      console.error("❌ Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("✅ Richiesta created:", data.id)
    console.log("📋 Codice preventivo:", data.codice_preventivo)

    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ POST /api/richieste error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PATCH /api/richieste?id={uuid}
 * Aggiorna una richiesta esistente (cambio stato, note, prezzi, etc.)
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID richiesta richiesto" }, { status: 400 })
    }

    console.log("🔄 PATCH /api/richieste - Updating richiesta:", id)
    console.log("📝 Changes:", Object.keys(body))

    // Recupera stato attuale per logging
    const { data: richiestaCorrente } = await supabase
      .from("configuratorelegno_richieste")
      .select("stato, cliente_email, codice_preventivo")
      .eq("id", id)
      .single()

    // Aggiorna richiesta
    const { data, error } = await supabase.from("configuratorelegno_richieste").update(body).eq("id", id).select().single()

    if (error) {
      console.error("❌ Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log cambio stato se avvenuto
    if (body.stato && richiestaCorrente?.stato !== body.stato) {
      console.log(`🔄 Stato changed: ${richiestaCorrente?.stato} → ${body.stato}`)
      console.log(`📧 Cliente: ${richiestaCorrente?.cliente_email}`)
      console.log(`📋 Codice: ${richiestaCorrente?.codice_preventivo}`)

      // TODO: Inviare email notifica cliente sul cambio stato (opzionale)
    }

    console.log("✅ Richiesta updated successfully")

    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ PATCH /api/richieste error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * DELETE /api/richieste?id={uuid}
 * Elimina una richiesta (soft delete preferibile: stato = 'annullata')
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID richiesta richiesto" }, { status: 400 })
    }

    console.log("🗑️  DELETE /api/richieste - Deleting richiesta:", id)

    // Recupera info prima di eliminare
    const { data: richiesta } = await supabase
      .from("configuratorelegno_richieste")
      .select("codice_preventivo, cliente_email")
      .eq("id", id)
      .single()

    // Elimina (CASCADE eliminerà anche storico stati)
    const { error } = await supabase.from("configuratorelegno_richieste").delete().eq("id", id)

    if (error) {
      console.error("❌ Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("✅ Richiesta deleted:", richiesta?.codice_preventivo)
    console.log("⚠️  WARNING: Considera soft delete (stato='annullata') invece di eliminazione permanente")

    return NextResponse.json({ success: true, deleted_codice: richiesta?.codice_preventivo })
  } catch (error) {
    console.error("❌ DELETE /api/richieste error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
