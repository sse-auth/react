import { InternalOptions } from "../types";
import { ResponseInternal } from "@sse-auth/types";
import type { Cookie } from "@sse-auth/types/utils";
import { SessionStore } from "@sse-auth/utils/dist";

/**
 * Destroys the session.
 * If the session strategy is database,
 * The session is also deleted from the database.
 * In any case, the session cookie is cleared and
 * {@link AuthConfig["events"].signOut} is emitted.
 */
export async function signOut(
  cookies: Cookie[],
  sessionStore: SessionStore,
  options: InternalOptions
): Promise<ResponseInternal> {
  const { jwt, events, callbackUrl: redirect, session } = options;
  const sessionToken = sessionStore.value;
  if (!sessionToken) return { redirect, cookies };

  try {
    if (session.strategy === "jwt") {
      const salt = options.cookies.sessionToken.name;
      const token = await jwt.decode({ ...jwt, token: sessionToken, salt });
      await events.signOut?.({ token });
    } else {
      const session = await options.adapter?.deleteSession(sessionToken);
      await events.signOut?.({ session });
    }
  } catch (e) {
    new Error("Signout Error");
  }

  cookies.push(...sessionStore.clean());
  return { redirect, cookies };
}
