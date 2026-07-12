import { NextRequest, NextResponse } from "next/server";
import { getPbWithToken } from "@/lib/pocketbase";
import { RecordModel } from "pocketbase";

function getToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization") ?? "";
  return auth.startsWith("Bearer ") ? auth.slice(7) : null;
}

function toClientResponse(r: RecordModel) {
  return {
    id: r.id,
    nom: r.nom,
    telephone: r.telephone,
    email: r.email,
    adresse: r.adresse ?? undefined,
    societe: r.societe ?? undefined,
    dateCreation: r.created || new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const token = getToken(request);
  if (!token) {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
  }

  try {
    const pb = getPbWithToken(token);
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";

    const filter = search
      ? `nom ~ "${search}" || email ~ "${search}" || telephone ~ "${search}"`
      : "";

    const records = await pb.collection("clients").getFullList({
      filter,
      sort: "-id",
    });

    return NextResponse.json(records.map(toClientResponse));
  } catch (err: unknown) {
    console.error("[api/clients] GET failed:", err);
    let message = "Erreur serveur.";
    let status = 500;
    if (err && typeof err === "object") {
      const pbErr = err as { message?: string; status?: number };
      if (pbErr.status) status = pbErr.status;
      if (pbErr.message) message = pbErr.message;
    }
    return NextResponse.json({ message }, { status });
  }
}

export async function POST(request: NextRequest) {
  const token = getToken(request);
  if (!token) {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const pb = getPbWithToken(token);

    const record = await pb.collection("clients").create({
      nom: body.nom,
      telephone: body.telephone,
      email: body.email,
      adresse: body.adresse ?? "",
      societe: body.societe ?? "",
    });

    return NextResponse.json(toClientResponse(record), { status: 201 });
  } catch (err: unknown) {
    console.error("[api/clients] POST failed:", err);
    let message = "Erreur lors de la création.";
    let status = 500;
    if (err && typeof err === "object") {
      const pbErr = err as { message?: string; status?: number };
      if (pbErr.status) status = pbErr.status;
      if (pbErr.message) message = pbErr.message;
    }
    return NextResponse.json({ message }, { status });
  }
}
