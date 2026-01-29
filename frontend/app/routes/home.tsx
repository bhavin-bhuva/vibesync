import { redirect } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "VibeSync - Connect. Chat. Vibe." },
    { name: "description", content: "Modern chat application for staying connected" },
  ];
}

// Server-side redirect to prevent hydration errors
export async function loader() {
  return redirect("/login");
}

export default function Home() {
  // This component won't actually render due to the loader redirect
  return null;
}
