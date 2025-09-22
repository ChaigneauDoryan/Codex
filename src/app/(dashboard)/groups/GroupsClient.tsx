'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa';
import GroupCard from '@/components/GroupCard';
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGroups } from "@/hooks/use-groups";
import { useJoinGroup } from "@/hooks/use-groups-mutations";

export default function GroupsClient() {
  // State local pour l'UI (modale, champ de saisie)
  const [invitationCode, setInvitationCode] = useState('');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Data fetching avec TanStack Query
  const { data: myGroups = [], isLoading, error } = useGroups();
  
  // Mutation avec TanStack Query
  const { mutate: joinGroup, isPending: isJoining } = useJoinGroup();

  const handleJoinGroup = () => {
    joinGroup(invitationCode, {
      onSuccess: () => {
        setIsJoinModalOpen(false);
        setInvitationCode('');
      }
    });
  };

  if (isLoading) {
    return <div>Chargement de vos groupes...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erreur: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vos Groupes de Lecture</h1>
          <p className="text-lg text-muted-foreground mt-2">Connectez-vous avec d'autres passionnés de lecture.</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <Dialog open={isJoinModalOpen} onOpenChange={setIsJoinModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg shadow-md flex items-center">
                <FaPlus className="mr-2" /> Rejoindre un groupe
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rejoindre un groupe par code</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="Saisissez le code d'invitation"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsJoinModalOpen(false)}>Annuler</Button>
                <Button onClick={handleJoinGroup} disabled={isJoining || !invitationCode}>
                  {isJoining ? 'Rejoindre...' : 'Rejoindre'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Link href="/groups/create">
            <Button variant="outline" className="px-6 py-3 rounded-lg shadow-md flex items-center">
              <FaPlus className="mr-2" /> Créer un groupe
            </Button>
          </Link>
        </div>
      </header>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Mes Groupes</h2>
        {myGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGroups.map((group: any) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-border p-6 text-center">
            <CardHeader>
              <CardTitle className="text-foreground">Vous n'êtes dans aucun groupe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Créez ou rejoignez un groupe pour commencer !</p>
              <Link href="/groups/create">
                <Button variant="secondary" className="mt-4">Créer un groupe</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Découvrir des Groupes</h2>
        <Card className="border-dashed border-2 border-border p-6 text-center">
          <CardHeader>
            <CardTitle className="text-foreground">Bientôt disponible !</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Explorez et rejoignez de nouveaux groupes de lecture ici.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}