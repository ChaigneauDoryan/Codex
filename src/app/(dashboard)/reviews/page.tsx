
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";






export default function ReviewsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Mes Avis</h1>
        <p className="text-muted-foreground">Retrouvez tous les avis que vous avez partagés.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>En cours de développement</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette fonctionnalité est en cours de construction. Revenez bientôt !</p>
        </CardContent>
      </Card>
    </div>
  );
}
