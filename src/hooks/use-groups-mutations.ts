import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';

// --- Fonctions de Mutation ---

// Obtenir le token est une action répétée, on la factorise
const getAccessToken = async () => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;
  if (!accessToken) throw new Error('Utilisateur non authentifié.');
  return accessToken;
};

const joinGroup = async (invitationCode: string) => {
  const accessToken = await getAccessToken();
  const response = await fetch('/api/groups/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
    body: JSON.stringify({ invitationCode }),
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Échec pour rejoindre le groupe.');
  return response.json();
};

const leaveGroup = async (groupId: string) => {
  const accessToken = await getAccessToken();
  const response = await fetch(`/api/groups/${groupId}/leave`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Échec pour quitter le groupe.');
  return response.json();
};

const deleteGroup = async (groupId: string) => {
  const accessToken = await getAccessToken();
  const response = await fetch(`/api/groups/${groupId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error((await response.json()).message || 'Échec de la suppression du groupe.');
  return response.json();
};

const regenerateInviteCode = async (groupId: string) => {
  const accessToken = await getAccessToken();
  const response = await fetch(`/api/groups/${groupId}/regenerate-code`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error('Échec de la régénération du code.');
  return response.json();
};


// --- Hooks de Mutation ---

// Hook générique pour les mutations qui invalident la liste des groupes
const useGroupMutation = <TVariables>(
  mutationFn: (variables: TVariables) => Promise<any>,
  successMessage: string
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      toast({ title: 'Succès', description: successMessage });
      // Invalide et refetch la query 'user-groups'
      queryClient.invalidateQueries({ queryKey: ['user-groups'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });
};

export const useJoinGroup = () => useGroupMutation(joinGroup, 'Vous avez rejoint le groupe !');
export const useLeaveGroup = () => useGroupMutation(leaveGroup, 'Vous avez quitté le groupe.');
export const useDeleteGroup = () => useGroupMutation(deleteGroup, 'Le groupe a été supprimé.');

// La régénération du code est un cas un peu spécial, car on veut mettre à jour l'UI sans tout rafraîchir.
export const useRegenerateInviteCode = (onSuccessCallback: (data: any) => void) => {
    const { toast } = useToast();
    return useMutation({
        mutationFn: regenerateInviteCode,
        onSuccess: (data) => {
            toast({ title: 'Succès', description: "Le code d'invitation a été régénéré." });
            onSuccessCallback(data); // Met à jour le state local du composant avec le nouveau code
        },
        onError: (error: Error) => {
            toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
        },
    });
};
