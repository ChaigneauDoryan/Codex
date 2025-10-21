'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface JoinRequest {
  id: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    email: string | null;
  };
}

interface JoinRequestsManagerProps {
  groupId: string;
}

export default function JoinRequestsManager({ groupId }: JoinRequestsManagerProps) {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/groups/${groupId}/join-requests`);
      if (!response.ok) {
        throw new Error('Failed to fetch join requests.');
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';
      toast({ title: 'Erreur', description: errorMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [groupId, toast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleRequestAction = async (requestId: string, action: 'accept' | 'decline') => {
    try {
      const response = await fetch(`/api/groups/${groupId}/join-requests/${requestId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} request.`);
      }

      toast({ title: 'Succès', description: `La demande a été ${action === 'accept' ? 'accept&apos;ee' : 'refus&apos;ee'}.` });
      // Refresh the list
      setRequests(prev => prev.filter(req => req.id !== requestId));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';
      toast({ title: 'Erreur', description: errorMessage, variant: 'destructive' });
    }
  };

  if (loading) {
    return <p>Chargement des demandes...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demandes d'adhésion en attente</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-muted-foreground">Aucune demande en attente.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map(request => (
              <li key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Image 
                    src={request.user.image || 'https://via.placeholder.com/40'} 
                    alt={request.user.name || 'Avatar'} 
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{request.user.name}</p>
                    <p className="text-sm text-muted-foreground">{request.user.email}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleRequestAction(request.id, 'decline')}>
                    Refuser
                  </Button>
                  <Button size="sm" onClick={() => handleRequestAction(request.id, 'accept')}>
                    Accepter
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}