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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getToken(request);
  if (!token) {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const pb = getPbWithToken(token);

    const record = await pb.collection("devis").update(
      id,
      {
        client: body.clientId,
        type_panneau: body.typePanneau,
        dimensions: body.dimensions ?? "",
        matiere: body.matiere ?? "",
        prix: body.prix,
        description: body.description ?? "",
        statut: body.statut,
      },
      { expand: "client" }
    );

    return NextResponse.json(toDevisResponse(record));
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Erreur lors de la mise à jour.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getToken(request);
  if (!token) {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const pb = getPbWithToken(token);
    await pb.collection("devis").delete(id);
    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Erreur lors de la suppression.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
