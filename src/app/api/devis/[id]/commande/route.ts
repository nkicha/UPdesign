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
      ? `${process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090"}/api/files/devis/${r.id}/${r.file}`
      : undefined,
    dateCreation: r.created || new Date().toISOString(),
  };
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getToken(request);
  if (!token) {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
  }

  let createdCommandeId: string | null = null;

  try {
    const { id } = await params;
    const pb = getPbWithToken(token);

    const devis = await pb.collection("devis").getOne(id, { expand: "client" });

    if (devis.statut !== "VALIDE") {
      return NextResponse.json(
        { message: "Ce devis doit être validé avant de pouvoir être lancé." },
        { status: 400 }
      );
    }

    const commande = await pb.collection("commandes").create(
      {
        client: devis.client,
        type_panneau: devis.type_panneau,
        dimensions: devis.dimensions ?? "",
        matiere: devis.matiere ?? "",
        prix: Number(devis.prix) || 0,
        statut: "EN_COURS",
      },
      { expand: "client" }
    );

    createdCommandeId = commande.id;

    const updatedDevis = await pb.collection("devis").update(
      id,
      {
        statut: "EN_COURS",
      },
      { expand: "client" }
    );

    return NextResponse.json({
      devis: toDevisResponse(updatedDevis),
      commande: toCommandeResponse(commande),
    });
  } catch (err: unknown) {
    if (createdCommandeId) {
      try {
        const pb = getPbWithToken(token ?? "");
        await pb.collection("commandes").delete(createdCommandeId);
      } catch {
        // Best-effort rollback only.
      }
    }

    const message =
      err instanceof Error ? err.message : "Erreur lors de la conversion du devis.";
    return NextResponse.json({ message }, { status: 500 });
  }
}