
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin-dashboard';
import ConsultantDashboard from '@/components/consultant-dashboard';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      {session.user.role === 'ADMIN' ? (
        <AdminDashboard />
      ) : (
        <ConsultantDashboard userId={session.user.id} />
      )}
    </div>
  );
}
