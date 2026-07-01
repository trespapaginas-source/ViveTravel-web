import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;
    console.log("Formulario de contacto (inactivo) recibió:", { name, email, message });
    return NextResponse.json({ success: true, message: "Mensaje recibido (formulario en modo inactivo)" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al procesar" }, { status: 500 });
  }
}
export const runtime = 'edge';