import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prismadb";

import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NEXTAUTH_SECRET,
  DOMAIN,
} from "../../../constants/index";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token, user }) {
      return { ...session, user: { ...session.user, ...user } };
    },
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        domain : [process.env.NODE_ENV === "production" ? DOMAIN : "localhost" , 'nexttalk.vercel.app'],
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    }
  }
});
