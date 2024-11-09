import React from "react";
import {
  AuthContextType,
  ProviderContextMap,
  UserProps,
  PageOptions,
} from "@sse-auth/types";
import { Adapter } from "@sse-auth/types/adapter";
// import {
//   encode,
//   decode,
//   getToken,
//   defaultCookies,
//   SessionStore,
// } from "@sse-auth/utils";
import { parse } from "@sse-auth/utils/dist/lib/cookie";
import { providerFunction } from "./function";

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

interface SSEAuthInt {
  providers: ProviderContextMap;
  children: React.ReactNode;
  options?: PageOptions;
  adapter?: Adapter;
}

export const SSEAuthProvider: React.FC<SSEAuthInt> = ({
  providers,
  children,
  options,
  adapter,
}) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | string | null | unknown>(
    null
  );
  const [userData, setUserData] = React.useState<UserProps | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [theme, setTheme] = React.useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "system";
  });

  const secureCookies = window.location.protocol === "https:";

  React.useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    setTheme(mediaQuery.matches ? "dark" : "light");

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  React.useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // const cookieName = defaultCookies(secureCookies).sessionToken.name;
  // const salt = `sse-auth.react.session-token`;

  // React.useEffect(() => {
  //   const initAuth = async () => {
  //     const token = await getToken({
  //       req: {
  //         headers: {
  //           getSetCookie: document.cookie
  //         }
  //       },
  //       secureCookie: secureCookies,
  //       secret: options?.secret ?? "sse-auth",
  //       salt
  //     });
  //     if (token) {
  //       const decodedData = await decode({
  //         token,
  //         secret: options?.secret ?? "sse-auth",
  //         salt,
  //       });
  //       if (decodedData) {
  //         setUserData(decodedData);
  //         setAccessToken(null);
  //         setIsAuthenticated(true);
  //       }
  //     }
  //   };
  // }, []);

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

      // Encode the JWT and set it as a cookie
      // const cookieOptions = defaultCookies(secureCookies).sessionToken.options;
      // const jwt = await encode({
      //   token: response.userData,
      //   secret: options?.secret || "sse-auth",
      //   salt,
      // });
      // const cookieChunks = new SessionStore(
      //   defaultCookies(secureCookies).sessionToken,
      //   parse(document.cookie),
      //   console
      // ).chunk(jwt, cookieOptions);

      // cookieChunks.forEach((cookie) => {
      //   document.cookie = `${cookie.name}=${cookie.value}; path=${
      //     cookie.options.path
      //   }; max-age=${cookie.options.maxAge}; ${
      //     cookie.options.secure ? "Secure;" : ""
      //   } HttpOnly; SameSite=${cookie.options.sameSite}`;
      // });
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

    // Clear the session cookies
    // const cookieOptions = defaultCookies(secureCookies).sessionToken.options;
    // const cleanedCookies = new SessionStore(
    //   defaultCookies(secureCookies).sessionToken,
    //   parse(document.cookie),
    //   console
    // ).clean();

    // cleanedCookies.forEach((cookie) => {
    //   document.cookie = `${cookie.name}=; path=${
    //     cookie.options.path
    //   }; max-age=0; ${
    //     cookie.options.secure ? "Secure;" : ""
    //   } HttpOnly; SameSite=${cookie.options.sameSite}`;
    // });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signIn,
        error,
        signOut,
        providers,
        data: { user: userData, accessToken },
        options,
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
