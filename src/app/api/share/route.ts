import { NextResponse } from "next/server";

/**
 * Endpoint de Compartilhamento / Visualização Pública
 * Rota: /api/share
 * 
 * Responsabilidade: Fornecer dados e acesso público controlado a documentos via token de compartilhamento.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token de compartilhamento ausente" }, { status: 400 });
  }

  return NextResponse.json({
    status: "ok",
    message: "Endpoint de compartilhamento de documentos",
    token,
  });
}
