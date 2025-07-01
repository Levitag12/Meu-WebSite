
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/logout-button';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Document Management System
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome, {session.user.name} ({session.user.role})
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
