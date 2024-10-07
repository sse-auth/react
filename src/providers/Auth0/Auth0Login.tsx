import React from "react";
import { TextButton, IconButton } from "../../components";
import { useAuth0 } from "./useAuth0";
import { Auth0IconButtonProps, Auth0LoginButtonProps } from "./types";
import { Auth0Icon } from "../../assets/Icons";

export const Auth0Login: React.FC<Auth0LoginButtonProps> = ({
  onSuccess,
  onFailure,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useAuth0(props);
      if (error) {
        onFailure(error as Error);
      } else if (accessToken && userData) {
        onSuccess(accessToken, userData);
      }
    } catch (error) {
      onFailure(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TextButton onClick={handleLogin} disabled={loading}>
      {loading ? "Loading..." : "Login with Auth0"}
    </TextButton>
  );
};

export const Auth0IconButton: React.FC<Auth0IconButtonProps> = ({
  onFailure,
  onSuccess,
  icon = Auth0Icon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useAuth0(props);
      if (error) {
        onFailure(error as Error);
      } else if (accessToken && userData) {
        onSuccess(accessToken, userData);
      }
    } catch (error) {
      onFailure(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IconButton
      icon={icon}
      enabled={!loading}
      variant={variant}
      onClick={handleLogin}
      className={className}
      aria-label="Login with Auth0"
    >
      {loading ? "Logging..." : "Login with Auth0"}
    </IconButton>
  );
};
