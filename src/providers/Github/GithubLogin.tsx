import React, { useState } from "react";
import { TextButton, IconButton } from "../../components";
import { useGithub } from "./useGithub";
import { GithubIconButtonProps, GithubLoginButtonProps } from "./types";
import { GithubIcon } from "../../assets/Icons";

export const GithubLoginButton: React.FC<GithubLoginButtonProps> = ({
  onSuccess,
  onFailure,
  ...props
}) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useGithub(props);
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
      {loading ? "Loading..." : "Login with GitHub"}
    </TextButton>
  );
};

export const GithubIconButton: React.FC<GithubIconButtonProps> = ({
  onFailure,
  onSuccess,
  icon = GithubIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useGithub(props);
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
      aria-label="Login with GitHub"
    >
      {loading ? "Logging..." : "Login with GitHub"}
    </IconButton>
  );
};
