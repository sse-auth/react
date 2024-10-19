# SSE Auth React

## Note
We have remover the the buttons. If you want to use it install `@sse-auth/buttons` package

### **Overview**

---

The auth package provides a simple and easy-to-use authentication system with a popup window for login. It includes a `TextButton` and `IconButton` component for customizing the login experience.

### **Features**

---

- `Popup` window for login
- `TextButton` and `IconButton` components
- Easy to use
- Providing eide range of OAuth

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

## Providers

- Github
- Facebook
- Auth0
- BattleDotNet

## Usage

To use the Login components, simply import and render them in your JavaScript file:

```jsx
import { ProviderLogin, ProviderIconButton, useProvider } from "@sse-auth/react"
```

`Provider` is `replaced` by Your Auth like `Github`, `Facebook`, `Auth`. `ProviderLogin` is a Button with Text only whereas `ProviderIconButton` Has Icon Of the Auth Package as well as you can enter the icon also

- Use Of `useProvider`

```jsx
import { useProvider } from "@sse-auth/react";

const App = () => {
  const handleLogin = () => {
    const { error, accessToken, userData } = useProvider({
      clientId: "",
      clientSecret: "",
    });
  };

  return <button onClick={handleLogin}>Login</button>;
};
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
### **LICENSE**

The auth package is licensed under the [MIT](LICENSE) License.

### **Contributing**

Contributions to the auth package are welcome! To contribute, fork the repository, make your changes, and submit a pull request.
Let me know if you need any further assistance!
