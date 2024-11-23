/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px"}}>
 *  <p>An official <a href="https://azure.microsoft.com/en-us/products/storage/tables">Azure Table Storage</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://azure.microsoft.com/en-us/products/storage/tables">
 *   <img style={{display: "block"}} src="/img/adapters/azure-tables.svg" width="48" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @sse-auth/react @sse-auth/a-azure-tables
 * ```
 *
 * @module @sse-auth/a-azure-tables
 */
import type { Adapter } from "@sse-auth/adapter-core";
import { GetTableEntityResponse, TableClient, TableEntityResult } from "@azure/data-tables";
export declare const keys: {
    user: string;
    userByEmail: string;
    account: string;
    accountByUserId: string;
    session: string;
    sessionByUserId: string;
    verificationToken: string;
};
export declare function withoutKeys<T>(entity: GetTableEntityResponse<TableEntityResult<T>>): T;
export declare const TableStorageAdapter: (client: TableClient) => Adapter;
//# sourceMappingURL=index.d.ts.map