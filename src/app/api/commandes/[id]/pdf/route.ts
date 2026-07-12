import { NextRequest, NextResponse } from "next/server";
import { getPbWithToken } from "@/lib/pocketbase";
import { RecordModel } from "pocketbase";
import { generateBlPdf, PdfRecord } from "@/lib/pdf-generator";

function getToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization") ?? "";
  return auth.startsWith("Bearer ") ? auth.slice(7) : null;
}

export async function GET(
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
    const record = await pb.collection("commandes").getOne(id, {
      expand: "client",
    });

    const client = record.expand?.client as RecordModel | undefined;

    // Calculate sequential number by sorting all commandes by ID
    const allRecords = await pb.collection("commandes").getFullList({
      sort: "id",
      fields: "id",
    });
    const recordIndex = allRecords.findIndex((r) => r.id === id);
    const commandeNumber = recordIndex !== -1 ? recordIndex + 1 : 1;

    const pdfData: PdfRecord = {
      id: record.id,
      devisNumber: commandeNumber,
      clientNom: client?.nom ?? "Client Inconnu",
      clientEmail: client?.email,
      clientTelephone: client?.telephone,
      clientSociete: client?.societe,
      clientAdresse: client?.adresse,
      typePanneau: record.type_panneau,
      dimensions: record.dimensions,
      matiere: record.matiere,
      prix: record.prix,
      dateCreation: record.created || new Date().toISOString(),
      statut: record.statut,
    };

    const pdfBuffer = await generateBlPdf(pdfData, true);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="bl-commande-${commandeNumber}.pdf"`,
      },
    });
  } catch (err: unknown) {
    console.error("[api/commandes/pdf] Error generating PDF:", err);
    let message = "Erreur lors de la génération du PDF.";
    let status = 500;
    if (err && typeof err === "object") {
      const pbErr = err as { message?: string; status?: number };
      if (pbErr.status) status = pbErr.status;
      if (pbErr.message) message = pbErr.message;
    }
    return NextResponse.json({ message }, { status });
  }
}
