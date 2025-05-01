import { redirect } from "react-router";
import type { Route } from "./+types/logout";

export function action({ request }: Route.ActionArgs) {
    return redirect("/", {
        headers: {
            "Set-Cookie": "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax",
        },
    });
}