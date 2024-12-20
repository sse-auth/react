import React from "react";
import {
  AuthContextType,
  ProviderContextMap,
  UserProps,
  TokenSet,
} from "@sse-auth/types";
import { Adapter } from "@sse-auth/types/adapter";
import { providerFunction } from "./function";
import { defaultCookies, SessionStore, jwt } from "@sse-auth/utils/dist";
import { SSE_User } from "./types";
import { CookiesOptions } from "@sse-auth/types/utils";
import { fromDate } from "@sse-auth/utils/dist/lib/date";

// Create a context for authentication
export const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  signIn: () => {},
  signOut: () => {},
  error: null,
  providers: null,
  data: {
    user: null,
    accessToken: null,
  },
  options: {
    theme: "light",
    font: "sans-serif",
    site: {
      name: "SSE Auth",
    },
  },
});

interface AuthConfig {
  /**
   * Specify URLs to be used if you want to create custom sign in, sign out and error pages.
   * Pages specified will override the corresponding built-in page.
   *
   * @default {}
   * @example
   *
   * ```ts
   *   pages: {
   *     signIn: '/auth/signin',
   *     signOut: '/auth/signout',
   *     error: '/auth/error',
   *     verifyRequest: '/auth/verify-request',
   *     newUser: '/auth/new-user'
   *   }
   * ```
   */
  pages?: Partial<{
    /**
     * The path to the sign in page.
     *
     * The optional "error" query parameter is set to
     * one of the {@link SignInPageErrorParam available} values.
     *
     * @default "/signin"
     */
    signIn?: string;
    signOut?: string;
    /**
     * The path to the error page.
     *
     * The optional "error" query parameter is set to
     * one of the {@link ErrorPageParam available} values.
     *
     * @default "/error"
     */
    error?: string;
    verifyRequest?: string;
    /** If set, new users will be directed here on first sign in */
    newUser?: string;
  }>;
  /**
   * When set to `true` then all cookies set by NextAuth.js will only be accessible from HTTPS URLs.
   * This option defaults to `false` on URLs that start with `http://` (e.g. http://localhost:3000) for developer convenience.
   * You can manually set this option to `false` to disable this security feature and allow cookies
   * to be accessible from non-secured URLs (this is not recommended).
   *
   * - ⚠ **This is an advanced option.** Advanced options are passed the same way as basic options,
   * but **may have complex implications** or side effects.
   * You should **try to avoid using advanced options** unless you are very comfortable using them.
   *
   * The default is `false` HTTP and `true` for HTTPS sites.
   */
  useSecureCookies?: boolean;
  /** Changes the theme of built-in {@link AuthConfig.pages}. */
  theme?: {
    colorScheme?: "auto" | "dark" | "light";
    logo?: string;
    brandColor?: string;
    buttonText?: string;
  };
  /**
   * You can override the default cookie names and options for any of the cookies used by Auth.js.
   * You can specify one or more cookies with custom properties
   * and missing options will use the default values defined by Auth.js.
   * If you use this feature, you will likely want to create conditional behavior
   * to support setting different cookies policies in development and production builds,
   * as you will be opting out of the built-in dynamic policy.
   *
   * - ⚠ **This is an advanced option.** Advanced options are passed the same way as basic options,
   * but **may have complex implications** or side effects.
   * You should **try to avoid using advanced options** unless you are very comfortable using them.
   *
   * @default {}
   */
  cookies?: Partial<CookiesOptions>;
}

interface SessionConfig {
  /**
   * A random string used to hash tokens, sign cookies and generate cryptographic keys.
   *
   * To generate a random string, you can use the Auth.js CLI: `npx auth secret`
   *
   * @note
   * You can also pass an array of secrets, in which case the first secret that successfully
   * decrypts the JWT will be used. This is useful for rotating secrets without invalidating existing sessions.
   * The newer secret should be added to the start of the array, which will be used for all new sessions.
   *
   */
  secret?: string | string[];
  /**
   * Relative time from now in seconds when to expire the session
   *
   * @default 2592000 // 30 days
   */
  maxAge: number;
  /**
   * How often the session should be updated in seconds.
   * If set to `0`, session is updated every time.
   *
   * @default 86400 // 1 day
   */
  updateAge: number;
}

interface SSEAuthInt {
  providers: ProviderContextMap;
  children: React.ReactNode;
  options?: AuthConfig;
  sessions: SessionConfig;
  adapter?: Adapter;
}

