# SSE React Facebook Login

[![NPM version](https://img.shields.io/npm/v/@sse-auth/react)](https://npmjs.com/package/@sse-auth/react)
[![NPM downloads](https://img.shields.io/npm/dm/@sse-auth/react)](https://npmjs.com/package/@sse-auth/react)
[![NPM bundle size](https://img.shields.io/bundlephobia/min/@sse-auth/react)](https://npmjs.com/package/@sse-auth/react)

<!-- [![CI](https://img.shields.io/github/actions/workflow/status/greatsumini/react-facebook-login/ci.yml?label=CI)](https://github.com/sse-auth/react/actions/workflows/ci.yml) -->
<!-- [![CD](https://img.shields.io/github/actions/workflow/status/greatsumini/react-facebook-login/npm-publish.yml?label=CD)](https://github.com/sse-auth/react/actions/workflows/cd.yml) -->

[![GitHub Stars](https://img.shields.io/github/stars/sse-auth/react?style=social)](https://github.com/sse-auth/react)

<br/>

React Component for Facebook Login. aims to improve [react-facebook-login](https://github.com/sse-auth/react/blob/v1.4.0/src/providers/facebook).<br/>

- 💙 Typescript support
- 📦 1mb mini library
- 👫 All browsers supported
- 🏃 Currently maintaining

## Table of contents

- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Component](#component)
  - [FacebookLoginClient](#facebookloginclient)
- [Examples](#examples)
- [Props](#props)
- [Stay in touch](#stay-in-touch)
- [License](#license)
- [Links](#links)

## Getting Started

```shell
npm i --save @sse-auth/react
# or
yarn add @sse-auth/react
```

## Usage

### Component

```tsx
import FacebookLogin from '@sse-auth/react';

// default
<FacebookLogin
  appId="1088597931155576"
  onSuccess={(response) => {
    console.log('Login Success!', response);
  }}
  onFail={(error) => {
    console.log('Login Failed!', error);
  }}
  onProfileSuccess={(response) => {
    console.log('Get Profile Success!', response);
  }}
/>

// custom style
<FacebookLogin
  appId="1088597931155576"
  style={{
    backgroundColor: '#4267b2',
    color: '#fff',
    fontSize: '16px',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
  }}
/>

// custom render function
<FacebookLogin
  appId="1088597931155576"
  onSuccess={(response) => {
    console.log('Login Success!', response);
  }}
  onFail={(error) => {
    console.log('Login Failed!', error);
  }}
  onProfileSuccess={(response) => {
    console.log('Get Profile Success!', response);
  }}
  render={({ onClick, logout }) => (
    <CustomComponent onClick={onClick} onLogoutClick={logout} />
  )}
/>

// custom params, options
<FacebookLogin
  appId="1088597931155576"
  useRedirect
  initParams={{
    version: 'v10.0',
    xfbml: true,
  }}
  dialogParams={{
    response_type: 'token',
  }}
  loginOptions={{
    return_scopes: true,
  }}
/>
```

### FacebookLoginClient

You can manually call facebook sdk related functions with FacebookLoginClient

```tsx
import { FacebookLoginClient } from "@sse-auth/react";

FacebookLoginClient.getLoginStatus((res) => {
  console.log(res.status);
});

FacebookLoginClient.login((res) => {
  console.log(res);
});

FacebookLoginClient.getProfile((res) => {
  console.log(res.id, res.name, res.email);
});

FacebookLoginClient.logout(() => {
  console.log("logout completed!");
});
```

## Examples

You can checkout examples [here](./examples)

## Props

Check all available params,options [here](./docs/params.md)

| Property         | Description                                      | Type                        | Default                                                                                                       |
| ---------------- | ------------------------------------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| appId \*         | Your application ID.                             | string                      | -                                                                                                             |
| language         | API version                                      | string                      | 'en_US'                                                                                                       |
| scope            | Comma seperated list of permissions for login.   | string                      | 'public_profile, email'                                                                                       |
| fields           | fields return by /me (profile)                   | string                      | 'name,email,picture'                                                                                          |
| onSuccess        |                                                  | function                    | -                                                                                                             |
| onFail           |                                                  | function                    | -                                                                                                             |
| onProfileSuccess |                                                  | function                    | -                                                                                                             |
| style            | css properties for login button                  | CSSProperties               | -                                                                                                             |
| children         | Children Component                               | ReactNode \| ReactNodeArray | "Login with Facebook"                                                                                         |
| render           | Callback which render custom component           | function                    | -                                                                                                             |
| autoLoad         | if true, request login on mount                  | boolean                     | false                                                                                                         |
| useRedirect      | if true, use redirect instead of window.FB.login | boolean                     | false (forced to be true in fb browers ([ref](https://github.com/sse-auth/react/issues/2))) |
| useCustomChat    | if true, append 'xfbml.customerchat' to sdk url  | boolean                     | false                                                                                                         |
| initParams       | params for FB.init                               | InitParams                  | [docs](./docs/params.md)                                                                                      |
| dialogParams     | params for login dialog                          | DialogParams                | [docs](./docs/params.md)                                                                                      |
| loginOptions     | options for FB.login                             | LoginOptions                | [docs](./docs/params.md)                                                                                      |

<br/>

## Stay in touch

- Author - [Sumin Choi](https://sumini.dev)

## License

React Facebook Login is [MIT licensed](./LICENSE).

## Links

- [NPM](https://www.npmjs.com/package/@sse-auth/react)
- [GitHub](https://github.com/sse-auth/react)
- [(Official) Facebook Login Guide](https://developers.facebook.com/docs/facebook-login/web)
