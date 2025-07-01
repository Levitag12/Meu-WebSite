import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = 'nodejs'; // forçar server runtime, evita erros no edge

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
