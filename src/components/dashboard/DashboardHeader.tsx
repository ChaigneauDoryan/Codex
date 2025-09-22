'use client';

interface DashboardHeaderProps {
  username: string;
}

export function DashboardHeader({ username }: DashboardHeaderProps) {
  return (
    <header>
      <h1 className="text-3xl font-bold text-foreground">
        Bonjour, {username} !
      </h1>
      <p className="text-muted-foreground">
        Ravi de vous revoir. Voici un aperçu de votre univers de lecture.
      </p>
    </header>
  );
}
