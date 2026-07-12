/**
 * api.ts — Frontend API client
 *
 * All requests go to Next.js API Routes (/api/...).
 * The Next.js routes proxy to PocketBase server-side.
 *
 * ID types are `string` (PocketBase uses 15-char string IDs).
 */

// Default to same-origin so deployed clients use the current site automatically.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export type QuoteRequest = {
  name: string;
  email: string;
  phone?: string;
  budget?: string;
  deadline?: string;
  serviceType?: string;
  message?: string;
};

export type ClientResponse = {
  id: string;
  nom: string;
  telephone: string;
  email: string;
  adresse?: string;
  societe?: string;
  dateCreation: string;
};

export type ClientRequest = {
  nom: string;
  telephone: string;
  email: string;
  adresse?: string;
  societe?: string;
};

export type DevisResponse = {
  id: string;
  clientId: string;
  clientNom: string;
  typePanneau: string;
  dimensions?: string;
  matiere?: string;
  prix: number;
  description?: string;
  statut: "EN_ATTENTE" | "VALIDE" | "ANNULE" | "EN_COURS";
  fileUrl?: string;
  dateCreation: string;
};

export type DevisRequest = {
  clientId: string;
  typePanneau: string;
  dimensions?: string;
  matiere?: string;
  prix: number;
  description?: string;
  statut: "EN_ATTENTE" | "VALIDE" | "ANNULE" | "EN_COURS";
};

export type CommandeResponse = {
  id: string;
  clientId: string;
  clientNom: string;
  typePanneau: string;
  dimensions?: string;
  matiere?: string;
  prix: number;
  statut: "EN_ATTENTE" | "EN_COURS" | "TERMINEE";
  dateCreation: string;
};

export type CommandeRequest = {
  clientId: string;
  typePanneau: string;
  dimensions?: string;
  matiere?: string;
  prix: number;
  statut: "EN_ATTENTE" | "EN_COURS" | "TERMINEE";
};

export type DashboardData = {
  totalClients: number;
  totalDevis: number;
  totalCommandes: number;
  monthlyRevenue: number;
};

// ----------------------------------------------------
// Core API Calls
// ----------------------------------------------------

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    let errorMsg = "Une erreur est survenue.";
    try {
      const parsed = JSON.parse(text);
      if (parsed.message) errorMsg = parsed.message;
    } catch {
      if (text) errorMsg = text;
    }
    throw new Error(errorMsg);
  }

  // Return empty object for 204 No Content
  if (response.status === 204) {
    return {};
  }

  return response.json();
}

export async function login(
  username: string,
  password: string
): Promise<{ accessToken: string }> {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function submitQuoteRequest(
  formData: FormData
): Promise<DevisResponse> {
  const url = `${API_BASE_URL}/api/devis/public`;
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Impossible d'envoyer la demande de devis.");
  }

  return response.json();
}

export async function getDashboard(token: string): Promise<DashboardData> {
  return apiFetch("/api/dashboard", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getDevis(token: string): Promise<DevisResponse[]> {
  return apiFetch("/api/devis", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createDevis(
  token: string,
  request: DevisRequest
): Promise<DevisResponse> {
  return apiFetch("/api/devis", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(request),
  });
}

export async function updateDevis(
  id: string,
  token: string,
  request: DevisRequest
): Promise<DevisResponse> {
  return apiFetch(`/api/devis/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(request),
  });
}

export async function launchDevisAsCommande(
  id: string,
  token: string
): Promise<{ devis: DevisResponse; commande: CommandeResponse }> {
  return apiFetch(`/api/devis/${id}/commande`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteDevis(id: string, token: string): Promise<void> {
  return apiFetch(`/api/devis/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getClients(
  token: string,
  search?: string
): Promise<ClientResponse[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiFetch(`/api/clients${query}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createClient(
  token: string,
  request: ClientRequest
): Promise<ClientResponse> {
  return apiFetch("/api/clients", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(request),
  });
}

export async function updateClient(
  id: string,
  token: string,
  request: ClientRequest
): Promise<ClientResponse> {
  return apiFetch(`/api/clients/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(request),
  });
}

export async function deleteClient(id: string, token: string): Promise<void> {
  return apiFetch(`/api/clients/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getCommandes(
  token: string
): Promise<CommandeResponse[]> {
  return apiFetch("/api/commandes", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createCommande(
  token: string,
  request: CommandeRequest
): Promise<CommandeResponse> {
  return apiFetch("/api/commandes", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(request),
  });
}

export async function updateCommande(
  id: string,
  token: string,
  request: CommandeRequest
): Promise<CommandeResponse> {
  return apiFetch(`/api/commandes/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(request),
  });
}

export async function deleteCommande(
  id: string,
  token: string
): Promise<void> {
  return apiFetch(`/api/commandes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function downloadDevisPdf(
  id: string,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/devis/${id}/pdf`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors du téléchargement du PDF.");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  
  const contentDisposition = response.headers.get("content-disposition");
  let filename = `devis-${id}.pdf`;
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match) {
      filename = match[1];
    }
  }
  a.download = filename;
  
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}

export async function downloadCommandeBl(
  id: string,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/commandes/${id}/pdf`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors du téléchargement du BL PDF.");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  
  const contentDisposition = response.headers.get("content-disposition");
  let filename = `bl-commande-${id}.pdf`;
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match) {
      filename = match[1];
    }
  }
  a.download = filename;
  
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}

