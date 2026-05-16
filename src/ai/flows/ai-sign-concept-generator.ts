'use server';
/**
 * @fileOverview Ce fichier contient un Genkit Flow pour générer des idées de concepts d'enseignes et des suggestions de matériaux basées sur les détails de l'entreprise et les préférences stylistiques du client.
 *
 * - generateAiSignConcept - La fonction wrapper exportée pour invoquer le flow de génération de concept d'enseigne.
 * - AiSignConceptGeneratorInput - Le type d'entrée pour la fonction generateAiSignConcept.
 * - AiSignConceptGeneratorOutput - Le type de retour pour la fonction generateAiSignConcept.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Schéma Zod pour la validation de l'entrée du flow de génération de concept d'enseigne.
 */
const AiSignConceptGeneratorInputSchema = z.object({
  businessName: z.string().describe("Le nom de l'entreprise."),
  businessType: z.string().describe("Le type d'entreprise (ex: restaurant, boutique, salon de coiffure)."),
  targetAudience: z.string().describe("Le public cible de l'enseigne."),
  stylisticPreferences: z.string().describe("Les préférences stylistiques de l'utilisateur (ex: moderne, vintage, industriel, élégant, minimaliste)."),
  keyMessage: z.string().describe("Le message clé que l'enseigne doit transmettre."),
  budgetPreference: z.string().describe("Préférence budgétaire (ex: faible, moyen, élevé)."),
  locationType: z.string().describe("Type d'emplacement de l'enseigne (ex: intérieur, extérieur, devanture de magasin)."),
  existingLogoDescription: z.string().optional().describe("Description du logo existant, si applicable."),
});
/**
 * Type TypeScript pour l'entrée du flow de génération de concept d'enseigne.
 */
export type AiSignConceptGeneratorInput = z.infer<typeof AiSignConceptGeneratorInputSchema>;

/**
 * Schéma Zod pour la validation de la sortie du flow de génération de concept d'enseigne.
 */
const AiSignConceptGeneratorOutputSchema = z.object({
  conceptName: z.string().describe("Un nom créatif pour le concept d'enseigne généré."),
  description: z.string().describe("Une description détaillée du concept d'enseigne proposé, incluant sa forme, sa taille approximative, et son ambiance générale."),
  styleKeywords: z.array(z.string()).describe("Une liste de mots-clés décrivant le style recommandé pour l'enseigne."),
  materialSuggestions: z.array(z.object({
    material: z.string().describe("Nom du matériau (ex: aluminium, acier inoxydable, acrylique, bois)."),
    properties: z.string().describe("Propriétés et avantages du matériau suggéré (ex: durabilité, aspect, coût, résistance aux intempéries)."),
  })).describe("Suggestions de matériaux adaptés avec leurs propriétés."),
  visualElementsSuggestions: z.object({
    colors: z.string().describe("Suggestions de palette de couleurs avec des codes hexadécimaux si possible."),
    typography: z.string().describe("Recommandations typographiques (ex: polices sans-serif modernes, polices script vintage)."),
    imagery: z.string().describe("Idées d'imagerie ou de graphiques à intégrer dans le design."),
  }).describe("Idées pour les éléments visuels de l'enseigne."),
  lightingSuggestions: z.array(z.object({
    type: z.string().describe("Type d'éclairage (ex: néon, halo lumineux, rétroéclairé, face illuminée, non éclairé)."),
    effect: z.string().describe("Effet et ambiance créés par cet éclairage."),
  })).describe("Recommandations d'éclairage pour maximiser l'impact visuel."),
  justification: z.string().describe("Une explication détaillée de la manière dont ce concept répond aux besoins de l'entreprise et aux préférences stylistiques, en tenant compte du budget et de l'emplacement."),
});
/**
 * Type TypeScript pour le retour du flow de génération de concept d'enseigne.
 */
export type AiSignConceptGeneratorOutput = z.infer<typeof AiSignConceptGeneratorOutputSchema>;

