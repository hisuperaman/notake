import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Notake" },
    { name: "description", content: "Welcome to Notake - Note Taker!" },
  ];
}

export default function Home() {
  return (
    <div>
      Welcome
    </div>
  );
}
