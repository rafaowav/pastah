import { NextResponse } from "next/server";

/**
 * Endpoint de Webhooks
 * Rota: /api/webhooks
 * 
 * Responsabilidade: Processar eventos assíncronos externos (ex: gateway de pagamento Stripe, assinaturas).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ received: true, payload: body });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
