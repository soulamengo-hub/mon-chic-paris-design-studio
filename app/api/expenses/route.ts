import { NextResponse } from "next/server";
import { supabaseRest } from "../../../lib/supabaseRest";

export const dynamic = "force-dynamic";

function payloadFrom(body: any) {
  return {
    expense_date: body.expense_date || new Date().toISOString().slice(0, 10),
    category: body.category || null,
    description: body.description || null,
    supplier: body.supplier || null,
    invoice_number: body.invoice_number || null,
    net_amount:
      body.net_amount === "" || body.net_amount === null
        ? null
        : Number(body.net_amount),
    vat_rate:
      body.vat_rate === "" || body.vat_rate === null
        ? 19
        : Number(body.vat_rate),
    gross_amount:
      body.gross_amount === "" || body.gross_amount === null
        ? null
        : Number(body.gross_amount),
    payment_method: body.payment_method || null,
    receipt_available: Boolean(body.receipt_available),
    tax_deductible: body.tax_deductible || "prüfen",
    recurring: body.recurring || "einmalig",
    notes: body.notes || null,
    updated_at: new Date().toISOString(),
  };
}

export async function GET() {
  try {
    const expenses = await supabaseRest(
      "expenses?select=*&order=expense_date.desc"
    );

    return NextResponse.json({ expenses });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Ausgaben konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const expense = await supabaseRest("expenses", {
      method: "POST",
      body: JSON.stringify(payloadFrom(body)),
    });

    return NextResponse.json({ expense });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Ausgabe konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID fehlt." }, { status: 400 });
    }

    const body = await request.json();

    const expense = await supabaseRest(`expenses?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify(payloadFrom(body)),
    });

    return NextResponse.json({ expense });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Ausgabe konnte nicht aktualisiert werden." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID fehlt." }, { status: 400 });
    }

    await supabaseRest(`expenses?id=eq.${id}`, {
      method: "DELETE",
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Ausgabe konnte nicht gelöscht werden." },
      { status: 500 }
    );
  }
}
