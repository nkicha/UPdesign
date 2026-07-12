import { NextRequest, NextResponse } from "next/server";
import { getPbWithToken } from "@/lib/pocketbase";
import { RecordModel } from "pocketbase";

function getToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization") ?? "";
  return auth.startsWith("Bearer ") ? auth.slice(7) : null;
}

function toDevisResponse(r: RecordModel) {
  return {
    id: r.id,
    clientId: r.client,
    // When expanded, PocketBase puts the related record in r.expand?.client
    clientNom: (r.expand?.client as RecordModel)?.nom ?? "",
    typePanneau: r.type_panneau,
    dimensions: r.dimensions ?? undefined,
    matiere: r.matiere ?? undefined,
    prix: r.prix,
    description: r.description ?? undefined,
    statut: r.statut,
    fileUrl: r.file
      ? `${process.env.POCKETBASE_URL || "http://127.0.0.1:8090"}/api/files/devis/${r.id}/${r.file}`
      : undefined,
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
    const records = await pb.collection("devis").getFullList({
      sort: "-id",
      expand: "client",
    });
    return NextResponse.json(records.map(toDevisResponse));
  } catch (err: unknown) {
    console.error("[api/devis] GET failed:", err);
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

    const record = await pb.collection("devis").create(
      {
        client: body.clientId,
        type_panneau: body.typePanneau,
        dimensions: body.dimensions ?? "",
        matiere: body.matiere ?? "",
        prix: Number(body.prix) || 0,
        description: body.description ?? "",
        statut: body.statut,
      },
      { expand: "client" }
    );

    return NextResponse.json(toDevisResponse(record), { status: 201 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Erreur lors de la création.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
