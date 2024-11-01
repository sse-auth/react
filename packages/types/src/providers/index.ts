export * from "./Auth0";
export * from "./BattleDotNet";
export * from "./Cognito";
export * from "./Discord";
export * from "./Github";
export * from "./Google";
export * from "./Keycloak";
export * from "./Linkedin";
export * from "./Microsoft";
export * from "./Paypal";
export * from "./Spotify";
export * from "./Steam";
export * from "./Twitch";
export * from "./X";
export * from "./Xsuaa";
export * from "./Yandex";

type UxMode = "popup" | "redirect";

export interface SSEProps {
  /**
   * @default 'popup'
   */
  ux_mode?: UxMode;
  /**
   * @default window.location.orign
   */
  redirectUri?: string;
}

export interface UserProps {
  [key: string]: any;
}

export interface ResponseObjProps<T extends UserProps = UserProps> {
  error: Error | null | unknown;
  accessToken: string | null | object;
  userData: T | null;
}

export type ResponseProps<T extends UserProps = UserProps> = {
  error: Error | null | unknown;
  accessToken: string | null;
  userData: T | null;
};

export type LoginButtonProps<T> = T & {
  onSuccess: (accessToken: string, userData: any) => void;
  onFailure: (error: Error) => void;
};

export type IconButtonProps<T> = T & {
  onSuccess: (accessToken: string, userData: any) => void;
  onFailure: (error: Error) => void;
  //   icon: IconProps["icon"];
  icon?: React.ReactNode | string;
  variant?: string;
  className?: string;
};

export enum DiscordScopes {
  IDENTIFY = "identify",
  EMAIL = "email",
  GUILDS = "guilds",
  GUILDS_JOIN = "guilds.join",
  GDM_JOIN = "gdm.join",
  MESSAGES_READ = "messages.read",
  RPC = "rpc",
  RPC_NOTIFICATIONS_READ = "rpc.notifications.read",
  RPC_VOICE_READ = "rpc.voice.read",
  RPC_VOICE_WRITE = "rpc.voice.write",
  RPC_ACTIVITIES_WRITE = "rpc.activities.write",
  BOT = "bot",
  WEBHOOK_INCOMING = "webhook.incoming",
  APPLICATIONS_BUILDS_UPLOAD = "applications.builds.upload",
  APPLICATIONS_BUILDS_READ = "applications.builds.read",
  APPLICATIONS_STORE_UPDATE = "applications.store.update",
  APPLICATIONS_ENTITLEMENTS = "applications.entitlements",
  ACTIVITIES_READ = "activities.read",
  ACTIVITIES_WRITE = "activities.write",
  RELATIONSHIPS_READ = "relationships.read",
}
