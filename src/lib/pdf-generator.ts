import { jsPDF } from "jspdf";

export interface PdfRecord {
  id: string;
  devisNumber?: number;
  clientNom: string;
  clientEmail?: string;
  clientTelephone?: string;
  clientSociete?: string;
  clientAdresse?: string;
  typePanneau: string;
  dimensions?: string;
  matiere?: string;
  prix: number;
  description?: string;
  dateCreation: string;
  statut?: string;
}

function formatPrix(val: number): string {
  const rounded = Math.round(val * 100) / 100;
  const isInteger = rounded % 1 === 0;
  const numString = isInteger ? rounded.toFixed(0) : rounded.toFixed(2);
  const parts = numString.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".") + " DH";
}

export function generateDevisPdf(record: PdfRecord): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4"
  });

  // Header / Branding (Red color: #E61A3D)
  doc.setFillColor(230, 26, 61); // #E61A3D
  doc.rect(50, 45, 50, 25, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("UP", 62, 63);

  doc.setTextColor(44, 38, 39); // #2C2627
  doc.setFontSize(14);
  doc.text("ULTRAPUB DESIGN", 110, 58);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(113, 128, 150); // #718096
  doc.text("Conception, Fabrication & Installation d'Enseignes Lumineuses", 110, 72);

  // Devis Title block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(230, 26, 61); // #E61A3D
  doc.text("DEVIS", 545, 58, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(74, 85, 104); // #4A5568
  doc.text(`Numéro: DEVIS #${record.devisNumber !== undefined ? record.devisNumber : record.id}`, 545, 75, { align: "right" });
  doc.text(`Date: ${new Date(record.dateCreation).toLocaleDateString("fr-FR")}`, 545, 90, { align: "right" });

  // Horizontal line
  doc.setDrawColor(226, 232, 240); // #E2E8F0
  doc.setLineWidth(1);
  doc.line(50, 110, 545, 110);

  // Address blocks
  const yStart = 130;

  // UPdesign (Sender)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(44, 38, 39); // #2C2627
  doc.text("Émetteur:", 50, yStart);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(26, 32, 44); // #1A202C
  doc.text("Ultrapub Design Éclat", 50, yStart + 15);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(74, 85, 104); // #4A5568
  doc.text("Casablanca, Maroc", 50, yStart + 30);
  doc.text("Téléphone: +212 (0) 522 34 56 78", 50, yStart + 45);
  doc.text("Email: contact@ultrapubdesign.ma", 50, yStart + 60);

  // Client (Receiver)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(44, 38, 39); // #2C2627
  doc.text("Destinataire:", 300, yStart);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(26, 32, 44); // #1A202C
  doc.text(record.clientNom, 300, yStart + 15);

  let receiverOffset = 15;
  if (record.clientSociete && record.clientSociete !== "Non spécifiée") {
    doc.setFont("helvetica", "italic");
    doc.text(record.clientSociete, 300, yStart + 30);
    receiverOffset = 30;
  }

  doc.setFont("helvetica", "normal");
  doc.setTextColor(74, 85, 104); // #4A5568
  doc.text(`Email: ${record.clientEmail || "Non spécifié"}`, 300, yStart + receiverOffset + 15);
  doc.text(`Téléphone: ${record.clientTelephone || "Non spécifié"}`, 300, yStart + receiverOffset + 30);
  doc.text(`Adresse: ${record.clientAdresse || "Non spécifiée"}`, 300, yStart + receiverOffset + 45, { maxWidth: 245 });

  // Table Grid
  const tableY = 250;
  doc.setFillColor(44, 38, 39); // #2C2627
  doc.rect(50, tableY, 495, 20, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("Description du Projet", 60, tableY + 13);
  doc.text("Spécifications Techniques", 250, tableY + 13);
  doc.text("Montant (DH)", 535, tableY + 13, { align: "right" });

  // Rows content background and border
  const rowY = tableY + 20;
  doc.setFillColor(247, 250, 252); // #F7FAFC
  doc.rect(50, rowY, 495, 100, "F");
  
  doc.setDrawColor(226, 232, 240); // #E2E8F0
  doc.rect(50, rowY, 495, 100, "S");

  // Columns content
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(26, 32, 44); // #1A202C
  doc.text(`Projet: ${record.typePanneau}`, 60, rowY + 20);

  if (record.description) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(74, 85, 104); // #4A5568
    doc.text(record.description, 60, rowY + 38, { maxWidth: 170 });
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(45, 55, 72); // #2D3748
  doc.text(`Dimensions: ${record.dimensions || "Non spécifiées"}`, 250, rowY + 20);
  doc.text(`Matières: ${record.matiere || "Non spécifiée"}`, 250, rowY + 38);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(230, 26, 61); // #E61A3D
  doc.text(formatPrix(record.prix), 535, rowY + 20, { align: "right" });

  // Summary box
  const summaryY = rowY + 120;
  doc.setDrawColor(226, 232, 240); // #E2E8F0
  doc.line(350, summaryY, 545, summaryY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(74, 85, 104); // #4A5568
  doc.text("Total HT:", 350, summaryY + 15);
  doc.text("TVA (20%):", 350, summaryY + 30);
  doc.setFontSize(11);
  doc.setTextColor(26, 32, 44); // #1A202C
  doc.text("Total TTC:", 350, summaryY + 50);

  const tva = record.prix * 0.2;
  const ttc = record.prix * 1.2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(74, 85, 104);
  doc.text(formatPrix(record.prix), 545, summaryY + 15, { align: "right" });
  doc.text(formatPrix(tva), 545, summaryY + 30, { align: "right" });
  doc.setFontSize(11);
  doc.setTextColor(230, 26, 61); // #E61A3D
  doc.text(formatPrix(ttc), 545, summaryY + 50, { align: "right" });

  // Signature Block
  const sigY = summaryY + 90;
  doc.setDrawColor(226, 232, 240);
  doc.line(50, sigY, 545, sigY);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(113, 128, 150); // #718096
  doc.text("Ce devis est valable pour une durée de 30 jours à compter de sa date d'émission.", 50, sigY + 15);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(44, 38, 39); // #2C2627
  doc.text("Bon pour accord (Signature et Cachet du client)", 350, sigY + 35);

  const arrayBuffer = doc.output("arraybuffer");
  return Promise.resolve(Buffer.from(arrayBuffer));
}

export function generateBlPdf(record: PdfRecord, isCommande: boolean = false): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4"
  });

  // Header / Branding
  doc.setFillColor(230, 26, 61); // #E61A3D
  doc.rect(50, 45, 50, 25, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("UP", 62, 63);

  doc.setTextColor(44, 38, 39); // #2C2627
  doc.setFontSize(14);
  doc.text("ULTRAPUB DESIGN", 110, 58);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(113, 128, 150); // #718096
  doc.text("Conception, Fabrication & Installation d'Enseignes Lumineuses", 110, 72);

  // Document Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(44, 38, 39); // #2C2627
  doc.text("BON DE LIVRAISON", 545, 58, { align: "right" });

  const prefix = isCommande ? "CMD" : "DEV";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(74, 85, 104); // #4A5568
  doc.text(`Référence: BL-${prefix} #${record.devisNumber !== undefined ? record.devisNumber : record.id}`, 545, 75, { align: "right" });
  doc.text(`Date de livraison: ${new Date().toLocaleDateString("fr-FR")}`, 545, 90, { align: "right" });

  // Horizontal line
  doc.setDrawColor(226, 232, 240); // #E2E8F0
  doc.setLineWidth(1);
  doc.line(50, 110, 545, 110);

  // Address blocks
  const yStart = 130;

  // Sender
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(44, 38, 39); // #2C2627
  doc.text("Lieu de Départ:", 50, yStart);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(26, 32, 44); // #1A202C
  doc.text("Atelier Ultrapub Design", 50, yStart + 15);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(74, 85, 104); // #4A5568
  doc.text("Casablanca, Maroc", 50, yStart + 30);
  doc.text("Téléphone: +212 (0) 522 34 56 78", 50, yStart + 45);

  // Receiver
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(44, 38, 39); // #2C2627
  doc.text("Lieu de Livraison / Client:", 300, yStart);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(26, 32, 44); // #1A202C
  doc.text(record.clientNom, 300, yStart + 15);

  let receiverOffset = 15;
  if (record.clientSociete && record.clientSociete !== "Non spécifiée") {
    doc.setFont("helvetica", "italic");
    doc.text(record.clientSociete, 300, yStart + 30);
    receiverOffset = 30;
  }

  doc.setFont("helvetica", "normal");
  doc.setTextColor(74, 85, 104); // #4A5568
  doc.text(`Email: ${record.clientEmail || "Non spécifié"}`, 300, yStart + receiverOffset + 15);
  doc.text(`Téléphone: ${record.clientTelephone || "Non spécifié"}`, 300, yStart + receiverOffset + 30);
  doc.text(`Adresse de livraison: ${record.clientAdresse || "Non spécifiée"}`, 300, yStart + receiverOffset + 45, { maxWidth: 245 });

  // Table Grid
  const tableY = 250;
  doc.setFillColor(44, 38, 39); // #2C2627
  doc.rect(50, tableY, 495, 20, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("Article / Description", 60, tableY + 13);
  doc.text("Spécifications Techniques", 250, tableY + 13);
  doc.text("Quantité", 535, tableY + 13, { align: "right" });

  // Rows content background and border
  const rowY = tableY + 20;
  doc.setFillColor(247, 250, 252); // #F7FAFC
  doc.rect(50, rowY, 495, 100, "F");
  
  doc.setDrawColor(226, 232, 240); // #E2E8F0
  doc.rect(50, rowY, 495, 100, "S");

  // Columns content
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(26, 32, 44); // #1A202C
  doc.text(`Enseigne: ${record.typePanneau}`, 60, rowY + 20);

  if (record.description) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(74, 85, 104); // #4A5568
    doc.text(record.description, 60, rowY + 38, { maxWidth: 170 });
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(45, 55, 72); // #2D3748
  doc.text(`Dimensions: ${record.dimensions || "Non spécifiées"}`, 250, rowY + 20);
  doc.text(`Matières: ${record.matiere || "Non spécifiée"}`, 250, rowY + 38);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(26, 32, 44);
  doc.text("1", 535, rowY + 20, { align: "right" });

  // Signature Block
  const sigY = rowY + 140;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(44, 38, 39); // #2C2627
  doc.text("Livreur (Nom & Signature)", 50, sigY);
  doc.text("Client - Reçu conforme (Date, Nom & Signature)", 300, sigY);

  doc.setDrawColor(203, 213, 224); // #CBD5E0
  doc.rect(50, sigY + 10, 200, 60, "S");
  doc.rect(300, sigY + 10, 245, 60, "S");

  const arrayBuffer = doc.output("arraybuffer");
  return Promise.resolve(Buffer.from(arrayBuffer));
}
