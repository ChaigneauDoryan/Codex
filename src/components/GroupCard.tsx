'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FaUsers, FaBookOpen, FaTrash, FaPencilAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/hooks/use-toast';
import { useDeleteGroup, useLeaveGroup, useRegenerateInviteCode } from '@/hooks/use-groups-mutations';

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    description?: string;
    avatar_url?: string;
    invitation_code?: string;
    user_role?: string;
    members_count?: number;
  };
}

export default function GroupCard({ group }: GroupCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  // State local pour l'UI uniquement
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [currentInvitationCode, setCurrentInvitationCode] = useState(group.invitation_code);

  // Hooks de mutation de TanStack Query
  const { mutate: deleteGroup, isPending: isDeleting } = useDeleteGroup();
  const { mutate: leaveGroup, isPending: isLeaving } = useLeaveGroup();
  const { mutate: regenerateCode, isPending: isRegenerating } = useRegenerateInviteCode((data) => {
    setCurrentInvitationCode(data.invitation_code); // Met à jour le code dans l'UI au succès
  });

  const handleCopyCode = () => {
    if (!currentInvitationCode) return;
    navigator.clipboard.writeText(currentInvitationCode);
    toast({ title: 'Copié !', description: "Le code d'invitation a été copié." });
  };

  const isAdmin = group.user_role === 'admin';

  return (
    <>
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col">
        <CardHeader className="flex flex-row items-center space-x-4 p-4">
          <img src={group.avatar_url || `https://via.placeholder.com/150/33FF57/FFFFFF?text=${group.name.substring(0, 2)}`} alt={group.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500" />
          <div className="flex-grow">
            <CardTitle className="text-xl font-semibold text-foreground">{group.name}</CardTitle>
            <p className="text-sm text-muted-foreground flex items-center"><FaUsers className="mr-1" /> {group.members_count || 0} membre{((group.members_count || 0) > 1 || (group.members_count || 0) === 0) ? 's' : ''}</p>
          </div>
          {isAdmin && (
            <div className="flex flex-col space-y-2">
              <Button variant="outline" size="icon" onClick={() => router.push(`/groups/${group.id}/edit`)}><FaPencilAlt /></Button>
              <Button variant="destructive" size="icon" onClick={() => setShowDeleteModal(true)} disabled={isDeleting}><FaTrash /></Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
          <p className="text-muted-foreground mb-3 line-clamp-2">{group.description || 'Aucune description.'}</p>
          {isAdmin && currentInvitationCode && (
            <div className="bg-muted p-3 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Code d'invitation :</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg tracking-widest text-foreground">{currentInvitationCode}</span>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" onClick={handleCopyCode}>Copier</Button>
                  <Button size="sm" variant="outline" onClick={() => regenerateCode(group.id)} disabled={isRegenerating}>Régénérer</Button>
                </div>
              </div>
            </div>
          )}
          <p className="text-sm text-muted-foreground flex items-center mt-4"><FaBookOpen className="mr-1" /> Lecture actuelle: <span className="font-medium ml-1">Non défini</span></p>
        </CardContent>
        <div className="p-4 pt-0 flex space-x-2">
          <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-3 py-2">Voir le groupe</Button>
          {!isAdmin && (
            <Button variant="outline" className="flex-1 text-sm px-3 py-2" onClick={() => setShowLeaveModal(true)} disabled={isLeaving}>Quitter le groupe</Button>
          )}
        </div>
      </Card>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => deleteGroup(group.id)}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer le groupe "${group.name}" ? Cette action est irréversible.`}
        isConfirming={isDeleting}
      />

      <ConfirmModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={() => leaveGroup(group.id)}
        title="Confirmer la sortie du groupe"
        message={`Êtes-vous sûr de vouloir quitter le groupe "${group.name}" ?`}
        isConfirming={isLeaving}
      />
    </>
  );
}