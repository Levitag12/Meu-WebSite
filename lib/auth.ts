import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs"; // ou bcrypt, se estiver usando esse pacote

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        // Busca usuário no banco
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .then((res) => res[0]);

        if (!user) {
          throw new Error("No user found");
        }

        // Compara senha
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return { id: user.id, email: user.email };
      },
    }),
  ],
};

export default NextAuth(authOptions);
