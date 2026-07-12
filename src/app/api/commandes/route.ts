import { NextRequest, NextResponse } from "next/server";
import { getPbWithToken } from "@/lib/pocketbase";
import { RecordModel } from "pocketbase";

function getToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization") ?? "";
  return auth.startsWith("Bearer ") ? auth.slice(7) : null;
}

function toCommandeResponse(r: RecordModel) {
  return {
    id: r.id,
    clientId: r.client,
    clientNom: (r.expand?.client as RecordModel)?.nom ?? "",
    typePanneau: r.type_panneau,
    dimensions: r.dimensions ?? undefined,
    matiere: r.matiere ?? undefined,
    prix: r.prix,
    statut: r.statut,
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
    const records = await pb.collection("commandes").getFullList({
      sort: "-id",
      expand: "client",
    });
    return NextResponse.json(records.map(toCommandeResponse));
  } catch (err: unknown) {
    console.error("[api/commandes] GET failed:", err);
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

    const record = await pb.collection("commandes").create(
      {
        client: body.clientId,
        type_panneau: body.typePanneau,
        dimensions: body.dimensions ?? "",
        matiere: body.matiere ?? "",
        prix: Number(body.prix) || 0,
        statut: body.statut,
      },
      { expand: "client" }
    );

    return NextResponse.json(toCommandeResponse(record), { status: 201 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Erreur lors de la création.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
