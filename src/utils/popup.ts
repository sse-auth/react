interface PopupWindowProps {
  url: string;
  windowName?: string;
  width?: number;
  height?: number;
  redirectUri?: string;
}

export class PopupWindow {
  private url: string;
  private windowName: string;
  private width: number;
  private height: number;
  private redirectUri: string;

  constructor(props: PopupWindowProps) {
    this.url = props.url;
    this.windowName = props.windowName ?? "SSE Login";
    this.width = props.width ?? 600;
    this.height = props.height ?? 700;
    this.redirectUri = props.redirectUri ?? window.location.origin;
  }

  public open(): Promise<Record<string, string>> {
    return new Promise((resolve, reject) => {
      const left = window.screenX + (window.outerWidth - this.width) / 2;
      const top = window.screenY + (window.outerHeight - this.height) / 2.5;
      const features = `width=${this.width},height=${this.height},left=${left},top=${top}`;

      const popup = window.open(this.url, this.windowName, features);
      if (!popup) {
        reject(new Error("Popup window closed by user"));
        return;
      }

      const interval = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(interval);
            reject(new Error("Popup window closed by user"));
          }

          // Check if the popup has redirected to the redirect URI
          if (popup.location.href.includes(this.redirectUri)) {
            const urlParams = new URLSearchParams(popup.location.search);
            const params: Record<string, string> = {};

            urlParams.forEach((value, key) => {
              params[key] = value;
            });

            clearInterval(interval);
            popup.close();
            resolve(params);
          }
        } catch (error) {
          // Ignore cross-origin errors
        }
      }, 1000);
    });
  }
}
