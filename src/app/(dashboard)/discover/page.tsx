
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Découvrir",
  description: "Explorez de nouveaux livres, trouvez des recommandations et découvrez ce que la communauté Codex est en train de lire.",
};

export default function DiscoverPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Découvrir</h1>
        <p className="text-muted-foreground">Explorez de nouveaux genres et trouvez votre prochaine lecture.</p>
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
