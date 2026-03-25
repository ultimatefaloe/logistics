'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/status-badge';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Shipment {
  id: string;
  trackingId: string;
  receiverName: string;
  currentStatus: string;
  createdAt: string;
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchShipments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/shipments?page=${page}&limit=10`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch shipments');
        const data = await res.json();
        setShipments(data.data?.data || []);
        setTotal(data.data?.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight text-primary">Shipments</h2>
          <p className="text-muted-foreground">
            Manage and track all your shipments
          </p>
        </div>
        <Link href="/shipments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Shipment
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>All Shipments</CardTitle>
                <CardDescription>A list of your recent shipments.</CardDescription>
              </div>
              <div className="flex w-full max-w-sm items-center space-x-2">
                 <Input type="search" placeholder="Search tracking ID..." />
                 <Button type="submit" size="icon" variant="ghost">
                     <Search className="h-4 w-4" />
                 </Button>
              </div>
           </div>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex justify-center p-8">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
             </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking ID</TableHead>
                  <TableHead>Receiver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No shipments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  shipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium text-primary">
                        {shipment.trackingId}
                      </TableCell>
                      <TableCell>{shipment.receiverName}</TableCell>
                      <TableCell>
                        <StatusBadge status={shipment.currentStatus} />
                      </TableCell>
                      <TableCell>{new Date(shipment.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/shipments/${shipment.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
          
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={shipments.length < 10 || loading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
