import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Route } from "./+types/home";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { APP_TITLE } from "~/config";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Notake" },
    { name: "description", content: "Welcome to Notake - Note Taker!" },
  ];
}

export default function Home() {
  return (
    <div className="justify-center items-center flex-col flex gap-2 h-screen">

      <div>
        <p className="text-2xl">Welcome to</p>
        <div>
          <p className="text-6xl">
            <span className="italic">{APP_TITLE}</span>
            <FontAwesomeIcon icon={faPencil} />
          </p>
        </div>
      </div>

    </div>
  );
}
