'use client';

import { useState } from 'react';
import AddCommentForm from '@/components/AddCommentForm';
import BookCommentTimeline from '@/components/BookCommentTimeline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserBook, useUpdateBookStatus } from '@/hooks/use-user-book';

const READING_STATUSES = [
  { id: 1, name: 'to_read', label: 'À lire', bgColorClass: 'bg-primary' },
  { id: 2, name: 'reading', label: 'En cours', bgColorClass: 'bg-warning' },
  { id: 3, name: 'finished', label: 'Terminé', bgColorClass: 'bg-success' },
];

const getStatusDetails = (statusId: number) => {
  return READING_STATUSES.find(s => s.id === statusId);
};

interface BookDetailsClientWrapperProps {
  userBookId: string;
  userBook: any; // Données initiales du serveur
}

export default function BookDetailsClientWrapper({ userBookId, userBook: initialUserBook }: BookDetailsClientWrapperProps) {
  const [showCommentForm, setShowCommentForm] = useState(false);

  const { data: userBook, isLoading, error } = useUserBook(userBookId, initialUserBook);
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateBookStatus(userBookId);

  if (isLoading && !initialUserBook) {
    return <div>Chargement du livre...</div>;
  }

  if (error) {
    return <div>Erreur: {error.message}</div>;
  }

  if (!userBook) {
      return <div>Livre non trouvé.</div>
  }

  const currentStatus = getStatusDetails(userBook.status_id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{userBook?.book?.title || 'Titre inconnu'}</CardTitle>
        <CardDescription>{userBook?.book?.author || 'Auteur inconnu'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
          {userBook?.book?.cover_url && (
            <img
              src={userBook.book.cover_url}
              alt={`Couverture de ${userBook.book.title}`}
              className="w-32 h-48 object-contain flex-shrink-0 rounded-md shadow-lg"
            />
          )}
          <div className="flex-grow">
            <p className="text-sm text-muted-foreground mb-4">{userBook?.book?.description || 'Aucune description.'}</p>
            <div className="flex items-center space-x-2 mb-2">
              <p className="text-sm font-medium">Statut :</p>
              <Select 
                onValueChange={(newStatusName) => updateStatus({ id: userBookId, status: newStatusName })}
                defaultValue={currentStatus?.name}
                disabled={isUpdatingStatus}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue>
                    <div className="flex items-center">
                      {currentStatus && <span className={`w-2 h-2 rounded-full mr-2 ${currentStatus.bgColorClass}`}></span>}
                      {currentStatus?.label}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {READING_STATUSES.map((status) => (
                    <SelectItem key={status.name} value={status.name}>
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${status.bgColorClass}`}></span>
                        {status.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">Page actuelle : {userBook.current_page || 0} / {userBook?.book?.page_count || 'N/A'}</p>
          </div>
        </div>
      </CardContent>
      <div className="p-4 border-t">
        <div className="flex justify-end mb-4">
          <Button onClick={() => setShowCommentForm(!showCommentForm)} variant="outline">
            {showCommentForm ? 'Annuler' : 'Ajouter un commentaire'}
          </Button>
        </div>
        {showCommentForm && (
          <AddCommentForm id={userBookId} onCommentAdded={() => setShowCommentForm(false)} />
        )}
        {userBook?.book?.page_count && (
          <BookCommentTimeline
            id={userBookId}
            totalBookPages={userBook.book.page_count}
          />
        )}
      </div>
    </Card>
  );
}
