import { redirect } from "react-router";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "VibeSync - Connect. Chat. Vibe." },
    { name: "description", content: "Modern chat application for staying connected" },
  ];
}

// Client-side redirect to prevent hydration errors in SPA mode
export async function clientLoader() {
  return redirect("/login");
}

export default function Home() {
  // This component won't actually render due to the loader redirect
  return null;
}
