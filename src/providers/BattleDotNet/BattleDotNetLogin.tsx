import React from "react";
import { TextButton, IconButton } from "../../components";
import { useBattleDotNet } from "./useBattleDotNet";
import { BattleDotNetLoginButtonProps, BattleDotNetIconButtonProps, } from "./types";
import { BattleDotNetIcon } from "../../assets/Icons";

export const BattleDotNetLogin: React.FC<BattleDotNetLoginButtonProps> = ({
  onSuccess,
  onFailure,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useBattleDotNet(props);
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
      {loading ? "Loading..." : "Login with BattleDotNet"}
    </TextButton>
  );
};

export const BattleDotNetIconButton: React.FC<BattleDotNetIconButtonProps> = ({
  onFailure,
  onSuccess,
  icon = BattleDotNetIcon,
  variant,
  className,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, accessToken, userData } = await useBattleDotNet(props);
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
      aria-label="Login with BattleDotNet"
    >
      {loading ? "Logging..." : "Login with BattleDotNet"}
    </IconButton>
  );
};
