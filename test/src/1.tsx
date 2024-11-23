import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Auth0IconButton } from "../../src/providers/Auth0";
// import { BattleDotNetIconButton } from "../../src/providers/BattleDotNet";
// import { UserProps } from "";
import { GithubIconButton } from "../../src/providers/Github";
import { SSEFacebookLogin } from "../../src/providers/Facebook";
import { DiscordIconButton } from "../../src/providers/Discord";
// import { LinkedInIconButton } from "../../src/providers/Linkedin";
import { SpotifyIconButton } from "../../src/providers/Spotify";
import { TwitchIconButton } from "../../src/providers/Twitch";
import { YandexIconButton } from "../../src/providers/Yandex";
// import { BattleDotNetIconButton } from "@sse-auth/react/provider/BattleDotNet"
// import { UserProps } from "@sse-auth/react/provider"
import { useAuth } from "@sse-auth/react/dist/src/context/AuthContext.js";
import "@sse-auth/react/dist/style.css";

interface UserData {
  [key: string]: any;
}

function App() {
  const { providers, signIn } = useAuth();
  const onSucc = (accessToken: string | object, userData: UserData) => {
    console.log(accessToken);
    console.log(userData);
    alert(
      `Logged in successfully! Welcome, ${userData.name}, global_name: ${userData.global_name}!`
    );
  };

  console.log(providers);

  const login = async () => {
    // // const { error, accessToken, userData } = await useGithub({
    // //   clientId: "Ov23ligCZh50CqgsyUMq",
    // //   clientSecret: "48585fbffe12cfdabdae9a795e84ff2f3237c375",
    // // });
    // const { error, accessToken, userData } = await useSpotify({
    //   clientId: "a9ca3980784c47338d9ca5464583fa65",
    //   clientSecret: "068c36afe896477592b11a4c69b76b1c",
    // });
    // console.log("[Error]:", error);
    // console.log("[Accesstoken]:", accessToken);
    // console.log("[User]:", userData);
    signIn("Auth0");
  };

  const onFail = (error: Error) => {
    console.log(error);
  };

  return (
    <>
      {/* <SignIn theme="light" font="Open Sans" /> */}
      <>
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={login}>Click Me</button>
          <GithubIconButton
            clientId="Ov23ligCZh50CqgsyUMq"
            clientSecret="48585fbffe12cfdabdae9a795e84ff2f3237c375"
            onFailure={onFail}
            onSuccess={onSucc}
          />
          <SSEFacebookLogin
            appId="856092133250976"
            // clientSecret="06f1e63d4b73b6abfa76501b7668615e"
            onSuccess={(response) => {
              console.log("Login Success!", response);
            }}
            onFail={(error) => {
              console.log("Login Failed!", error);
            }}
            onProfileSuccess={(response) => {
              console.log("Get Profile Success!", response);
            }}
            useRedirect
            initParams={{
              version: "v21.0",
              xfbml: true,
            }}
          />
          {/* <GithubLoginButton onClick={login} /> */}
          <Auth0IconButton
            clientId="2CgLSC531azV5rlgc2Hsp5y3pzP02GPP"
            clientSecret="DNFBKbV20QzXLKcA7nNmeUdstLLkhzHxpcTJbRkOwUODpKLhy8KkLs9yEpr5eGOR"
            domain="dev-434vjyv28bzop03f.us.auth0.com"
            scope={[
              "openid",
              "email",
              "profile",
              "address",
              "phone",
              "offline_access",
            ]}
            onSuccess={onSucc}
            onFailure={onFail}
          />
          <DiscordIconButton
            // profileRequired
            onFailure={onFail}
            onSuccess={onSucc}
            emailRequired
            clientId="1295748016875241574"
            clientSecret="_YeiFLQn51R_6i3MarFvPBL0OFqAPfyI"
          />
          <SpotifyIconButton
            clientId="a9ca3980784c47338d9ca5464583fa65"
            clientSecret="068c36afe896477592b11a4c69b76b1c"
            onSuccess={onSucc}
            onFailure={onFail}
            show_dialog
          />
          <TwitchIconButton
            clientId="v67qihzo3aue3ibx296x9nrpewy5c5"
            clientSecret="eu7n7p3o7to662a1aazrwtc1wnqtcw"
            onSuccess={onSucc}
            onFailure={onFail}
          />
          <YandexIconButton
            clientId="v67qihzo3aue3ibx296x9nrpewy5c5"
            clientSecret="eu7n7p3o7to662a1aazrwtc1wnqtcw"
            onSuccess={onSucc}
            onFailure={onFail}
          />
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </>
    </>
  );
}

export default App;
