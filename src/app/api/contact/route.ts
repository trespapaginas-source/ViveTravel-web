import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { name, email, phone, subject, message, contact_method } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nombre, email y mensaje son obligatorios" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        name,
        email,
        phone: phone || "",
        subject: subject || "otro",
        message,
        contact_method: contact_method || "whatsapp",
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating contact message:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating contact message:", error);
    return NextResponse.json(
      { error: "Error al enviar el mensaje" },
      { status: 500 }
    );
  }
}export const runtime = 'edge';