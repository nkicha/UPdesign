import PocketBase from "pocketbase";

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;

/**
 * Server-side PocketBase singleton.
 * Do NOT import this in Client Components.
 */
export function getPocketBase(): PocketBase {
  return new PocketBase(PB_URL);
}

/**
 * Server-side admin PocketBase instance.
 * Authenticates with superuser credentials for a fresh session.
 * Falls back to a static token if credentials are not set.
 */
export async function getPocketBaseAdmin(): Promise<PocketBase> {
  const pb = getPocketBase();
  const email = process.env.POCKETBASE_SUPERUSER_EMAIL;
  const password = process.env.POCKETBASE_SUPERUSER_PASSWORD;

  if (email && password) {
    await pb.collection("_superusers").authWithPassword(email, password);
  } else {
    const token = process.env.POCKETBASE_SUPERUSER_TOKEN || process.env.POCKETBASE_TOKEN;
    if (token) {
      pb.authStore.save(token, null);
    }
  }

  return pb;
}

/**
 * Authenticate as a regular user (users collection) and return the store.
 */
export async function pbAuthWithPassword(
  email: string,
  password: string
): Promise<{ token: string; record: { id: string; email: string } }> {
  const pb = getPocketBase();
  const authData = await pb.collection("users").authWithPassword(email, password);
  return {
    token: authData.token,
    record: { id: authData.record.id, email: authData.record.email as string },
  };
}

/**
 * Returns a PocketBase client pre-loaded with the given token.
 */
export function getPbWithToken(token: string): PocketBase {
  const pb = getPocketBase();
  pb.authStore.save(token, null);
  return pb;
}
