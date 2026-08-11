import { cookies } from 'next/headers';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('auth')?.value === 'true';

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Fetch logs ordered by most recent
  const logs = await prisma.deviceLog.findMany({
    orderBy: {
      timestamp: 'desc',
    },
    take: 100, // Limit to recent 100 to prevent performance issues
  });

  return <Dashboard logs={logs} />;
}
