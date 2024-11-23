"use strict";
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                    }
                    else s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = exports.defaultCollections = void 0;
exports._id = _id;
exports.MongoDBAdapter = MongoDBAdapter;
const mongodb_1 = require("mongodb");
// @ts-expect-error
Symbol.asyncDispose ?? (Symbol.asyncDispose = Symbol("Symbol.asyncDispose"));
exports.defaultCollections = {
    Users: "sse-users",
    Accounts: "sse-accounts",
    Sessions: "sse-sessions",
    VerificationTokens: "sse-verification_tokens",
};
exports.format = {
    from(object) {
        const newObject = {};
        for (const key in object) {
            const value = object[key];
            if (key === "_id") {
                newObject.id = value.toHexString();
            }
            else if (key === "userId") {
                newObject[key] = value.toHexString();
            }
            else {
                newObject[key] = value;
            }
        }
        return newObject;
    },
    to(object) {
        const newObject = {
            _id: _id(object.id),
        };
        for (const key in object) {
            const value = object[key];
            if (key === "userId")
                newObject[key] = _id(value);
            else if (key === "id")
                continue;
            else
                newObject[key] = value;
        }
        return newObject;
    },
};
function _id(hex) {
    if (hex?.length !== 24)
        return new mongodb_1.ObjectId();
    return new mongodb_1.ObjectId(hex);
}
function MongoDBAdapter(client, options = {}) {
    const { collections } = options;
    const { from, to } = exports.format;
    const getDb = async () => {
        const _client = await (typeof client === "function"
            ? client()
            : client);
        const _db = _client.db(options.databaseName);
        const c = { ...exports.defaultCollections, collections };
        return {
            U: _db.collection(c.Users),
            A: _db.collection(c.Accounts),
            S: _db.collection(c.Sessions),
            V: _db.collection(c?.VerificationTokens),
            [Symbol.asyncDispose]: async () => {
                await options.onClose?.(_client);
            },
        };
    };
    return {
        async createUser(data) {
            const env_1 = { stack: [], error: void 0, hasError: false };
            try {
                const user = to(data);
                const db = __addDisposableResource(env_1, await getDb(), true);
                await db.U.insertOne(user);
                return from(user);
            }
            catch (e_1) {
                env_1.error = e_1;
                env_1.hasError = true;
            }
            finally {
                const result_1 = __disposeResources(env_1);
                if (result_1)
                    await result_1;
            }
        },
        async getUser(id) {
            const env_2 = { stack: [], error: void 0, hasError: false };
            try {
                const db = __addDisposableResource(env_2, await getDb(), true);
                const user = await db.U.findOne({ _id: _id(id) });
                if (!user)
                    return null;
                return from(user);
            }
            catch (e_2) {
                env_2.error = e_2;
                env_2.hasError = true;
            }
            finally {
                const result_2 = __disposeResources(env_2);
                if (result_2)
                    await result_2;
            }
        },
        async getUserByEmail(email) {
            const env_3 = { stack: [], error: void 0, hasError: false };
            try {
                const db = __addDisposableResource(env_3, await getDb(), true);
                const user = await db.U.findOne({ email });
                if (!user)
                    return null;
                return from(user);
            }
            catch (e_3) {
                env_3.error = e_3;
                env_3.hasError = true;
            }
            finally {
                const result_3 = __disposeResources(env_3);
                if (result_3)
                    await result_3;
            }
        },
        async getUserByAccount(provider_providerAccountId) {
            const env_4 = { stack: [], error: void 0, hasError: false };
            try {
                const db = __addDisposableResource(env_4, await getDb(), true);
                const account = await db.A.findOne(provider_providerAccountId);
                if (!account)
                    return null;
                const user = await db.U.findOne({ _id: new mongodb_1.ObjectId(account.userId) });
                if (!user)
                    return null;
                return from(user);
            }
            catch (e_4) {
                env_4.error = e_4;
                env_4.hasError = true;
            }
            finally {
                const result_4 = __disposeResources(env_4);
                if (result_4)
                    await result_4;
            }
        },
        async updateUser(data) {
            const env_5 = { stack: [], error: void 0, hasError: false };
            try {
                const { _id, ...user } = to(data);
                const db = __addDisposableResource(env_5, await getDb(), true);
                const result = await db.U.findOneAndUpdate({ _id }, { $set: user }, { returnDocument: "after" });
                return from(result);
            }
            catch (e_5) {
                env_5.error = e_5;
                env_5.hasError = true;
            }
            finally {
                const result_5 = __disposeResources(env_5);
                if (result_5)
                    await result_5;
            }
        },
        async deleteUser(id) {
            const env_6 = { stack: [], error: void 0, hasError: false };
            try {
                const userId = _id(id);
                const db = __addDisposableResource(env_6, await getDb(), true);
                await Promise.all([
                    db.A.deleteMany({ userId: userId }),
                    db.S.deleteMany({ userId: userId }),
                    db.U.deleteOne({ _id: userId }),
                ]);
            }
            catch (e_6) {
                env_6.error = e_6;
                env_6.hasError = true;
            }
            finally {
                const result_6 = __disposeResources(env_6);
                if (result_6)
                    await result_6;
            }
        },
        linkAccount: async (data) => {
            const env_7 = { stack: [], error: void 0, hasError: false };
            try {
                const account = to(data);
                const db = __addDisposableResource(env_7, await getDb(), true);
                await db.A.insertOne(account);
                return account;
            }
            catch (e_7) {
                env_7.error = e_7;
                env_7.hasError = true;
            }
            finally {
                const result_7 = __disposeResources(env_7);
                if (result_7)
                    await result_7;
            }
        },
        async unlinkAccount(provider_providerAccountId) {
            const env_8 = { stack: [], error: void 0, hasError: false };
            try {
                const db = __addDisposableResource(env_8, await getDb(), true);
                const account = await db.A.findOneAndDelete(provider_providerAccountId);
                return from(account);
            }
            catch (e_8) {
                env_8.error = e_8;
                env_8.hasError = true;
            }
            finally {
                const result_8 = __disposeResources(env_8);
                if (result_8)
                    await result_8;
            }
        },
        async getSessionAndUser(sessionToken) {
            const env_9 = { stack: [], error: void 0, hasError: false };
            try {
                const db = __addDisposableResource(env_9, await getDb(), true);
                const session = await db.S.findOne({ sessionToken });
                if (!session)
                    return null;
                const user = await db.U.findOne({ _id: new mongodb_1.ObjectId(session.userId) });
                if (!user)
                    return null;
                return {
                    user: from(user),
                    session: from(session),
                };
            }
            catch (e_9) {
                env_9.error = e_9;
                env_9.hasError = true;
            }
            finally {
                const result_9 = __disposeResources(env_9);
                if (result_9)
                    await result_9;
            }
        },
        async createSession(data) {
            const env_10 = { stack: [], error: void 0, hasError: false };
            try {
                const session = to(data);
                const db = __addDisposableResource(env_10, await getDb(), true);
                await db.S.insertOne(session);
                return from(session);
            }
            catch (e_10) {
                env_10.error = e_10;
                env_10.hasError = true;
            }
            finally {
                const result_10 = __disposeResources(env_10);
                if (result_10)
                    await result_10;
            }
        },
        async updateSession(data) {
            const env_11 = { stack: [], error: void 0, hasError: false };
            try {
                const { _id, ...session } = to(data);
                const db = __addDisposableResource(env_11, await getDb(), true);
                const updatedSession = await db.S.findOneAndUpdate({ sessionToken: session.sessionToken }, { $set: session }, { returnDocument: "after" });
                return from(updatedSession);
            }
            catch (e_11) {
                env_11.error = e_11;
                env_11.hasError = true;
            }
            finally {
                const result_11 = __disposeResources(env_11);
                if (result_11)
                    await result_11;
            }
        },
        async deleteSession(sessionToken) {
            const env_12 = { stack: [], error: void 0, hasError: false };
            try {
                const db = __addDisposableResource(env_12, await getDb(), true);
                const session = await db.S.findOneAndDelete({
                    sessionToken,
                });
                return from(session);
            }
            catch (e_12) {
                env_12.error = e_12;
                env_12.hasError = true;
            }
            finally {
                const result_12 = __disposeResources(env_12);
                if (result_12)
                    await result_12;
            }
        },
        async createVerificationToken(data) {
            const env_13 = { stack: [], error: void 0, hasError: false };
            try {
                const db = __addDisposableResource(env_13, await getDb(), true);
                await db.V.insertOne(to(data));
                return data;
            }
            catch (e_13) {
                env_13.error = e_13;
                env_13.hasError = true;
            }
            finally {
                const result_13 = __disposeResources(env_13);
                if (result_13)
                    await result_13;
            }
        },
        async useVerificationToken(identifier_token) {
            const env_14 = { stack: [], error: void 0, hasError: false };
            try {
                const db = __addDisposableResource(env_14, await getDb(), true);
                const verificationToken = await db.V.findOneAndDelete(identifier_token);
                if (!verificationToken)
                    return null;
                const { _id, ...rest } = verificationToken;
                return rest;
            }
            catch (e_14) {
                env_14.error = e_14;
                env_14.hasError = true;
            }
            finally {
                const result_14 = __disposeResources(env_14);
                if (result_14)
                    await result_14;
            }
        },
    };
}
