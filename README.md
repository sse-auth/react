# SSE Auth React

### **Overview**

---

The auth package provides a simple and easy-to-use authentication system with a popup window for login. It includes a `TextButton` and `IconButton` component for customizing the login experience.

### **Features**

---

- `Popup` window for login
- `TextButton` and `IconButton` components
- Easy to use

### **Getting Started**

---

## Installation

To install the auth package, run the following command in your terminal:

```bash
npm install @sse-auth/react
```

or

```bash
yarn install @sse-auth/react
```

## Usage

To use the `GithubButton` and `GithubLoginButton` components, simply import and render them in your JavaScript file:

```jsx
import { GithubLoginButton, GithubButton } from "@sse-auth/react"

const function = () => {
    return (
        <>
            <GithubLoginButton onSuccess={} onFailure={} />
        </>
    )
}
```

## **Interfaces**

- `Popup` interface

```tsx
interface PopupWindowProps {
  url: string;
  windowName?: string;
  width?: number;
  height?: number;
  redirectUri?: string;
}
```

- `TextButton` interface

```tsx
export declare const TextButton: ({ children, ...rest }: Omit<React.ComponentProps<"button">, "ref" | "className">)
```

- `IconButton` interface

```tsx
export type ButtonWithIconProps = {
  enabled?: boolean;
  variant?: string;
} & ComponentProps<"button"> &
  IconProps;
```

- `Github` interface

```tsx
export type GithubProps = {
  /**
   * GitHub OAuth Client ID
   */
  clientId?: string;
  /**
   * GitHub OAuth Client Secret
   */
  clientSecret?: string;
  /**
   * GitHub OAuth Scope
   * @default []
   * @see https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
   * @example ['user:email']
   */
  scope?: string[];
  /**
   * Require email from user, adds the ['user:email'] scope if not present
   * @default false
   */
  emailRequired?: boolean;

  /**
   * GitHub OAuth Authorization URL
   * @default 'https://github.com/login/oauth/authorize'
   */
  authorizationURL?: string;

  /**
   * GitHub OAuth Token URL
   * @default 'https://github.com/login/oauth/access_token'
   */
  tokenURL?: string;

  /**
   * GitHub OAuth Token URL
   * @default 'https://api.github.com/user'
   */
  userUrl?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity
   * @example { allow_signup: 'true' }
   */
  authorizationParams?: Record<string, string>;
};
```

### **LICENSE**

The auth package is licensed under the [MIT](LICENSE) License.

### **Contributing**

Contributions to the auth package are welcome! To contribute, fork the repository, make your changes, and submit a pull request.
Let me know if you need any further assistance!
