'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createShipmentSchema } from '@/lib/validators';
import { ZodError } from 'zod';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="font-display text-2xl font-bold text-primary mb-4">
            Shipment Created!
          </h2>
          <p className="text-gray-600 mb-6">
            Your shipment has been successfully created.
          </p>
          <div className="bg-accent p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-2">Tracking ID</p>
            <p className="font-mono text-xl font-bold text-primary">
              {trackingId}
            </p>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Redirecting to shipments list...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-primary mb-6">
        Create New Shipment
      </h1>

      {errors.submit && (
        <div className="alert alert-error mb-6">{errors.submit}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sender Section */}
        <fieldset className="card border-l-4" style={{borderLeftColor: '#0D1F3C'}}>
          <legend className="font-semibold text-lg text-primary mb-4">
            Sender Details
          </legend>
          <div className="grid-cols-2">
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="senderName"
                value={formData.senderName}
                onChange={handleChange}
                className="input"
              />
              {errors.senderName && (
                <p className="text-sm text-red-600 mt-1">{errors.senderName}</p>
              )}
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                name="senderEmail"
                value={formData.senderEmail}
                onChange={handleChange}
                className="input"
              />
              {errors.senderEmail && (
                <p className="text-sm text-red-600 mt-1">{errors.senderEmail}</p>
              )}
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="senderPhone"
                value={formData.senderPhone}
                onChange={handleChange}
                placeholder="+234..."
                className="input"
              />
              {errors.senderPhone && (
                <p className="text-sm text-red-600 mt-1">{errors.senderPhone}</p>
              )}
            </div>
            <div>
              <label className="form-label">City</label>
              <input
                type="text"
                name="senderCity"
                value={formData.senderCity}
                onChange={handleChange}
                className="input"
              />
              {errors.senderCity && (
                <p className="text-sm text-red-600 mt-1">{errors.senderCity}</p>
              )}
            </div>
          </div>
          <div>
            <label className="form-label">Address</label>
            <input
              type="text"
              name="senderAddress"
              value={formData.senderAddress}
              onChange={handleChange}
              className="input"
            />
            {errors.senderAddress && (
              <p className="text-sm text-red-600 mt-1">{errors.senderAddress}</p>
            )}
          </div>
        </fieldset>

        {/* Receiver Section */}
        <fieldset className="card border-l-4" style={{borderLeftColor: '#FF7A00'}}>
          <legend className="font-semibold text-lg" style={{color: '#FF7A00'}} >
            Receiver Details
          </legend>
          <div className="grid_cols_2">
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="receiverName"
                value={formData.receiverName}
                onChange={handleChange}
                className="input"
              />
              {errors.receiverName && (
                <p className="text-sm text-red-600 mt-1">{errors.receiverName}</p>
              )}
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                name="receiverEmail"
                value={formData.receiverEmail}
                onChange={handleChange}
                className="input"
              />
              {errors.receiverEmail && (
                <p className="text-sm text-red-600 mt-1">{errors.receiverEmail}</p>
              )}
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="receiverPhone"
                value={formData.receiverPhone}
                onChange={handleChange}
                placeholder="+234..."
                className="input"
              />
              {errors.receiverPhone && (
                <p className="text-sm text-red-600 mt-1">{errors.receiverPhone}</p>
              )}
            </div>
            <div>
              <label className="form-label">City</label>
              <input
                type="text"
                name="receiverCity"
                value={formData.receiverCity}
                onChange={handleChange}
                className="input"
              />
              {errors.receiverCity && (
                <p className="text-sm text-red-600 mt-1">{errors.receiverCity}</p>
              )}
            </div>
          </div>
          <div>
            <label className="form-label">Address</label>
            <input
              type="text"
              name="receiverAddress"
              value={formData.receiverAddress}
              onChange={handleChange}
              className="input"
            />
            {errors.receiverAddress && (
              <p className="text-sm text-red-600 mt-1">{errors.receiverAddress}</p>
            )}
          </div>
        </fieldset>

        {/* Package Section */}
        <fieldset className="card">
          <legend className="font-semibold text-lg text-primary mb-4">
            Package Details
          </legend>
          <div>
            <label className="form-label">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </div>
          <div className="grid_cols_2">
            <div>
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="input"
              />
              {errors.weight && (
                <p className="text-sm text-red-600 mt-1">{errors.weight}</p>
              )}
            </div>
            <div>
              <label className="form-label">Dimensions (Optional)</label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                placeholder="e.g., 10x10x10 cm"
                className="input"
              />
            </div>
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="btn-secondary w-full py-3 text-lg"
        >
          {loading ? 'Creating Shipment...' : 'Create Shipment'}
        </button>
      </form>
    </div>
  );
}
