import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * GET /api/richieste/metriche
 * Recupera metriche aggregate da view predefinita
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log("📊 GET /api/richieste/metriche - Fetching metrics...")

    // Query view metriche predefinita
    const { data: metriche, error: metricheError } = await supabase
      .from("configuratorelegno_richieste_metriche")
      .select("*")
      .single()

    if (metricheError) {
      console.error("❌ Metriche view error:", metricheError)
      return NextResponse.json({ error: metricheError.message }, { status: 500 })
    }

    // Query richieste attive
    const { data: attive, error: attiveError } = await supabase
      .from("configuratorelegno_richieste_attive")
      .select("*")
      .order("priorita", { ascending: false })
      .order("data_richiesta", { ascending: true })

    if (attiveError) {
      console.error("❌ Richieste attive error:", attiveError)
      // Non bloccare se fallisce, restituisci array vuoto
    }

    // Metriche aggiuntive custom
    const { data: perStato, error: perStatoError } = await supabase.rpc("get_count_per_stato")

    if (perStatoError) {
      console.log("⚠️  Custom metrics not available (function may not exist)")
    }

    console.log("✅ Metriche retrieved successfully")
    console.log(`📊 Totale richieste: ${metriche?.totale_richieste}`)
    console.log(`📈 Tasso conversione: ${metriche?.tasso_conversione_percentuale}%`)
    console.log(`💰 Valore totale ordini: €${metriche?.valore_totale_ordini}`)

    return NextResponse.json({
      metriche,
      richieste_attive: attive || [],
      count_per_stato: perStato || null,
    })
  } catch (error) {
    console.error("❌ GET /api/richieste/metriche error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
