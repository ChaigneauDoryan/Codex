'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAddComment } from "@/hooks/use-user-book";

const commentFormSchema = z.object({
  comment: z.string().min(1, "Le commentaire ne peut pas être vide."),
  page_number: z.number().optional(),
});

interface AddCommentFormProps {
  id: string;
  onCommentAdded?: () => void; // Rendu optionnel car géré par la mutation
}

export default function AddCommentForm({ id, onCommentAdded }: AddCommentFormProps) {
  const form = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: { comment: "", page_number: undefined },
  });

  const { mutate: addComment, isPending } = useAddComment(id);

  function onSubmit(values: z.infer<typeof commentFormSchema>) {
    addComment({ id, values }, {
      onSuccess: () => {
        form.reset();
        onCommentAdded?.(); // Appeler le callback s'il existe pour fermer le formulaire
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Votre commentaire</FormLabel>
              <FormControl>
                <Textarea placeholder="Que s'est-il passé ? Une pensée intéressante ?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="page_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page (optionnel)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="À quelle page ?" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Ajout en cours...' : 'Ajouter le commentaire'}
        </Button>
      </form>
    </Form>
  );
}