import type { Metadata } from "next";
import GroupsClient from "./GroupsClient";

export const metadata: Metadata = {
  title: "Vos Clubs de Lecture",
  description: "Consultez les clubs de lecture que vous avez rejoints, découvrez de nouveaux groupes et gérez vos communautés.",
};

export default function GroupsPage() {
  return <GroupsClient />;
}