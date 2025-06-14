import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { LoginForm } from './login-form';
import Link from 'next/link';

interface Application {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
}

async function getApplications() {
  const applicationsRef = collection(db, 'applications');
  const q = query(applicationsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Application[];
}

export default async function AdminPage() {
  const applications = await getApplications();

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-card border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center group">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Baadaye
              </span>
              <span className="text-sm text-muted-foreground ml-2 group-hover:text-primary transition-colors duration-300">
                powered by <span className="font-semibold">LIT</span>
              </span>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/admin/login" 
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                Admin Login
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <LoginForm />
      <main className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Applications</h1>
        <div className="space-y-4">
          {applications.length === 0 ? (
            <p className="text-slate-400 italic">No applications yet.</p>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="bg-slate-800 p-4 rounded-xl shadow border border-slate-700">
                <h2 className="text-lg font-semibold">{app.fullName}</h2>
                <p className="text-sm text-slate-400">{app.email} • {app.phoneNumber}</p>
                <p className="text-xs text-slate-500 mt-1">Status: {app.status}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
} 