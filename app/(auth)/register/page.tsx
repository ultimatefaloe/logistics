'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { registerSchema } from '@/lib/validators';
import { ZodError } from 'zod';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    company: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // Validate
      registerSchema.parse(formData);

      // Submit
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Registration failed');
      }

      // Success
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).errors.forEach((err: any) => {
          newErrors[err.path.join('.')] = err.message;
        });
        setErrors(newErrors);
      } else if (error instanceof Error) {
        setErrors({ submit: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 card">
        <h2 className="text-center font-display text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
          Create Account
        </h2>

        {errors.submit && <div style={{ color: '#dc2626' }} className="p-4 rounded">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="input w-full"
          />
          {errors.firstName && <p style={{ color: '#dc2626' }} className="text-sm">{errors.firstName}</p>}

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="input w-full"
          />
          {errors.lastName && <p style={{ color: '#dc2626' }} className="text-sm">{errors.lastName}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input w-full"
          />
          {errors.email && <p style={{ color: '#dc2626' }} className="text-sm">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input w-full"
          />
          {errors.password && <p style={{ color: '#dc2626' }} className="text-sm">{errors.password}</p>}

          <input
            type="text"
            name="company"
            placeholder="Company (optional)"
            value={formData.company}
            onChange={handleChange}
            className="input w-full"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold" style={{ color: 'var(--color-secondary)' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