/**
 * Définit le prompt Genkit pour la génération de concepts d'enseignes.
 * Le prompt agit comme un expert en conception d'enseignes pour Ultrapub Design.
 */
const aiSignConceptGeneratorPrompt = ai.definePrompt({
  name: 'aiSignConceptGeneratorPrompt',
  input: { schema: AiSignConceptGeneratorInputSchema },
  output: { schema: AiSignConceptGeneratorOutputSchema },
  prompt: `En tant qu'expert en conception d'enseignes pour Ultrapub Design, votre rôle est de générer des idées de concepts d'enseignes distinctives et des suggestions de matériaux adaptés pour les clients. Vous devez être créatif, innovant et pratique, en tenant compte de tous les détails fournis par le client.

Voici les informations sur l'entreprise du client et ses préférences :

Nom de l'entreprise : {{{businessName}}}
Type d'entreprise : {{{businessType}}}
Public cible : {{{targetAudience}}}
Préférences stylistiques : {{{stylisticPreferences}}}
Message clé à transmettre : {{{keyMessage}}}
Préférence budgétaire : {{{budgetPreference}}}
Type d'emplacement de l'enseigne : {{{locationType}}}
Description du logo existant (si applicable) : {{{existingLogoDescription}}}

En vous basant sur ces informations, proposez un concept d'enseigne complet qui inclut les éléments suivants :

1.  **conceptName** : Un nom accrocheur et pertinent pour ce concept.
2.  **description** : Une description détaillée du concept d'enseigne proposé, incluant la forme générale, la taille suggérée, la composition, et l'ambiance qu'elle dégage. Soyez précis et visuel.
3.  **styleKeywords** : Une liste de mots-clés qui encapsulent le style de l'enseigne.
4.  **materialSuggestions** : Des suggestions de 2-3 matériaux principaux, en expliquant pourquoi ils sont adaptés (esthétique, durabilité, coût, résistance aux éléments pour l'extérieur).
5.  **visualElementsSuggestions** : Des recommandations pour les couleurs (avec des codes hexadécimaux si possible, liés à l'identité d'Ultrapub Design et à l'entreprise du client), la typographie (ex: polices modernes, classiques, audacieuses) et d'éventuels éléments graphiques ou iconographiques. Tenez compte de la description du logo existant si fournie.
6.  **lightingSuggestions** : Des options d'éclairage (néon, halo lumineux, lettres découpées illuminées en façade, rétroéclairage, non éclairé) et l'effet qu'elles produiraient.
7.  **justification** : Une explication convaincante de la manière dont ce concept répond aux objectifs du client, à ses préférences et contraintes (budget, emplacement).

Assurez-vous que la réponse est en français et qu'elle est créative, professionnelle et inspirante pour un client cherchant une enseigne distinctive.`
});

/**
 * Définit le Genkit Flow principal pour la génération de concept d'enseigne.
 * Ce flow utilise le prompt défini pour transformer l'entrée client en un concept d'enseigne détaillé.
 */
const aiSignConceptGeneratorFlow = ai.defineFlow(
  {
    name: 'aiSignConceptGeneratorFlow',
    inputSchema: AiSignConceptGeneratorInputSchema,
    outputSchema: AiSignConceptGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await aiSignConceptGeneratorPrompt(input);
    return output!;
  }
);

/**
 * Fonction wrapper exportée pour appeler le flow Genkit `aiSignConceptGeneratorFlow`.
 * Elle prend en entrée les détails de l'entreprise et les préférences stylistiques
 * et retourne un concept d'enseigne généré par l'IA avec des suggestions de matériaux.
 *
 * @param input Les détails et préférences pour la génération du concept d'enseigne.
 * @returns Une promesse résolue avec le concept d'enseigne généré.
 */
export async function generateAiSignConcept(input: AiSignConceptGeneratorInput): Promise<AiSignConceptGeneratorOutput> {
  return aiSignConceptGeneratorFlow(input);
}
