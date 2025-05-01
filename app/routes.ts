import type { RouteConfig } from "@react-router/dev/routes";
import { route, index, layout } from "@react-router/dev/routes"

export default [
    layout("layouts/sidebar/sidebar-layout.tsx", [
        index("routes/home.tsx"),

        route("folder/:folderId", "routes/folder-sidebar.tsx", [
            route("note-editor/:noteId", "routes/note-editor/note-editor.tsx")
        ]),
    ]),

    layout("layouts/authentication/authentication-layout.tsx", [
        route("login", "routes/login.tsx"),
        route("signup", "routes/signup.tsx"),
    ]),

    route("logout", "routes/logout.tsx"),

    route("add-folder", "routes/add-folder.tsx"),
    route("destroy-folder", "routes/destroy-folder.tsx"),
    route("edit-folder", "routes/edit-folder.tsx"),

    route("add-note", "routes/add-note.tsx"),
    route("update-note", "routes/update-note.tsx"),
    route("destroy-note", "routes/destroy-note.tsx"),

    route("log-recent-note", "routes/log-recent-note.tsx"),

    route("get-suggestion", "routes/get-suggestion.tsx"),
] satisfies RouteConfig;
