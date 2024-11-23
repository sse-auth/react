export function PrismaAdapter(prisma) {
    const p = prisma;
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
            return account?.user ?? null;
        },
        updateUser: ({ id, ...data }) => p.sSEUser.update({
            where: { id },
            ...stripUndefined(data),
        }),
        deleteUser: (id) => p.sSEUser.delete({ where: { id } }),
        linkAccount: (data) => p.sSEAccount.create({ data }),
        unlinkAccount: (provider_providerAccountId) => p.sSEAccount.delete({
            where: { provider_providerAccountId },
        }),
        async getSessionAndUser(sessionToken) {
            const userAndSession = await p.sSESession.findUnique({
                where: { sessionToken },
                include: { user: true },
            });
            if (!userAndSession)
                return null;
            const { user, ...session } = userAndSession;
            return { user, session };
        },
        createSession: (data) => p.sSESession.create(stripUndefined(data)),
        updateSession: (data) => p.sSESession.update({
            where: { sessionToken: data.sessionToken },
            ...stripUndefined(data),
        }),
        deleteSession: (sessionToken) => p.sSESession.delete({ where: { sessionToken } }),
        async createVerificationToken(data) {
            const verificationToken = await p.sSEVerificationToken.create(stripUndefined(data));
            // @ts-expect-errors // MongoDB needs an ID, but we don't
            if (verificationToken.id)
                delete verificationToken.id;
            return verificationToken;
        },
        async useVerificationToken(identifier_token) {
            try {
                const verificationToken = await p.sSEVerificationToken.delete({
                    where: { identifier_token },
                });
                // @ts-expect-errors // MongoDB needs an ID, but we don't
                if (verificationToken.id)
                    delete verificationToken.id;
                return verificationToken;
            }
            catch (error) {
                // If token already used/deleted, just return null
                // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
                if (error.code === "P2025")
                    return null;
                throw error;
            }
        },
        async getAccount(providerAccountId, provider) {
            return p.sSEAccount.findFirst({
                where: { providerAccountId, provider },
            });
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
function stripUndefined(obj) {
    const data = {};
    for (const key in obj)
        if (obj[key] !== undefined)
            data[key] = obj[key];
    return { data };
}
