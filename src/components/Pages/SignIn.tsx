import { useAuth } from "../../context/AuthContext";
import Card from "../tailus-ui/Card";
import Button from "../tailus-ui/Button";
import Label from "../tailus-ui/Label";
import Input from "../tailus-ui/Input";
import Separator from "../tailus-ui/Separator";
import { Text, Link, Caption, Title } from "../tailus-ui/typography";
import { GithubIcon, GoogleIcon } from "../../assets/Icons";
import { ProviderContextMap } from "../../types";
import { useEffect } from "react";

// type SignInTheme = "dark" | "light" | "system";

// type FontOptions =
//   | "Open Sans"
//   | "ui-sans-serif"
//   | "system-ui"
//   | "-apple-system"
//   | "Segoe UI"
//   | "Roboto"
//   | "Helvetica Neue"
//   | "Arial"
//   | "Noto Sans"
//   | "sans-serif"
//   | "Apple Color Emoji"
//   | "Segoe UI Emoji"
//   | "Segoe UI Symbol"
//   | "Noto Color Emoji";

// interface SignInProps {
//   theme?: SignInTheme;
//   font?: FontOptions;
// }

// export const SignIn = ({ theme, font }: SignInProps) => {
//   const { providers, signIn } = useAuth();
//   return (
//     <>
//       <div className={`font-[${font ?? "sans-serif"}]`}>
//         <div
//           className={`relative py-16  ${
//             theme === "dark"
//               ? "bg-gradient-to-br from-gray-800 to-gray-900"
//               : "bg-gradient-to-br from-sky-50 to-gray-200"
//           }`}
//         >
//           <div
//             className={`relative container m-auto px-6 ${
//               theme === "dark" ? "text-gray-400" : "text-gray-500"
//             } md:px-12 xl:px-40`}
//           >
//             <div className="m-auto md:w-8/12 lg:w-6/12 xl:w-6/12">
//               <div
//                 className={`rounded-xl ${
//                   theme === "dark" ? "bg-gray-900" : "bg-white"
//                 } shadow-xl`}
//               >
//                 <div className="p-6 sm:p-16">
//                   <div className="space-y-4">
//                     <img
//                       src="https://tailus.io/sources/blocks/social/preview/images/icon.svg"
//                       loading="lazy"
//                       className="w-10"
//                       alt="tailus logo"
//                     />
//                     <h2
//                       className={`mb-8 text-2xl ${
//                         theme === "dark" ? "text-white" : "text-cyan-900"
//                       } font-bold`}
//                     >
//                       Sign in {/* to unlock the <br /> best of Tailus */}.
//                     </h2>
//                   </div>
//                   <div className="mt-16 grid space-y-4">
//                     {providers &&
//                       Object.keys(providers).map((providerName) => (
//                         <div
//                           className={`group h-12 px-6 border-2 ${
//                             theme === "dark"
//                               ? "border-gray-700"
//                               : "border-gray-300"
//                           } rounded-full transition duration-300 hover:border-blue-500 focus:bg-blue-600 active:bg-blue-700`}
//                         >
//                           <button
//                             className="relative flex items-center space-x-4 justify-center"
//                             onClick={() =>
//                               signIn(providerName as keyof typeof providers)
//                             }
//                           >
//                             {providerName === "google" && (
//                               <img
//                                 src="https://tailus.io/sources/blocks/social/preview/images/google.svg"
//                                 className="absolute left-0 w-5"
//                                 alt="google logo"
//                               />
//                             )}
//                             {providerName === "github" && (
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill="currentColor"
//                                 className="absolute left-0 w-5"
//                                 viewBox="0 0 16 16"
//                               >
//                                 <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04  2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
//                               </svg>
//                             )}
//                             {providerName === "facebook" && (
//                               <img
//                                 src="https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg"
//                                 className="absolute left-0 w-5"
//                                 alt="Facebook logo"
//                               />
//                             )}
//                             <span
//                               className={`block w-max font-semibold tracking-wide ${
//                                 theme === "dark"
//                                   ? "text-gray-300"
//                                   : "text-gray-700"
//                               } text-sm transition duration-300 group-hover:text-white sm:text-base`}
//                             >
//                               Continue with SSE
//                             </span>
//                           </button>
//                         </div>
//                       ))}

