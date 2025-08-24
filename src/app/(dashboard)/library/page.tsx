
import type { Metadata } from "next";
import LibraryClient from "./LibraryClient";

export const metadata: Metadata = {
  title: "Ma Bibliothèque",
  description: "Gérez votre bibliothèque personnelle. Consultez vos livres à lire, en cours de lecture et terminés.",
};

export default function LibraryPage() {
  return <LibraryClient />;
}
