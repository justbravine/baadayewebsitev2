import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { LoginForm } from './login-form';

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