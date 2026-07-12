import { NextRequest, NextResponse } from "next/server";
import { getPbWithToken } from "@/lib/pocketbase";

function getToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization") ?? "";
  return auth.startsWith("Bearer ") ? auth.slice(7) : null;
}

export async function GET(request: NextRequest) {
  const token = getToken(request);
  if (!token) {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
  }

  try {
    const pb = getPbWithToken(token);

    const [clients, devis, commandes] = await Promise.all([
      pb.collection("clients").getList(1, 1, { fields: "id" }),
      pb.collection("devis").getList(1, 1, { fields: "id" }),
      pb.collection("commandes").getFullList({ fields: "prix" }),
    ]);

    // Calculate monthly revenue from all active/production commandes
    const monthlyRevenue = commandes.reduce(
      (sum, c) => sum + ((c.prix as number) ?? 0),
      0
    );

    return NextResponse.json({
      totalClients: clients.totalItems,
      totalDevis: devis.totalItems,
      totalCommandes: commandes.length,
      monthlyRevenue,
    });
  } catch (err: unknown) {
    console.error("[api/dashboard] GET failed:", err);
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
