import { NextRequest, NextResponse } from "next/server";
import { getPocketBaseAdmin } from "@/lib/pocketbase";
import { RecordModel } from "pocketbase";

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

/**
 * Public route — no auth required.
 * Accepts multipart/form-data with optional file upload.
 * Maps the public quote request form to a new `devis` record.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string | null;
    const phone = formData.get("phone") as string | null;
    const message = (formData.get("message") as string) ?? "";
    const serviceType = (formData.get("service-type") as string) || (formData.get("serviceType") as string) || "";
    const budget = (formData.get("budget") as string) ?? "";
    const file = formData.get("file") as File | null;

    // Log the incoming payload once for debugging
    console.log("[devis/public] POST payload:", {
      name,
      phone,
      message,
      serviceType,
      budget,
      fileName: file ? file.name : null,
    });

    if (!name || !phone) {
      return NextResponse.json(
        { message: "Nom et téléphone requis." },
        { status: 400 }
      );
    }

    if (!budget) {
      return NextResponse.json(
        { message: "Le budget (prix) est requis." },
        { status: 400 }
      );
    }

    const cleanedBudget = budget.replace(/[^0-9.]/g, "");
    const parsedPrix = parseFloat(cleanedBudget || budget);

    if (isNaN(parsedPrix)) {
      return NextResponse.json(
        { message: "Le budget (prix) doit être un nombre valide." },
        { status: 400 }
      );
    }

    // Use an admin PocketBase instance to bypass collection permissions
    console.log("[devis/public] Step 1: Getting admin PocketBase instance...");
    const pb = await getPocketBaseAdmin();
    console.log("[devis/public] Step 1 OK. Auth valid:", pb.authStore.isValid);

    // 2. Find or create a client record by telephone
    let clientId: string;
    const cleanedPhone = phone.trim();
    try {
      console.log("[devis/public] Step 2: Looking up client by telephone:", cleanedPhone);
      const existing = await pb
        .collection("clients")
        .getFirstListItem(`telephone = "${cleanedPhone}"`);
      clientId = existing.id;
      console.log("[devis/public] Step 2 OK: Found existing client:", clientId);
    } catch (clientErr: unknown) {
      const e = clientErr as { status?: number; message?: string; data?: unknown };
      if (e?.status === 404) {
        // Client doesn't exist — create one
        console.log("[devis/public] Step 3: Creating new client...");
        const clientPayload = {
          nom: name,
          email: `${cleanedPhone.replace(/[^0-9]/g, "") || "0000000000"}@updesign.ma`,
          telephone: cleanedPhone,
          adresse: "Non spécifiée",
          societe: "Non spécifiée",
        };
        console.log("[devis/public] Step 3 payload:", JSON.stringify(clientPayload));
        try {
          const newClient = await pb.collection("clients").create(clientPayload);
          clientId = newClient.id;
          console.log("[devis/public] Step 3 OK: Created client:", clientId);
        } catch (createErr: unknown) {
          const ce = createErr as { status?: number; message?: string; data?: unknown };
          console.error("[devis/public] Step 3 FAILED (clients.create):", ce.status, ce.message, ce.data);
          throw createErr;
        }
      } else {
        console.error("[devis/public] Step 2 FAILED (clients.getFirstListItem):", e?.status, e?.message, e?.data);
        throw clientErr;
      }
    }

    // 3. Build FormData payload for PocketBase (supports file upload)
    const pbForm = new FormData();
    pbForm.append("client", clientId);
    pbForm.append("type_panneau", serviceType || "Non spécifié");
    pbForm.append("dimensions", "");
    pbForm.append("matiere", "");
    pbForm.append("prix", parsedPrix.toString());
    pbForm.append("description", message);
    pbForm.append("statut", "EN_ATTENTE");
    if (file && file.size > 0) {
      pbForm.append("file", file);
    }

    console.log("[devis/public] Step 4: Creating devis record with clientId:", clientId);
    let record;
    try {
      record = await pb.collection("devis").create(pbForm, { expand: "client" });
      console.log("[devis/public] Step 4 OK: Created devis:", record.id);
    } catch (devisErr: unknown) {
      const de = devisErr as { status?: number; message?: string; data?: unknown };
      console.error("[devis/public] Step 4 FAILED (devis.create):", de.status, de.message, JSON.stringify(de.data));
      throw devisErr;
    }

    return NextResponse.json(toDevisResponse(record), { status: 201 });
  } catch (err: unknown) {
    let message = "Erreur lors de l'envoi.";
    if (err && typeof err === "object") {
      const pbErr = err as { message?: string; data?: unknown; status?: number };
      message = pbErr.message ?? message;
    } else if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
