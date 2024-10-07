import React from "react";
import { TextButton, IconButton } from "../../components";
import { useFacebook } from "./useFacebook";
import { FacebookIconButtonProps, FacebookLoginButtonProps } from "./types";
import { FaceBookIcon } from "../../assets/Icons";

export const FacebookLogin: React.FC<FacebookLoginButtonProps> = ({
  onSuccess,
  onFailure,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useFacebook(props);
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
      {loading ? "Loading..." : "Login with Facebook"}
    </TextButton>
  );
};

export const FacebookIconButton: React.FC<FacebookIconButtonProps> = ({
  onFailure,
  onSuccess,
  icon = FaceBookIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useFacebook(props);
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
      aria-label="Login with Facebook"
    >
      {loading ? "Logging..." : "Login with Facebook"}
    </IconButton>
  );
};