export const SSEAuthProvider: React.FC<SSEAuthInt> = ({
  providers,
  children,
  options,
  sessions,
  adapter,
}) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | string | null | unknown>(
    null
  );
  const [userData, setUserData] = React.useState<UserProps | null>(null);
  const [profile, setProfile] = React.useState<SSE_User>();
  const [accessToken, setAccessToken] = React.useState<TokenSet | null>(null);
  const [theme, setTheme] = React.useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "system";
  });

  let strategy: "jwt" | "database" = "jwt";
  if (adapter) return (strategy = "database");

  if (!sessions.maxAge) sessions.maxAge === 2592000;

  const secureCookies = window.location.protocol === "https:";
  const cookies = defaultCookies(secureCookies);
  const sessionStore = new SessionStore(cookies, {}, console);

  const session = async () => {
    const sessionToken = sessionStore.value;
    if (!sessionToken) return null;

    if (adapter) {
      // Retrieve session from database
      try {
        const { getSessionAndUser, deleteSession, updateSession } =
          adapter as Required<Adapter>;
        let userAndSession = await getSessionAndUser(sessionToken);

        // If session has expired, clean up the database
        if (
          userAndSession &&
          userAndSession.session.expires.valueOf() < Date.now()
        ) {
          await deleteSession(sessionToken);
          userAndSession = null;
        }

        if (userAndSession) {
          const { user, session } = userAndSession;
          const sessionUpdateAgo = sessions.updateAge;
          // Calculate last updated date to throttle write updates to database
          // Formula: ({expiry date} - sessionMaxAge) + sessionUpdateAge
          //     e.g. ({expiry date} - 30 days) + 1 hour
          const sessionIsDueToBeUpdatedDate =
            session.expires.valueOf() -
            sessions.maxAge * 1000 +
            sessionUpdateAgo * 1000;

          const newExpires = fromDate(sessions.maxAge);
          // Trigger update of session expiry date and write to database, only
          // if the session was last updated more than {sessionUpdateAge} ago
          if (sessionIsDueToBeUpdatedDate <= Date.now()) {
            await updateSession({
              sessionToken: sessionToken,
              expires: newExpires,
            });
          }

          const sessionCookies = sessionStore.chunk(sessionToken, {
            expires: newExpires,
          });

          sessionCookies.forEach((cookie) => {
            document.cookie = `${cookie.name}=${cookie.value}; path=${
              cookie.options.path
            }; max-age=${cookie.options.maxAge}; ${
              cookie.options.secure ? "secure" : ""
            }`;
          });

          return {
            user,
            expires: newExpires.toISOString(),
          };
        }
      } catch (error) {
        console.error("Error retrieving session from adapter:", error);
        // Clean up if there's an error
        sessionStore.clean();
      }
    } else {
      // Handle JWT session
      const payload = await jwt.decode({
        token: sessionToken,
        secret: sessions.secret || "sse-auth",
        salt: options?.cookies?.sessionToken?.name || ""
      });
      
      if (!payload) throw new Error("Invalid JWT")

        const newExpires = fromDate(sessions.maxAge || 2592000)
        const session = {
          user: payload.user;
        }
    }

    try {
      const payload = await jwt.decode({
        token: sessionToken,
        secret: options?.secret || "sse-auth",
        salt: options?.cookies?.sessionToken?.name || "sse",
      });
      if (!payload) throw new Error("Invalid JWT");

      const newExpires = fromDate(sessions.maxAge);
      // const session = {
      //   user: payload,
      //   expires: newExpires.toISOString()
      // }

      // Update session cookie
      const sessionCookies = sessionStore.chunk(sessionToken, {
        expires: newExpires,
      });
      sessionCookies.forEach((cookie) => {
        document.cookie = `${cookie.name}=${cookie.value}; path=${
          cookie.options.path
        }; max-age=${cookie.options.maxAge}; ${
          cookie.options.secure ? "secure" : ""
        }`;
      });
    } catch (error) {
      console.error("Session error:", error);
      return null;
    }
  };

  const signIn = async (providerName: keyof ProviderContextMap) => {
    try {
      const provider = providers[providerName];
      if (!provider) {
        throw new Error(`Provider ${providerName} not found`);
      }

      const loginFunction = providerFunction[providerName];
      const response = await loginFunction(provider as any);

      // Assuming response contains user data and access token
      setUserData(response.userData);
      setAccessToken(response.accessToken);
      setIsAuthenticated(true);
      setProfile(response.profile);
    } catch (err) {
      setError(err);
      console.error("Authentication error:", err);
    }
  };

  const signOut = () => {
    setError(null);
    setIsAuthenticated(false);
    setUserData(null);
    setAccessToken(null);
    setProfile(undefined);

    // Clean cookies on sign out
    const cookiesToClean = sessionStore.clean();
    cookiesToClean.forEach((cookie) => {
      document.cookie = `${cookie.name}=; path=${cookie.options.path}; max-age=0; secure=${cookie.options.secure}; sameSite=${cookie.options.sameSite}`;
    });
  };

  React.useEffect(() => {
    const fetchToken = async () => {
      const token = await jwt.getToken({
        req: { headers: { cookie: document.cookie } },
        secret: options?.secret,
      });

      if (token) {
        const decodedData = await jwt.decode({
          token,
          secret: options?.secret || "sse-auth",
          salt: options?.cookies?.sessionToken?.name || "sse",
        });
        if (decodedData) {
          setProfile(decodedData);
          setIsAuthenticated(true);
        }
      }
    };

    fetchToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signIn,
        error,
        signOut,
        providers,
        data: { user: userData, accessToken },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const signIn = (name: keyof ProviderContextMap) => {
  const { signIn } = useAuth();
  return signIn(name);
};

export const signOut = () => {
  const { isAuthenticated, signOut } = useAuth();
  if (isAuthenticated === false) {
    return "You need to authenticate First";
  }
  return signOut;
};

export const userData = () => {
  const { isAuthenticated, data } = useAuth();
  if (isAuthenticated === false) {
    return "You need to Authenticate First";
  }
  return data;
};
