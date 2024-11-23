/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  Official <a href="https://www.prisma.io/docs">Prisma</a> adapter for Auth.js / NextAuth.js.
 *  <a href="https://www.prisma.io/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/prisma.svg" width="38" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @prisma/client @sse-auth/aprisma
 * npm install prisma --save-dev
 * ```
 *
 * @module @sse-auth/aprisma
 */
import type { Adapter, AdapterAccount } from "@sse-auth/adapter-core";
import type { AdapterSession, AdapterUser } from "@sse-auth/adapter-core";
import type { PrismaClient, Prisma } from "@prisma/client";

export function PrismaAdapter(
  prisma: PrismaClient | ReturnType<PrismaClient["$extends"]>
): Adapter {
  const p = prisma as PrismaClient;
  return {
    // We need to let Prisma generate the ID because our default UUID is incompatible with MongoDB
    createUser: ({ id, ...data }) => p.sSEUser.create(stripUndefined(data)),
    getUser: (id) => p.sSEUser.findUnique({ where: { id } }),
    getUserByEmail: (email) => p.sSEUser.findUnique({ where: { email } }),
    async getUserByAccount(provider_providerAccountId) {
      const account = await p.sSEAccount.findUnique({
        where: { provider_providerAccountId },
        select: { user: true },
      });
      return (account?.user as AdapterUser) ?? null;
    },
    updateUser: ({ id, ...data }) =>
      p.sSEUser.update({
        where: { id },
        ...stripUndefined(data),
      }) as Promise<AdapterUser>,
    deleteUser: (id) =>
      p.sSEUser.delete({ where: { id } }) as Promise<AdapterUser>,
    linkAccount: (data) =>
      p.sSEAccount.create({ data }) as unknown as AdapterAccount,
    unlinkAccount: (provider_providerAccountId) =>
      p.sSEAccount.delete({
        where: { provider_providerAccountId },
      }) as unknown as AdapterAccount,
    async getSessionAndUser(sessionToken) {
      const userAndSession = await p.sSESession.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!userAndSession) return null;
      const { user, ...session } = userAndSession;
      return { user, session } as {
        user: AdapterUser;
        session: AdapterSession;
      };
    },
    createSession: (data) => p.sSESession.create(stripUndefined(data)),
    updateSession: (data) =>
      p.sSESession.update({
        where: { sessionToken: data.sessionToken },
        ...stripUndefined(data),
      }),
    deleteSession: (sessionToken) =>
      p.sSESession.delete({ where: { sessionToken } }),
    async createVerificationToken(data) {
      const verificationToken = await p.sSEVerificationToken.create(
        stripUndefined(data)
      );
      // @ts-expect-errors // MongoDB needs an ID, but we don't
      if (verificationToken.id) delete verificationToken.id;
      return verificationToken;
    },
    async useVerificationToken(identifier_token) {
      try {
        const verificationToken = await p.sSEVerificationToken.delete({
          where: { identifier_token },
        });
        // @ts-expect-errors // MongoDB needs an ID, but we don't
        if (verificationToken.id) delete verificationToken.id;
        return verificationToken;
      } catch (error) {
        // If token already used/deleted, just return null
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025")
          return null;
        throw error;
      }
    },
    async getAccount(providerAccountId, provider) {
      return p.sSEAccount.findFirst({
        where: { providerAccountId, provider },
      }) as Promise<AdapterAccount | null>;
    },
    async createAuthenticator(data) {
      return p.sSEAuthenticator.create(stripUndefined(data));
    },
    async getAuthenticator(credentialID) {
      return p.sSEAuthenticator.findUnique({
        where: { credentialID },
      });
    },
    async listAuthenticatorsByUserId(userId) {
      return p.sSEAuthenticator.findMany({
        where: { userId },
      });
    },
    async updateAuthenticatorCounter(credentialID, counter) {
      return p.sSEAuthenticator.update({
        where: { credentialID },
        data: { counter },
      });
    },
  };
}

/** @see https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/null-and-undefined */
function stripUndefined<T>(obj: T) {
  const data = {} as T;
  for (const key in obj) if (obj[key] !== undefined) data[key] = obj[key];
  return { data };
}
