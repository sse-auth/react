import React from "react";
import { AuthContextType, ProviderContextMap, UserProps } from "../types";
import { providerFunction } from "./function";

// Create a context for authentication
export const AuthContext = React.createContext<AuthContextType | null>(null);

export const SSEAuthProvider: React.FC<{
  providers: ProviderContextMap;
  children: React.ReactNode;
}> = ({ providers, children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | string | null | unknown>(
    null
  );
  const [userData, setUserData] = React.useState<UserProps | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);

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
        data: { user: userData, accessToken },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};
