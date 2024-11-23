import { ObjectId } from "mongodb";
import { Adapter } from "@sse-auth/adapter-core";
import type { MongoClient } from "mongodb";
export interface MongoDBAdapterOptions {
    collections?: {
        Users?: string;
        Accounts?: string;
        Sessions?: string;
        VerificationTokens?: string;
    };
    databaseName?: string;
    onClose?: (client: MongoClient) => Promise<void>;
}
export declare const defaultCollections: Required<Required<MongoDBAdapterOptions>["collections"]>;
export declare const format: {
    from<T = Record<string, unknown>>(object: Record<string, any>): T;
    to<T = Record<string, unknown>>(object: Record<string, any>): T & {
        _id: ObjectId;
    };
};
export declare function _id(hex?: string): ObjectId;
export declare function MongoDBAdapter(client: MongoClient | Promise<MongoClient> | (() => MongoClient | Promise<MongoClient>), options?: MongoDBAdapterOptions): Adapter;
//# sourceMappingURL=index.d.ts.map