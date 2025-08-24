import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaBookReader, FaUsers, FaSearch, FaQuoteLeft } from 'react-icons/fa';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Codex - Votre Univers de Lecture Collaborative",
  description: "Plongez dans des mondes littéraires, partagez vos passions et découvrez votre prochaine grande lecture. Rejoignez des clubs de lecture, suivez vos progrès et faites partie d'une communauté de passionnés.",
};

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="text-center py-20 bg-background">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-foreground leading-tight">
            Bienvenue sur Codex
          </h1>
          <p className="mt-4 text-2xl text-muted-foreground">
            Votre Univers de Lecture Collaborative
          </p>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Plongez dans des mondes littéraires, partagez vos passions et découvrez votre prochaine grande lecture au sein d'une communauté de passionnés.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 w-full">
                Rejoindre la communauté
              </Button>
            </Link>
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 border-border hover:bg-accent w-full mt-2 sm:mt-0">
                J'ai déjà un compte
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-2 text-foreground">Une plateforme, des possibilités infinies</h2>
          <p className="text-lg text-muted-foreground mb-12">Tout ce dont vous avez besoin pour une expérience de lecture enrichie.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="feature-card p-6 bg-card rounded-lg shadow-lg">
              <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
                <FaUsers className="text-5xl text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-foreground">Clubs de Lecture Dynamiques</h3>
              <p className="text-muted-foreground">Créez ou rejoignez des groupes pour discuter de vos œuvres préférées, organiser des lectures communes et partager vos analyses.</p>
            </div>
            <div className="feature-card p-6 bg-card rounded-lg shadow-lg">
              <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
                <FaBookReader className="text-5xl text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-foreground">Bibliothèque Personnelle</h3>
              <p className="text-muted-foreground">Suivez vos lectures, notez vos livres, et gardez une trace de votre parcours littéraire. Votre historique de lecture, toujours à portée de main.</p>
            </div>
            <div className="feature-card p-6 bg-card rounded-lg shadow-lg">
              <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
                <FaSearch className="text-5xl text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-foreground">Découverte Intelligente</h3>
              <p className="text-muted-foreground">Trouvez votre prochain coup de cœur grâce à notre puissant moteur de recherche et à des suggestions basées sur vos goûts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12 text-foreground">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-card rounded-lg shadow-lg border-t-4 border-primary">
              <span className="text-3xl font-bold text-primary">1.</span>
              <h3 className="text-xl font-semibold mt-2 text-foreground">Inscrivez-vous</h3>
              <p className="text-muted-foreground mt-1">Créez votre profil en quelques secondes et personnalisez votre espace.</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-lg border-t-4 border-success">
              <span className="text-3xl font-bold text-success">2.</span>
              <h3 className="text-xl font-semibold mt-2 text-foreground">Explorez</h3>
              <p className="text-muted-foreground mt-1">Rejoignez un groupe de lecture existant ou créez le vôtre. Ajoutez des livres à votre bibliothèque.</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-lg border-t-4 border-accent">
              <span className="text-3xl font-bold text-accent">3.</span>
              <h3 className="text-xl font-semibold mt-2 text-foreground">Partagez</h3>
              <p className="text-muted-foreground mt-1">Lisez, discutez, et partagez vos avis avec des membres qui partagent vos passions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12 text-foreground">Ils parlent de nous</h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-card p-8 rounded-xl shadow-lg relative">
              <FaQuoteLeft className="absolute top-4 left-4 text-5xl text-primary/20 opacity-50" />
              <p className="text-lg text-muted-foreground italic relative z-10">"Codex a transformé ma manière de lire. J'ai découvert des pépites et rencontré des gens formidables dans mon club de science-fiction. C'est devenu mon rendez-vous littéraire incontournable !"</p>
              <p className="mt-6 font-semibold text-foreground">- Marie D., Membre depuis 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background text-foreground py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-2xl font-bold mb-2">Codex</p>
          <p className="mb-4">Votre aventure littéraire commence ici.</p>
          <div className="flex justify-center space-x-6 mb-6">
            {/* Add social media links here */}
          </div>
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Codex. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}