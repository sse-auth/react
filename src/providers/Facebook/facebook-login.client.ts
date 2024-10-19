// @ts-ignore
import { createScriptEle, objectToParams, paramsToObject } from "./helpers";
import {
  DialogParams,
  InitParams,
  LoginOptions,
  LoginResponse,
  LoginStatus,
} from "./types";

export const SDK_SCRIPT_ELE_ID = "facebook-jssdk";

export const FacebookLoginClient = {
  getFB: () => {
    if (!window.FB) {
      console.warn("FB not found");
      return null;
    }
    return window.FB;
  },
  getLoginStatus(
    callback: (res: LoginResponse) => void,
    isForcingRoudtrip = false
  ) {
    const FB = this.getFB();

    if (!FB) {
      callback({ status: "unknown" as LoginStatus });
      return;
    }

    FB.getLoginStatus(callback, isForcingRoudtrip);
  },
  getProfile(callback: (res: unknown) => void, params: { fields: string }) {
    this.getFB()?.api("me", params, callback);
  },
  init(initParams: InitParams) {
    this.getFB()?.init(initParams);
  },
  clear() {
    window.FB = null;
    const scriptEle = document.getElementById(SDK_SCRIPT_ELE_ID);
    if (scriptEle) {
      scriptEle.remove();
    }
  },
  isRedirected(dialogParams?: DialogParams): boolean {
    const params = paramsToObject(window.location.search);

    return (
      (params["state"] === dialogParams?.state ?? "facebookdirect") &&
      params[dialogParams?.response_type ?? ""] !== undefined
    );
  },
  async loadSdk(language: string, useCustomerChat?: boolean) {
    await createScriptEle(
      SDK_SCRIPT_ELE_ID,
      `https://connect.facebook.net/${language}/sdk${
        useCustomerChat ? "/xfbml.customerchat" : ""
      }.js`
    );
  },
  redirectToDialog(
    dialogParams: DialogParams,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { ignoreSdkError, ...loginOptions }: LoginOptions
  ) {
    window.location.href = `https://www.facebook.com/dialog/oauth${objectToParams(
      {
        ...dialogParams,
        ...loginOptions,
      }
    )}`;
  },
  login(
    callback: (res: LoginResponse) => void,
    { ignoreSdkError, ...loginOptions }: LoginOptions
  ) {
    try {
      this.getFB()?.login(callback, loginOptions);
    } catch (e) {
      if (ignoreSdkError) {
        return;
      } else {
        throw e;
      }
    }
  },
  logout(callback: (res?: unknown) => void) {
    this.getLoginStatus((res) => {
      if (res.status === "connected") {
        this.getFB()?.logout(callback);
      } else {
        callback();
      }
    });
  },
};
