export type WarningCode =
  | "debug-enabled"
  | "csrf-disabled"
  | "experimental-webauthn"
  | "env-url-basepath-redundant"
  | "env-url-basepath-mismatch";

export interface LoggerInstance extends Record<string, Function> {
  warn: (code: WarningCode) => void;
  error: (error: Error) => void;
  debug: (message: string, metadata?: unknown) => void;
}

export type Awaitable<T> = T | PromiseLike<T>;
export type Awaited<T> = T extends Promise<infer U> ? U : T;

export type AuthAction =
  | "callback"
  | "csrf"
  | "error"
  | "providers"
  | "session"
  | "signin"
  | "signout"
  | "verify-request"
  | "webauthn-options";

export interface RequestInternal {
  url: URL;
  method: "GET" | "POST";
  cookies?: Partial<Record<string, string>>;
  headers?: Record<string, any>;
  query?: Record<string, any>;
  body?: Record<string, any>;
  action: AuthAction;
  providerId?: string;
  error?: string;
}

export * from "./jwt"
export * from "./cookie"