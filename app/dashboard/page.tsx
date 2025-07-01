
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin-dashboard';
import { ConsultantDashboard } from '@/components/consultant-dashboard';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {session.user.role === 'ADMIN' ? (
        <AdminDashboard />
      ) : (
        <ConsultantDashboard consultantId={session.user.id} />
      )}
    </div>
  );
}
