import { NextRequest, NextResponse } from "next/server";
import { getPocketBase } from "@/lib/pocketbase";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Nom d'utilisateur et mot de passe requis." },
        { status: 400 }
      );
    }

    const pb = getPocketBase();

    // Authenticate against the `users` collection (email or username).
    const authData = await pb
      .collection("users")
      .authWithPassword(username, password);
    const token = authData.token;

    return NextResponse.json({ accessToken: token });
  } catch (err: unknown) {
    const pbErr = err as { status?: number };
    const status = pbErr?.status ?? 401;
    return NextResponse.json(
      { message: "Identifiants invalides." },
      { status }
    );
  }
}
