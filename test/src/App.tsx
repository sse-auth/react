import { SignIn } from "../../src/components/Pages/SignIn";
import { useAuth } from "../../src/context";
// import { LoginExample1 } from "../../src/components/Pages/SignOut";
// import "../../css/card.css"
// import "../../css/slug.css"
// import "../../css/index.css"
import "../../src/css/style.css";

function App() {
  const { isAuthenticated, providers, data } = useAuth()
  console.log(providers)

  return (
    <>
      {!isAuthenticated ? (
        <SignIn username />
      ) : (
        <>
          Token: {data.accessToken}
          <br />
          User Data: {data?.user?.sub}
        </>
      )}
      {/* <>
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
          /> */}
      {/* <GithubLoginButton onClick={login} /> */}
      {/* <Auth0IconButton
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
      </> */}
    </>
  );
}

export default App;
