package com.ultrapub.utils;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.ultrapub.entity.Devis;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Component
public class PdfGeneratorUtil {

    public byte[] generateDevisPdf(Devis devis) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);
            document.open();
            document.add(new Paragraph("Devis #" + devis.getId()));
            document.add(new Paragraph("Client : " + devis.getClient().getNom()));
            document.add(new Paragraph("Type de panneau : " + devis.getTypePanneau()));
            document.add(new Paragraph("Dimensions : " + (devis.getDimensions() == null ? "-" : devis.getDimensions())));
            document.add(new Paragraph("Matière : " + (devis.getMatiere() == null ? "-" : devis.getMatiere())));
            document.add(new Paragraph("Prix : " + devis.getPrix()));
            document.add(new Paragraph("Statut : " + devis.getStatut()));
            document.add(new Paragraph("Description : " + (devis.getDescription() == null ? "-" : devis.getDescription())));
            document.close();
            return outputStream.toByteArray();
        } catch (DocumentException | IOException ex) {
            throw new RuntimeException("Impossible de générer le PDF du devis", ex);
        }
    }
}