//                     <div
//                       className={`mt-32 space-y-4 ${
//                         theme === "dark" ? "text-gray-400" : "text-gray-600"
//                       } text-center sm:-mb-8`}
//                     >
//                       <p className="text-xs">
//                         By proceeding, you agree to our
//                         <a
//                           href="#"
//                           className={`underline ${
//                             theme === "dark" ? "text-gray-300" : "text-gray-700"
//                           }`}
//                         >
//                           Terms of Use
//                         </a>
//                         and confirm you have read our
//                         <a
//                           href="#"
//                           className={`underline ${
//                             theme === "dark" ? "text-gray-300" : "text-gray-700"
//                           }`}
//                         >
//                           Privacy and Cookie Statement
//                         </a>
//                         .
//                       </p>
//                       <p className="text-xs">
//                         This site is protected by reCAPTCHA and the
//                         <a
//                           href="#"
//                           className={`underline ${
//                             theme === "dark" ? "text-gray-300" : "text-gray-700"
//                           }`}
//                         >
//                           Google Privacy Policy
//                         </a>
//                         and
//                         <a
//                           href="#"
//                           className={`underline ${
//                             theme === "dark" ? "text-gray-300" : "text-gray-700"
//                           }`}
//                         >
//                           Terms of Service
//                         </a>
//                         apply.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

interface SSETry {
  username?: boolean;
  registerUrl?: string;
}

export const SignIn = ({ username = false, registerUrl }: SSETry) => {
  const { signIn, providers, options } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute("class", options?.theme ?? "dark");
    document.documentElement.setAttribute("lang", "en");
    document.documentElement.setAttribute("data-palette", "tls");
    document.documentElement.setAttribute("data-shade", "900");
    document.documentElement.setAttribute("data-rounded", "2xlarge");

    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.classList.add(
        "antialiased",
        "bg-gray-50",
        "dark:[--body-text-color:theme(colors.gray.300)]",
        "dark:bg-gray-950",
        "font-sans"
      );
    }
    // document.body.classList.add(
    //   "antialiased",
    //   "bg-gray-50",
    //   "dark:[--body-text-color:theme(colors.gray.300)]",
    //   "dark:bg-gray-950",
    //   "font-sans"
    // );
  }, []);

  const renderProviderButtons = () => {
    if (!providers) {
      return null; // Return null if providers is not available
    }

    return Object.keys(providers).map((providerKey) => {
      const provider = providers[providerKey as keyof typeof providers];

      if (provider) {
        return (
          <Button.Root
            key={providerKey}
            variant="outlined"
            intent="gray"
            size="sm"
            className={`w-full ${username && "mt-2 mb-2"}`}
            onClick={() => signIn(providerKey as keyof ProviderContextMap)}
          >
            <Button.Icon type="leading" size="xs">
              <div dangerouslySetInnerHTML={{ __html: GithubIcon }} />
            </Button.Icon>
            <Button.Label>{providerKey}</Button.Label>
          </Button.Root>
        );
      }
    });
  };

  return (
    <main className="inset-0 z-10 m-auto h-fit max-w-md px-6 py-12 lg:absolute">
      <Card
        className="relative h-fit p-1 shadow-xl shadow-gray-950/10"
        variant="mixed"
      >
        <div data-rounded="large" className="p-10">
          <div>
            <Title size="xl" className="mb-1">
              Sign In to {options?.site?.name ?? "SSE Auth"}
            </Title>
            <Text className="my-0" size="sm">
              Welcome back! Sign in to continue
            </Text>
          </div>
          <div className={`mt-6 ${username ? "grid grid-cols-2 gap-3" : null}`}>
            {renderProviderButtons()}
          </div>

          {username && (
            <form className="mx-auto mt-8 space-y-6">
              <div className="space-y-6 rounded-[--btn-radius] shadow-sm shadow-gray-500/5">
                <div className="relative my-6 grid items-center gap-3 [grid-template-columns:1fr_auto_1fr]">
                  <Separator className="h-px border-b" />
                  <Caption as="span" className="block" size="sm">
                    Or continue with
                  </Caption>
                  <Separator className="h-px border-b" />
                </div>

                <div className="space-y-6">
                  <div className="space-y-2.5">
                    <Label size="sm" htmlFor="email">
                      Your email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      variant="outlined"
                      size="md"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <Label size="sm" htmlFor="password">
                        Your Password
                      </Label>
                      <Link href="#" size="sm">
                        Forgot your Password ?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      variant="outlined"
                      size="md"
                    />
                  </div>
                </div>
              </div>

              <Button.Root className="w-full">
                <Button.Label>Sign In</Button.Label>
              </Button.Root>
            </form>
          )}
        </div>
      </Card>
      <Card
        variant="soft"
        data-shade="925"
        className="rounded-[calc(var(--card-radius)-0.25rem)] dark:bg-gray-925"
      >
        <Caption className="my-0" size="sm" align="center">
          Don't have an account ?{" "}
          <Link
            intent="neutral"
            size="sm"
            variant="underlined"
            href={registerUrl ?? "/register"}
          >
            Create account
          </Link>
        </Caption>
      </Card>
    </main>
  );
};