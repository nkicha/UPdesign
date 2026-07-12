import { NextRequest, NextResponse } from "next/server";
import { getPocketBaseAdmin } from "@/lib/pocketbase";
import { RecordModel } from "pocketbase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json(
      { message: "Numéro de téléphone requis." },
      { status: 400 }
    );
  }

  const cleanedPhone = phone.trim();

  try {
    const pb = await getPocketBaseAdmin();

    // 1. Find client by phone number
    let client: RecordModel;
    try {
      client = await pb
        .collection("clients")
        .getFirstListItem(`telephone = "${cleanedPhone}"`);
    } catch (err: any) {
      if (err?.status === 404) {
        return NextResponse.json(
          { message: "Aucun dossier trouvé pour ce numéro de téléphone." },
          { status: 404 }
        );
      }
      throw err;
    }

    // 2. Fetch devis and commandes for this client, and full lists for sequential numbering
    const [devisList, commandesList, allDevis, allCommandes] = await Promise.all([
      pb.collection("devis").getFullList({
        filter: `client = "${client.id}"`,
        sort: "-created",
      }),
      pb.collection("commandes").getFullList({
        filter: `client = "${client.id}"`,
        sort: "-created",
      }),
      pb.collection("devis").getFullList({
        sort: "id",
        fields: "id",
      }),
      pb.collection("commandes").getFullList({
        sort: "id",
        fields: "id",
      }),
    ]);

    // Create lookup maps for sequential numbering
    const devisMap = new Map(allDevis.map((d, index) => [d.id, index + 1]));
    const commandesMap = new Map(allCommandes.map((c, index) => [c.id, index + 1]));

    const mappedDevis = devisList.map((r) => ({
      id: r.id,
      number: devisMap.get(r.id) || 1,
      clientId: r.client,
      typePanneau: r.type_panneau,
      dimensions: r.dimensions ?? undefined,
      matiere: r.matiere ?? undefined,
      prix: r.prix,
      description: r.description ?? undefined,
      statut: r.statut,
      fileUrl: r.file
        ? `${process.env.POCKETBASE_URL || "http://127.0.0.1:8090"}/api/files/devis/${r.id}/${r.file}`
        : undefined,
      dateCreation: r.created,
    }));

    const mappedCommandes = commandesList.map((r) => ({
      id: r.id,
      number: commandesMap.get(r.id) || 1,
      clientId: r.client,
      typePanneau: r.type_panneau,
      dimensions: r.dimensions ?? undefined,
      matiere: r.matiere ?? undefined,
      prix: r.prix,
      statut: r.statut,
      dateCreation: r.created,
    }));

    return NextResponse.json({
      client: {
        id: client.id,
        nom: client.nom,
        telephone: client.telephone,
        email: client.email,
        adresse: client.adresse ?? "",
        societe: client.societe ?? "",
      },
      devis: mappedDevis,
      commandes: mappedCommandes,
    });
  } catch (err: any) {
    console.error("[api/suivi] GET failed:", err);
    return NextResponse.json(
      { message: err.message || "Une erreur est survenue lors de la récupération des informations." },
      { status: 500 }
    );
  }
}
