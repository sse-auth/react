import { useAuth } from "../../context/AuthContext";
import Card from "../tailus-ui/Card";
import Button from "../tailus-ui/Button";
import Label from "../tailus-ui/Label";
import Input from "../tailus-ui/Input";
import Separator from "../tailus-ui/Separator";
import { Text, Link, Caption, Title } from "../tailus-ui/typography";
import { FaGithub, FaGoogle, FaBattleNet, FaAws, FaDiscord, FaFacebook } from "@sse-auth/icons/fa6";
import { ProviderContextMap } from "../../types";
import { useEffect } from "react";

interface SSETry {
  username?: boolean;
  registerUrl?: string;
}

export const SignIn = ({ username = false, registerUrl }: SSETry) => {
  const { signIn, providers, options } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute("data-palette", "energy");
    document.documentElement.classList.add(options?.theme ?? "dark");
    document.body.classList.add("bg-white", "dark:bg-gray-925");
    document.body.setAttribute("data-shade", "900");
    document.body.setAttribute("data-rounded", "large");
  });

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
            {providerKey.toLowerCase() === "google" && (
              <Button.Icon type="leading" size="xs">
                <FaGoogle />
              </Button.Icon>
            )}
            {providerKey.toLowerCase() === "github" && (
              <Button.Icon type="leading" size="xs">
                <FaGithub />
              </Button.Icon>
            )}
            {providerKey.toLowerCase() === "battledotnet" && (
              <Button.Icon type="leading" size="xs">
                <FaBattleNet />
              </Button.Icon>
            )}
            {providerKey.toLowerCase() === "cognito" && (
              <Button.Icon type="leading" size="xs">
                <FaAws />
              </Button.Icon>
            )}
            {providerKey.toLowerCase() === "discord" && (
              <Button.Icon type="leading" size="xs">
                <FaDiscord />
              </Button.Icon>
            )}
            {providerKey.toLowerCase() === "facebook" && (
              <Button.Icon type="leading" size="xs">
                <FaFacebook />
              </Button.Icon>
            )}
            {providerKey.toLowerCase() === "" && (
              <Button.Icon type="leading" size="xs">
              </Button.Icon>
            )}
            {providerKey.toLowerCase() === "" && (
              <Button.Icon type="leading" size="xs">
              </Button.Icon>
            )}
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
            <div
              className={`mt-6 ${username ? "grid grid-cols-2 gap-3" : null}`}
            >
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
        </Card>
      </main>
  );
};
