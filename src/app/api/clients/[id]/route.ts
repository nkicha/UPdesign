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

    const record = await pb.collection("clients").update(id, {
      nom: body.nom,
      telephone: body.telephone,
      email: body.email,
      adresse: body.adresse ?? "",
      societe: body.societe ?? "",
    });

    return NextResponse.json(toClientResponse(record));
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
    await pb.collection("clients").delete(id);
    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Erreur lors de la suppression.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
