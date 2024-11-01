import { SSEProps } from "./index";

export interface YandexProps extends SSEProps {
  /**
   * Yandex OAuth Client ID
   */
  clientId?: string;

  /**
   * Yandex OAuth Client Secret
   */
  clientSecret?: string;

  /**
   * Yandex OAuth Scope
   * @default []
   * @see https://yandex.ru/dev/id/doc/en/codes/code-url#optional
   * @example ["login:avatar", "login:birthday", "login:email", "login:info", "login:default_phone"]
   */
  scope?: string[];

  /**
   * Require email from user, adds the ['login:email'] scope if not present
   * @default false
   */
  emailRequired?: boolean;

  /**
   * Yandex OAuth Authorization URL
   * @default 'https://oauth.yandex.ru/authorize'
   */
  authorizationURL?: string;

  /**
   * Yandex OAuth Token URL
   * @default 'https://oauth.yandex.ru/token'
   */
  tokenURL?: string;

  /**
   * Yandex OAuth User URL
   * @default 'https://login.yandex.ru/info'
   */
  userURL?: string;
}
