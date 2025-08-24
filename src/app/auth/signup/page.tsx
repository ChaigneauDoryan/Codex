
import type { Metadata } from "next";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Inscription",
  description: "Rejoignez Codex aujourd'hui. Créez votre compte pour commencer à suivre vos lectures et à rejoindre des communautés de lecteurs.",
};

export default function SignupPage() {
  return <SignupForm />;
}
