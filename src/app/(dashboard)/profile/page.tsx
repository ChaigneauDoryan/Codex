'use client';

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import AvatarUpload from '@/components/AvatarUpload';
import ReadingActivityChart from '@/components/ReadingActivityChart';
import BadgeCard from '@/components/BadgeCard';
import WordCloud from '@/components/WordCloud';
import PaceDisplay from '@/components/PaceDisplay';
import { useProfileData, useUpdateProfile } from "@/hooks/use-profile";

const profileFormSchema = z.object({
  username: z.string().min(2, { message: "Le nom d'utilisateur doit contenir au moins 2 caractères." }),
  bio: z.string().max(280, { message: "La biographie ne peut pas dépasser 280 caractères." }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  // Récupération des données via TanStack Query
  const { data, isLoading, error } = useProfileData();
  // Récupération de la mutation
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  // State local uniquement pour l'URL de l'avatar en cours de modification
  const [avatarUrl, setAvatarUrl] = useState('');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { username: "", bio: "" },
  });

  // Synchronise les données du serveur avec le formulaire une fois qu'elles sont chargées
  useEffect(() => {
    if (data?.profile) {
      form.reset({
        username: data.profile.username,
        bio: data.profile.bio || "",
      });
      setAvatarUrl(data.profile.avatar_url || '');
    }
  }, [data, form]);

  // Gère la soumission du formulaire
  function onSubmit(values: ProfileFormValues) {
    updateProfile({ ...values, avatar_url: avatarUrl });
  }

  if (isLoading) {
    return <div>Chargement de votre profil...</div>;
  }

  if (error) {
    return <div>Erreur: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-foreground">Gestion du Profil</h1>
          <p className="text-muted-foreground">Mettez à jour vos informations personnelles.</p>
        </header>

        <Card>
          <CardHeader><CardTitle>Vos Statistiques</CardTitle></CardHeader>
          <CardContent className="flex justify-around">
            <div className="text-center">
              <p className="text-2xl font-bold">{data.stats?.total_books_read || 0}</p>
              <p className="text-sm text-muted-foreground">Livres Lus</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{data.stats?.total_pages_read || 0}</p>
              <p className="text-sm text-muted-foreground">Pages Lues</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{data.stats?.average_rating?.toFixed(1) || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">Note Moyenne</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Activité de Lecture</CardTitle></CardHeader>
          <CardContent><ReadingActivityChart /></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Mes Badges</CardTitle></CardHeader>
          <CardContent>
            {data.badges?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {data.badges.map((badge: any) => <BadgeCard key={badge.id} badge={badge} />)}
              </div>
            ) : (
              <p>Vous n'avez pas encore débloqué de badges.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Vos Préférences de Lecture</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <WordCloud data={data.topGenres || []} title="Genres Favoris" />
            <WordCloud data={data.topAuthors || []} title="Auteurs Favoris" />
            <PaceDisplay pace={data.readingPace} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Vos informations</CardTitle></CardHeader>
          <CardContent>
            {data.profile?.id && (
              <AvatarUpload
                userId={data.profile.id}
                initialAvatarUrl={avatarUrl}
                onUpload={(url: string) => setAvatarUrl(url)}
              />
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
                <FormField control={form.control} name="username" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d'utilisateur</FormLabel>
                    <FormControl><Input placeholder="Votre pseudo" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="bio" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biographie</FormLabel>
                    <FormControl><Textarea placeholder="Parlez-nous un peu de vous..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" disabled={isUpdating}>{isUpdating ? 'Mise à jour...' : 'Mettre à jour le profil'}</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}