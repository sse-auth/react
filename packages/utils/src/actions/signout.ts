import type { Cookie } from "@sse-auth/types/utils";
import type { Adapter } from "@sse-auth/types/adapter";
import type { SessionStore } from "../cookie";

// Types
type SessionStrategy = "jwt" | "database";

export async function signOut(
  cookies: Cookie[],
  sessionStore: SessionStore,
  strategy: SessionStrategy,
  redirect: string
): Promise<{ redirect: string; cookies: Cookie[] }> {
  const sessionToken = sessionStore.value;
  let adapter: Adapter;
  if (!sessionToken) return { redirect, cookies };

  try {
    if (strategy === "jwt") {
      // const salts =
    } else if (strategy === "database") {
      const session = await adapter?.deleteSession(sessionToken);
    }
  } catch (err) {
    console.error(err);
  }

  cookies.push(...sessionStore.clean());
  return { redirect, cookies };
}
