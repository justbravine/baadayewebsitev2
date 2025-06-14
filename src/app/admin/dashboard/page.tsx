'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminLayout } from '@/components/admin-layout/admin-layout';
import { RequestCard } from '@/components/request-card';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  loanAmount: string;
  loanDuration: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date | { toDate: () => Date };
}

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Application['status']>('all');
  const [showResolved, setShowResolved] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if admin token exists
    const checkAuth = async () => {
      try {
        console.log('Checking auth status...')
        const response = await fetch('/api/admin/verify', {
          credentials: 'include', // Important: include cookies in the request
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        console.log('Auth check response:', response.status)
        
        if (!response.ok) {
          console.log('Auth check failed, redirecting to login')
          router.replace('/admin/login')
          return
        }
        
        const data = await response.json()
        console.log('Auth check response data:', data)
        
        if (!data.valid) {
          console.log('Token invalid, redirecting to login')
          router.replace('/admin/login')
          return
        }
        
        console.log('Auth check successful')
        setAuthChecked(true)
      } catch (error) {
        console.error('Auth check error:', error)
        router.replace('/admin/login')
        return
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    if (!authChecked) return; // Don't load data until auth is checked

    setLoading(true);
    setError(null);

    const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Application[];
      
      setApplications(apps);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching applications:', error);
      setError('Failed to load applications. Please try again.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authChecked]);

  const handleStatusUpdate = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      setUpdating(id);
      await updateDoc(doc(db, 'applications', id), {
        status,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      setError('Failed to update application status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include', // Important: include cookies in the request
      });
      
      if (response.ok) {
        router.replace('/admin/login');
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const filteredApplications = applications.filter(app => {
    const fullName = `${app.firstName} ${app.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesResolved = showResolved || app.status === 'pending';
    return matchesSearch && matchesStatus && matchesResolved;
  });

  if (!authChecked) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Verifying authentication...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-destructive mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Loan Applications</h1>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Sign Out</span>
            </motion.button>
          </div>
          
          {/* Filters */}
          <div className="mb-6">
            <div className="glass-card border border-border/50 p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-foreground mb-1">
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="search"
                      className="input-field w-full pl-10 bg-background/50"
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-foreground mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    className="input-field w-full bg-background/50"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | Application['status'])}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Show Resolved
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={() => setShowResolved(!showResolved)}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                        showResolved ? "bg-primary" : "bg-gray-200"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          showResolved ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {showResolved ? 'Showing all' : 'Pending only'}
                    </span>
                  </div>
                </div>
                <div className="flex items-end">
                  <div className="bg-primary/10 p-3 rounded-lg w-full border border-primary/20">
                    <p className="text-sm text-primary">
                      <span className="font-medium">{filteredApplications.length}</span> {filteredApplications.length === 1 ? 'application' : 'applications'} found
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {loading ? (
              <div className="glass-card border border-border/50 p-8 text-center">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                </div>
                <p className="mt-4 text-muted-foreground">Loading applications...</p>
              </div>
            ) : error ? (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-destructive" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-destructive-foreground">Error loading applications</h3>
                    <div className="mt-2 text-sm text-destructive-foreground/80">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="glass-card border border-border/50 p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-foreground">No applications found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredApplications.map((app) => (
                  <RequestCard
                    key={app.id}
                    id={app.id}
                    firstName={app.firstName}
                    lastName={app.lastName}
                    email={app.email}
                    phone={app.phone}
                    location={app.location}
                    loanAmount={app.loanAmount}
                    loanDuration={app.loanDuration}
                    status={app.status}
                    submittedAt={app.createdAt}
                    onStatusUpdate={handleStatusUpdate}
                    isUpdating={updating === app.id}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
