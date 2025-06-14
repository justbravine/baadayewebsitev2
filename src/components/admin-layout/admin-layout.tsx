import Link from 'next/link';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AdminLayout({ children, className = '' }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
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

      {/* Main Content */}
      <main className={`flex-1 ${className}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Baadaye. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link 
                href="/privacy" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
