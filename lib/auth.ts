import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import { schema } from "@/drizzle/schema";
import { nextCookies } from "better-auth/next-js";
// we need to hook up drizzle and better-auth as well as the database
// import the schema created by better auth and pushing to db
export const auth=betterAuth({
    database: drizzleAdapter(db, {provider: 'pg', schema}),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }
    },
    plugins: [nextCookies()],
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
})
// after pushing database  