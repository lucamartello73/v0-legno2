import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("configuratorelegno_homepage_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({
        hero_title: "Configuratore Pergole MARTELLO 1930",
        hero_subtitle:
          "Dal 1930 - Tradizione Italiana\nProgetta la tua pergola ideale con il nostro configuratore avanzato",
        hero_image_url: "",
        dimensions_addossata_image: "",
        dimensions_libera_image: "",
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data: existing } = await supabase
      .from("configuratorelegno_homepage_settings")
      .select("id")
      .limit(1)
      .maybeSingle()

    let result
    if (existing) {
      const { data, error } = await supabase
        .from("configuratorelegno_homepage_settings")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      result = data
    } else {
      const { data, error } = await supabase
        .from("configuratorelegno_homepage_settings")
        .insert([body])
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      result = data
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
