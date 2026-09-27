'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { assessmentApi } from '@/lib/api/assessments';
import { useConnectivity } from '@/hooks/use-connectivity';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('healthworker1');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { status, mounted } = useConnectivity();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check health endpoint to verify backend connectivity
      const reachable = await assessmentApi.healthCheck();
      if (!reachable) {
        throw new Error('Backend health check returned non-OK status.');
      }
      sessionStorage.setItem('authenticated', 'true');
      router.push('/dashboard');
    } catch {
      setError('Backend server is not reachable on port 8080. You can start it with "mvn spring-boot:run" or continue in Offline Demo Mode below.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOfflineBypass = () => {
    sessionStorage.setItem('authenticated', 'offline');
    router.push('/dashboard');
  };

  const getConnectivityText = () => {
    if (!mounted) return 'Backend: ● Checking...';
    switch (status) {
      case 'online': return 'Backend: ● Connected';
      case 'offline': return 'Backend: ● Offline';
      case 'backend-down': return 'Backend: ● Server Unreachable';
      default: return 'Backend: ● Checking...';
    }
  };

  const getConnectivityColor = () => {
    if (!mounted) return 'text-slate-400';
    switch (status) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-red-600';
      case 'backend-down': return 'text-yellow-600';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-teal-50 p-3 rounded-full border border-teal-100">
              <svg className="w-12 h-12 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-teal-900 tracking-tight">OsteoSense</h1>
          <p className="text-slate-500 font-medium">AI-Assisted OA Risk Screening</p>
        </div>

        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center">Healthcare Worker Login</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access the screening system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="space-y-3 mb-4">
                  <Alert variant="warning" title="Connection Note">
                    {error}
                  </Alert>
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    onClick={handleOfflineBypass}
                    className="border-teal-600 text-teal-700 hover:bg-teal-50"
                  >
                    Enter Dashboard in Offline Mode &rarr;
                  </Button>
                </div>
              )}
              
              <div className="space-y-4">
                <Input
                  label="Username"
                  type="text"
                  placeholder="e.g. healthworker1"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="pt-2 space-y-2">
                <Button 
                  type="submit" 
                  fullWidth 
                  size="lg"
                  loading={isLoading}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-semibold"
                >
                  {isLoading ? 'Authenticating...' : 'Sign In'}
                </Button>

                <div className="text-center pt-2">
                  <Link 
                    href="/dashboard" 
                    className="text-xs text-teal-700 hover:text-teal-900 font-medium hover:underline inline-flex items-center gap-1"
                  >
                    Direct link to Main Dashboard &rarr;
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="w-full p-3 bg-teal-50 text-teal-900 text-xs rounded-md border border-teal-100">
              <span className="font-semibold">CHW Portal</span> — Offline-first screening active. Pre-filled with demo credentials for instant access.
            </div>
            <div className="text-center w-full">
              <span suppressHydrationWarning className={cn("text-xs font-medium", getConnectivityColor())}>
                {getConnectivityText()}
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
