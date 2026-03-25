'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-primary text-white sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-primary/95">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        <Link href="/" className="font-display text-2xl font-bold text-white flex items-center gap-2">
          <span>Global Ultra</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-white hover:text-secondary transition-colors">
            Home
          </Link>
          <Link href="/track" className="text-sm font-medium text-white hover:text-secondary transition-colors">
            Track
          </Link>
          <div className="flex items-center gap-4 ml-4">
             <Link href="/login">
               <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-secondary">Login</Button>
             </Link>
             <Link href="/register">
               <Button variant="secondary">Get Started</Button>
             </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10" onClick={() => setIsMenuOpen(!isMenuOpen)}>
           {isMenuOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
        </Button>
      </div>

       {/* Mobile Menu */}
       {isMenuOpen && (
         <div className="md:hidden border-t bg-primary text-white p-4 space-y-4">
            <Link href="/" className="block text-sm font-medium hover:text-secondary" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="/track" className="block text-sm font-medium hover:text-secondary" onClick={() => setIsMenuOpen(false)}>
              Track Shipment
            </Link>
             <div className="grid gap-2 pt-4 border-t border-white/10">
               <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                 <Button variant="ghost" className="w-full text-white hover:bg-white/10">Login</Button>
               </Link>
               <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                 <Button variant="secondary" className="w-full">Get Started</Button>
               </Link>
             </div>
         </div>
       )}
    </nav>
  );
}
