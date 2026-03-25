import { Navbar } from '@/components/navbar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-accent">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
           {children}
        </div>
      </div>
    </div>
  );
}
