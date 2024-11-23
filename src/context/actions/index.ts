import { handleLoginOrRegister } from "./handle-login";
import { createHash } from "../utils/web";
import { Adapter, AdapterSession } from "@sse-auth/types/adapter";
import type { Authenticator, RequestInternal } from "@sse-auth/types";
import { InternalOptions, SSE_Account, SSE_User } from "../types";
import { ResponseInternal } from "@sse-auth/types";
import type { Cookie } from "@sse-auth/types/utils";
import { SessionStore } from "@sse-auth/utils/dist";

async function callback(
  request: RequestInternal,
  options: InternalOptions,
  sessionStore: SessionStore,
  cookies: Cookie[]
) {
  if (!options.provider)
    throw new Error("Callback route called without provider");
  const { query, body, method, headers } = request;
  const {
    provider,
    adapter,
    url,
    callbackUrl,
    pages,
    jwt,
    events,
    callbacks,
    session: { strategy: sessionStrategy, maxAge: sessionMaxAge },
  } = options;

  const useJwtSession = sessionStrategy === "jwt";
  try {
  } catch (e) {
    // if (e instanceof AuthError) throw e;
    const error = new Error(`${e}`);
    // logger.debug("callback route error details", { method, query, body });
    throw error;
  }
}
