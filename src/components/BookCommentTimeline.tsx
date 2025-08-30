'use client';

import { useUserBookComments } from '@/hooks/use-user-book';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface BookCommentTimelineProps {
  id: string;
  totalBookPages: number;
}

export default function BookCommentTimeline({ id, totalBookPages }: BookCommentTimelineProps) {
  const { data: comments = [], isLoading, error } = useUserBookComments(id);

  if (isLoading) return <p>Chargement des commentaires...</p>;
  if (error) return <p className="text-red-500">Erreur: {error.message}</p>;

  const sortedComments = [...comments].sort((a, b) => {
    const pageA = a.page_number ?? Infinity;
    const pageB = b.page_number ?? Infinity;
    if (pageA !== pageB) {
      return pageA - pageB;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fil des Commentaires</CardTitle>
        <CardDescription>Vos pensées et réactions au fil de votre lecture.</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedComments.length === 0 ? (
          <p>Aucun commentaire pour l'instant.</p>
        ) : (
          <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-4">
            {sortedComments.map((comment, index) => (
              <div key={index} className="mb-8 ml-8">
                {comment.page_number && (
                  <span className="absolute -left-4 flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <p className="text-sm font-bold text-blue-800 dark:text-blue-300">{comment.page_number}</p>
                  </span>
                )}
                {!comment.page_number && (
                   <span className="absolute -left-4 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-gray-700">
                   </span>
                )}
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-600">
                    <p className="text-gray-700 dark:text-gray-300">{comment.comment}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}