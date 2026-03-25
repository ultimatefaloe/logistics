'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createShipmentSchema } from '@/lib/validators';
import { ZodError } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateShipmentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    senderAddress: '',
    senderCity: '',
    receiverName: '',
    receiverEmail: '',
    receiverPhone: '',
    receiverAddress: '',
    receiverCity: '',
    description: '',
    weight: '',
    dimensions: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const validated = createShipmentSchema.parse({
        ...formData,
        weight: parseFloat(formData.weight),
      });

      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create shipment');
      }

      const data = await res.json();
      setTrackingId(data.data.trackingId);

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/shipments');
      }, 3000);
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const path = issue.path.join('.');
          newErrors[path] = issue.message;
        });
        setErrors(newErrors);
      } else if (error instanceof Error) {
        setErrors({ submit: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  if (trackingId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent p-4">
        <Card className="max-w-md w-full text-center p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-primary mb-4">
            Shipment Created!
          </h2>
          <p className="text-muted-foreground mb-6">
            Your shipment has been successfully created.
          </p>
          <div className="bg-secondary/10 p-4 rounded-lg mb-6 border border-secondary/20">
            <p className="text-sm text-muted-foreground mb-2">Tracking ID</p>
            <p className="font-mono text-xl font-bold text-secondary">
              {trackingId}
            </p>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Redirecting to shipments list...
          </p>
          <Button onClick={() => router.push('/shipments')} className="w-full">
            View All Shipments
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-primary mb-6">
        Create New Shipment
      </h1>

      {errors.submit && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6 border border-destructive/20">{errors.submit}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sender Section */}
        <Card className="border-l-4 border-l-primary shadow-md">
          <CardHeader>
             <CardTitle className="text-primary font-bold">Sender Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="senderName">Full Name</Label>
                 <Input id="senderName" name="senderName" value={formData.senderName} onChange={handleChange} className={errors.senderName ? "border-destructive focus-visible:ring-destructive" : ""} />
                 {errors.senderName && <p className="text-sm text-destructive">{errors.senderName}</p>}
               </div>
               <div className="space-y-2">
                 <Label htmlFor="senderEmail">Email</Label>
                 <Input id="senderEmail" type="email" name="senderEmail" value={formData.senderEmail} onChange={handleChange} className={errors.senderEmail ? "border-destructive focus-visible:ring-destructive" : ""} />
                 {errors.senderEmail && <p className="text-sm text-destructive">{errors.senderEmail}</p>}
               </div>
               <div className="space-y-2">
                 <Label htmlFor="senderPhone">Phone</Label>
                 <Input id="senderPhone" name="senderPhone" value={formData.senderPhone} onChange={handleChange} placeholder="+234..." className={errors.senderPhone ? "border-destructive focus-visible:ring-destructive" : ""} />
                 {errors.senderPhone && <p className="text-sm text-destructive">{errors.senderPhone}</p>}
               </div>
               <div className="space-y-2">
                 <Label htmlFor="senderCity">City</Label>
                 <Input id="senderCity" name="senderCity" value={formData.senderCity} onChange={handleChange} className={errors.senderCity ? "border-destructive focus-visible:ring-destructive" : ""} />
                 {errors.senderCity && <p className="text-sm text-destructive">{errors.senderCity}</p>}
               </div>
             </div>
             <div className="space-y-2">
               <Label htmlFor="senderAddress">Address</Label>
               <Input id="senderAddress" name="senderAddress" value={formData.senderAddress} onChange={handleChange} className={errors.senderAddress ? "border-destructive focus-visible:ring-destructive" : ""} />
               {errors.senderAddress && <p className="text-sm text-destructive">{errors.senderAddress}</p>}
             </div>
          </CardContent>
        </Card>

        {/* Receiver Section */}
        <Card className="border-l-4 border-l-secondary shadow-md">
           <CardHeader>
             <CardTitle className="text-secondary font-bold">Receiver Details</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receiverName">Full Name</Label>
                  <Input id="receiverName" name="receiverName" value={formData.receiverName} onChange={handleChange} className={errors.receiverName ? "border-destructive focus-visible:ring-destructive" : ""} />
                  {errors.receiverName && <p className="text-sm text-destructive">{errors.receiverName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiverEmail">Email</Label>
                  <Input id="receiverEmail" type="email" name="receiverEmail" value={formData.receiverEmail} onChange={handleChange} className={errors.receiverEmail ? "border-destructive focus-visible:ring-destructive" : ""} />
                  {errors.receiverEmail && <p className="text-sm text-destructive">{errors.receiverEmail}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiverPhone">Phone</Label>
                  <Input id="receiverPhone" name="receiverPhone" value={formData.receiverPhone} onChange={handleChange} placeholder="+234..." className={errors.receiverPhone ? "border-destructive focus-visible:ring-destructive" : ""} />
                  {errors.receiverPhone && <p className="text-sm text-destructive">{errors.receiverPhone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiverCity">City</Label>
                  <Input id="receiverCity" name="receiverCity" value={formData.receiverCity} onChange={handleChange} className={errors.receiverCity ? "border-destructive focus-visible:ring-destructive" : ""} />
                  {errors.receiverCity && <p className="text-sm text-destructive">{errors.receiverCity}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiverAddress">Address</Label>
                <Input id="receiverAddress" name="receiverAddress" value={formData.receiverAddress} onChange={handleChange} className={errors.receiverAddress ? "border-destructive focus-visible:ring-destructive" : ""} />
                {errors.receiverAddress && <p className="text-sm text-destructive">{errors.receiverAddress}</p>}
              </div>
           </CardContent>
        </Card>

        {/* Package Details */}
        <Card>
            <CardHeader>
                <CardTitle>Package Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} className={errors.weight ? "border-destructive focus-visible:ring-destructive" : ""} />
                    {errors.weight && <p className="text-sm text-destructive">{errors.weight}</p>}
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions (LxWxH cm) - Optional</Label>
                    <Input id="dimensions" name="dimensions" value={formData.dimensions} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input id="description" name="description" value={formData.description} onChange={handleChange} />
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" disabled={loading} className="w-full md:w-auto">
            {loading ? 'Creating...' : 'Create Shipment'}
          </Button>
        </div>
      </form>
    </div>
  );
}
