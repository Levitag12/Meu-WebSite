import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  if (session.user.role === 'ADMIN' || session.user.role === 'CONSULTANT') {
    redirect('/dashboard');
  }
}