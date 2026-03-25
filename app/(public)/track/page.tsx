'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isValidTrackingId } from '@/lib/tracking-id';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search } from 'lucide-react';

export default function TrackPage() {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    if (!isValidTrackingId(trackingId.toUpperCase())) {
      setError('Invalid tracking ID format');
      return;
    }

    router.push(`/track/${trackingId.toUpperCase()}`);
  };

  return (
    <main className="flex-1 flex items-center justify-center bg-muted/40 p-4">
         <Card className="w-full max-w-lg shadow-lg border-primary/10">
            <CardHeader className="text-center space-y-4 pb-8">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <Search className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-display font-bold text-primary">Track Your Shipment</CardTitle>
                <CardDescription className="text-base">Enter your tracking ID to see the current status and location of your package.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <div className="relative">
                            <Input 
                                placeholder="Enter Tracking ID (e.g. GUL-1234-5678)" 
                                className="h-14 pl-12 text-lg shadow-sm border-primary/20 focus-visible:ring-primary"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                            />
                            <Search className="absolute left-4 top-4.5 h-5 w-5 text-muted-foreground" />
                        </div>
                        {error && <p className="text-sm text-destructive font-medium px-1">{error}</p>}
                    </div>
                    <Button type="submit" size="lg" className="w-full h-12 text-lg font-semibold shadow-md">
                        Track Package
                    </Button>
                </form>
            </CardContent>
         </Card>
    </main>
  );
}
