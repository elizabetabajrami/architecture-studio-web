import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../backend/models/User";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/architectureDB";

async function connectMongo() {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(MONGODB_URI);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) return null;

        await connectMongo();

        const user = await User.findOne({ email });

        if (!user) return null;

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
