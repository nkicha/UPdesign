import { NextRequest, NextResponse } from "next/server";
import { getPocketBaseAdmin } from "@/lib/pocketbase";
import { RecordModel } from "pocketbase";
import { generateDevisPdf, generateBlPdf, PdfRecord } from "@/lib/pdf-generator";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");
  const id = searchParams.get("id");
  const type = searchParams.get("type") || "devis"; // 'devis' | 'devis-bl' | 'commande'

  if (!phone || !id) {
    return NextResponse.json(
      { message: "Paramètres requis: phone et id." },
      { status: 400 }
    );
  }

  const cleanedPhone = phone.trim();

  try {
    const pb = await getPocketBaseAdmin();

    // 1. Verify client exists with this phone number
    let client: RecordModel;
    try {
      client = await pb
        .collection("clients")
        .getFirstListItem(`telephone = "${cleanedPhone}"`);
    } catch (err: any) {
      if (err?.status === 404) {
        return NextResponse.json(
          { message: "Numéro de téléphone non reconnu." },
          { status: 404 }
        );
      }
      throw err;
    }

    let pdfBuffer: Buffer;
    let filename: string;

    if (type === "devis" || type === "devis-bl") {
      // 2. Fetch the devis record
      let record: RecordModel;
      try {
        record = await pb.collection("devis").getOne(id);
      } catch (err: any) {
        if (err?.status === 404) {
          return NextResponse.json(
            { message: "Devis introuvable." },
            { status: 404 }
          );
        }
        throw err;
      }

      // Check if it belongs to the client
      if (record.client !== client.id) {
        return NextResponse.json(
          { message: "Accès refusé." },
          { status: 403 }
        );
      }

      // Calculate sequential index number
      const allRecords = await pb.collection("devis").getFullList({
        sort: "id",
        fields: "id",
      });
      const recordIndex = allRecords.findIndex((r) => r.id === id);
      const devisNumber = recordIndex !== -1 ? recordIndex + 1 : 1;

      const pdfData: PdfRecord = {
        id: record.id,
        devisNumber,
        clientNom: client.nom,
        clientEmail: client.email,
        clientTelephone: client.telephone,
        clientSociete: client.societe,
        clientAdresse: client.adresse,
        typePanneau: record.type_panneau,
        dimensions: record.dimensions,
        matiere: record.matiere,
        prix: record.prix,
        description: record.description,
        dateCreation: record.created || new Date().toISOString(),
        statut: record.statut,
      };

      if (type === "devis-bl") {
        pdfBuffer = await generateBlPdf(pdfData, false);
        filename = `bl-devis-${devisNumber}.pdf`;
      } else {
        pdfBuffer = await generateDevisPdf(pdfData);
        filename = `devis-${devisNumber}.pdf`;
      }
    } else if (type === "commande") {
      // Fetch the commande record
      let record: RecordModel;
      try {
        record = await pb.collection("commandes").getOne(id);
      } catch (err: any) {
        if (err?.status === 404) {
          return NextResponse.json(
            { message: "Commande introuvable." },
            { status: 404 }
          );
        }
        throw err;
      }

      // Check if it belongs to the client
      if (record.client !== client.id) {
        return NextResponse.json(
          { message: "Accès refusé." },
          { status: 403 }
        );
      }

      // Calculate sequential index number
      const allRecords = await pb.collection("commandes").getFullList({
        sort: "id",
        fields: "id",
      });
      const recordIndex = allRecords.findIndex((r) => r.id === id);
      const commandeNumber = recordIndex !== -1 ? recordIndex + 1 : 1;

      const pdfData: PdfRecord = {
        id: record.id,
        devisNumber: commandeNumber,
        clientNom: client.nom,
        clientEmail: client.email,
        clientTelephone: client.telephone,
        clientSociete: client.societe,
        clientAdresse: client.adresse,
        typePanneau: record.type_panneau,
        dimensions: record.dimensions,
        matiere: record.matiere,
        prix: record.prix,
        dateCreation: record.created || new Date().toISOString(),
        statut: record.statut,
      };

      pdfBuffer = await generateBlPdf(pdfData, true);
      filename = `bl-commande-${commandeNumber}.pdf`;
    } else {
      return NextResponse.json(
        { message: "Type de document invalide." },
        { status: 400 }
      );
    }

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    console.error("[api/suivi/pdf] Error generating PDF:", err);
    return NextResponse.json(
      { message: "Erreur lors de la génération du document PDF." },
      { status: 500 }
    );
  }
}
