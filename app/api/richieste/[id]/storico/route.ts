import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * GET /api/richieste/[id]/storico
 * Recupera storico completo cambiamenti stato di una richiesta
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { id } = params

    console.log(`📚 GET /api/richieste/${id}/storico - Fetching history...`)

    // Verifica che la richiesta esista
    const { data: richiesta, error: richiestaError } = await supabase
      .from("configuratorelegno_richieste")
      .select("codice_preventivo, cliente_nome, stato")
      .eq("id", id)
      .single()

    if (richiestaError || !richiesta) {
      console.error("❌ Richiesta not found:", id)
      return NextResponse.json({ error: "Richiesta non trovata" }, { status: 404 })
    }

    // Recupera storico stati
    const { data: storico, error: storicoError } = await supabase
      .from("configuratorelegno_richieste_storico_stati")
      .select("*")
      .eq("richiesta_id", id)
      .order("cambiato_at", { ascending: true })

    if (storicoError) {
      console.error("❌ Storico error:", storicoError)
      return NextResponse.json({ error: storicoError.message }, { status: 500 })
    }

    console.log(`✅ Retrieved ${storico?.length} stato changes`)
    console.log(`📋 Codice: ${richiesta.codice_preventivo}`)

    return NextResponse.json({
      richiesta: {
        id,
        codice_preventivo: richiesta.codice_preventivo,
        cliente_nome: richiesta.cliente_nome,
        stato_corrente: richiesta.stato,
      },
      storico: storico || [],
      count: storico?.length || 0,
    })
  } catch (error) {
    console.error("❌ GET /api/richieste/[id]/storico error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/richieste/[id]/storico
 * Aggiunge un'entry manuale nello storico (es: nota cambio stato)
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { id } = params
    const body = await request.json()

    console.log(`📝 POST /api/richieste/${id}/storico - Adding manual entry...`)

    // Verifica richiesta esistente
    const { data: richiesta, error: richiestaError } = await supabase
      .from("configuratorelegno_richieste")
      .select("stato")
      .eq("id", id)
      .single()

    if (richiestaError || !richiesta) {
      return NextResponse.json({ error: "Richiesta non trovata" }, { status: 404 })
    }

    // Crea entry storico manuale
    const storicoData = {
      richiesta_id: id,
      stato_precedente: body.stato_precedente || richiesta.stato,
      stato_nuovo: body.stato_nuovo || richiesta.stato,
      motivo_cambio: body.motivo_cambio || "Nota manuale aggiunta",
      note: body.note || "",
      modificato_da_nome: body.modificato_da_nome || "Sistema",
      modificato_da_tipo: body.modificato_da_tipo || "manuale",
    }

    const { data, error } = await supabase.from("configuratorelegno_richieste_storico_stati").insert([storicoData]).select().single()

    if (error) {
      console.error("❌ Insert storico error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("✅ Storico entry added successfully")

    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ POST /api/richieste/[id]/storico error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
