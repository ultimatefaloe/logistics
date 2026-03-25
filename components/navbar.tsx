'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-background sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        <Link href="/" className="font-display text-2xl font-bold text-primary flex items-center gap-2">
          <span>Global Ultra</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/track" className="text-sm font-medium hover:text-primary transition-colors">
            Track
          </Link>
          <div className="flex items-center gap-4 ml-4">
             <Link href="/login">
               <Button variant="ghost">Login</Button>
             </Link>
             <Link href="/register">
               <Button>Get Started</Button>
             </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
           {isMenuOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
        </Button>
      </div>

       {/* Mobile Menu */}
       {isMenuOpen && (
         <div className="md:hidden border-t bg-background p-4 space-y-4">
            <Link href="/" className="block text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="/track" className="block text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Track Shipment
            </Link>
             <div className="grid gap-2 pt-4 border-t">
               <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                 <Button variant="outline" className="w-full">Login</Button>
               </Link>
               <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                 <Button className="w-full">Get Started</Button>
               </Link>
             </div>
         </div>
       )}
    </nav>
  );
}
