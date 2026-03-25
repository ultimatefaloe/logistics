import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Globe, Clock, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary py-20 lg:py-32 text-primary-foreground text-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />
          <div className="container relative z-10 mx-auto px-4">
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl mb-6 leading-tight">
              Global Ultra <span className="text-secondary">Logistics</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect Nigerian businesses to global markets with seamless, transparent, and reliable shipping solutions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/track">
                 <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 px-8 text-lg font-semibold shadow-xl shadow-secondary/20">
                    Track Shipment
                 </Button>
              </Link>
              <Link href="/register">
                 <Button size="lg" variant="outline" className="h-12 px-8 text-lg font-semibold border-white/20 text-primary-foreground hover:bg-white hover:text-primary backdrop-blur-sm">
                    Start Shipping
                 </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-accent">
           <div className="container mx-auto px-4">
              <div className="text-center mb-16 space-y-4">
                 <h2 className="font-display text-3xl font-bold text-primary md:text-5xl">Why Choose Us?</h2>
                 <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    We deliver more than just packages. We deliver trust, speed, and reliability to grow your business.
                 </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                 <Card className="border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="space-y-4">
                       <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Globe className="h-6 w-6 text-primary" />
                       </div>
                       <CardTitle className="text-xl">Global Reach</CardTitle>
                       <CardDescription className="text-base">
                         Seamless shipping connections across continents with our extensive partner network.
                       </CardDescription>
                    </CardHeader>
                 </Card>
                 <Card className="border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="space-y-4">
                       <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                         <ShieldCheck className="h-6 w-6 text-secondary" />
                       </div>
                       <CardTitle className="text-xl">Secure Handling</CardTitle>
                       <CardDescription className="text-base">
                         Your packages are insured and handled with utmost care. Comprehensive protection.
                       </CardDescription>
                    </CardHeader>
                 </Card>
                 <Card className="border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="space-y-4">
                       <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                         <Clock className="h-6 w-6 text-primary" />
                       </div>
                       <CardTitle className="text-xl">On-Time Delivery</CardTitle>
                       <CardDescription className="text-base">
                         Real-time tracking and optimized routes for speed. Never wonder where your package is.
                       </CardDescription>
                    </CardHeader>
                 </Card>
              </div>
           </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 text-center bg-background">
             <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="font-display text-4xl font-bold mb-6 text-primary">Ready to Ship?</h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Join thousands of businesses that trust Global Ultra Logistics for their shipping needs.
                </p>
                <Link href="/register">
                  <Button size="lg" className="px-8 h-12 text-lg gap-2 shadow-lg shadow-primary/20">
                     Get Started Today
                     <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
             </div>
        </section>
      </main>
      
      <footer className="bg-primary text-primary-foreground py-12 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
            <h3 className="font-display font-bold text-2xl mb-4">Global Ultra</h3>
            <p className="text-sm opacity-60">© 2026 Global Ultra Logistics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
