import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte Codex pour retrouver votre bibliothèque, vos clubs et votre progression.",
};

export default function LoginPage() {
  return <LoginForm />;
}