import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("configuratorelegno_configurations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Prepare data for database insertion
    const configData = {
      type_name: body.type_name,
      width: body.width,
      depth: body.depth,
      height: body.height,
      color_category: body.color_category,
      color_name: body.color_name,
      coverage_name: body.coverage_name,
      flooring_names: body.flooring_names || [],
      accessory_names: body.accessory_names || [],
      service_type: body.service_type,
      contact_preference: body.contact_preference,
      contact_data: body.contact_data,
      total_price: body.total_price || 0,
    }

    const { data, error } = await supabase
      .from("configuratorelegno_configurations")
      .insert([configData])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    console.log("[v0] DELETE request received for ID:", id)

    if (!id) {
      console.log("[v0] No ID provided in DELETE request")
      return NextResponse.json({ error: "ID configurazione richiesto" }, { status: 400 })
    }

    console.log("[v0] Attempting to delete configuration from database...")
    const { error } = await supabase.from("configuratorelegno_configurations").delete().eq("id", id)

    if (error) {
      console.error("[v0] Database delete error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Configuration deleted successfully from database")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] DELETE route error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
