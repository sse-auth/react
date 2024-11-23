import type { D1Database } from "./index.js";

export const upSQLStatements = [
  `CREATE TABLE IF NOT EXISTS "sse-accounts" (
    "id" text NOT NULL,
    "userId" text NOT NULL DEFAULT NULL,
    "type" text NOT NULL DEFAULT NULL,
    "provider" text NOT NULL DEFAULT NULL,
    "providerAccountId" text NOT NULL DEFAULT NULL,
    "refresh_token" text DEFAULT NULL,
    "access_token" text DEFAULT NULL,
    "expires_at" number DEFAULT NULL,
    "token_type" text DEFAULT NULL,
    "scope" text DEFAULT NULL,
    "id_token" text DEFAULT NULL,
    "session_state" text DEFAULT NULL,
    "oauth_token_secret" text DEFAULT NULL,
    "oauth_token" text DEFAULT NULL,
    PRIMARY KEY (id)
);`,
  `CREATE TABLE IF NOT EXISTS "sse-sessions" (
    "id" text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL DEFAULT NULL,
    "expires" datetime NOT NULL DEFAULT NULL, 
    PRIMARY KEY (sessionToken)
);`,
  `CREATE TABLE IF NOT EXISTS "sse-users" (
    "id" text NOT NULL DEFAULT '',
    "name" text DEFAULT NULL,
    "email" text DEFAULT NULL,
    "emailVerified" datetime DEFAULT NULL,
    "image" text DEFAULT NULL, 
    PRIMARY KEY (id)
);`,
  `CREATE TABLE IF NOT EXISTS "sse-verification_tokens" (
    "identifier" text NOT NULL,
    "token" text NOT NULL DEFAULT NULL,
    "expires" datetime NOT NULL DEFAULT NULL, 
    PRIMARY KEY (token)
);`,
];

export const down = [
  `DROP TABLE IF EXISTS "sse-accounts";`,
  `DROP TABLE IF EXISTS "sse-sessions";`,
  `DROP TABLE IF EXISTS "sse-users";`,
  `DROP TABLE IF EXISTS "sse-verification_tokens";`,
];

async function up(db: D1Database) {
  upSQLStatements.forEach(async (sql) => {
    try {
      await db.prepare(sql).run();
    } catch (e: any) {
      console.error(e.cause?.message, e.message);
    }
  });
}

export { up };
