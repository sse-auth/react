import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { SSEAuthProvider } from "../../src/context";
import { ProviderContextMap, PageOptions } from "@sse-auth/types";

const providers: ProviderContextMap = {
  Github: {
    clientId: "Ov23ligCZh50CqgsyUMq",
    clientSecret: "48585fbffe12cfdabdae9a795e84ff2f3237c375",
  },
  Auth0: {
    clientId: "2CgLSC531azV5rlgc2Hsp5y3pzP02GPP",
    clientSecret:
      "DNFBKbV20QzXLKcA7nNmeUdstLLkhzHxpcTJbRkOwUODpKLhy8KkLs9yEpr5eGOR",
    domain: "dev-434vjyv28bzop03f.us.auth0.com",
    scope: ["openid", "profile", "email"],
  },
};

const options: PageOptions = {
  theme: "dark",
  font: "sans-serif",
  site: {
    name: "SSE Authenication"
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SSEAuthProvider providers={providers} options={options}>
      <App />
    </SSEAuthProvider>
  </StrictMode>
);
