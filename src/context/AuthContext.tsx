import React from "react";
import { AuthContextType, ProviderContextMap, UserProps, PageOptions } from "../types";
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

export const SSEAuthProvider: React.FC<{
  providers: ProviderContextMap;
  children: React.ReactNode;
  options?: PageOptions;
}> = ({ providers, children, options }) => {
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

  const signIn = async (providerName: keyof ProviderContextMap) => {
    try {
      const provider = providers[providerName];
      if (!provider) {
        throw new Error(`Provider ${providerName} not found`);
      }

      const loginFunction = providerFunction[providerName];

      const response = await loginFunction(provider as any);
      setUserData(response.userData);
      setAccessToken(response.accessToken);
      setIsAuthenticated(true);
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
        options
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
