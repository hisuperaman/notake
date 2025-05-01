import { NavLink, Outlet, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/folder-sidebar";
import { APP_TITLE } from "~/config";
import { requireUser } from "~/utils/requireUser";
import dbConnect from "~/utils/db.connect";
import Note from "~/models/note.model";
import Folder from "~/models/folder.model";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: `Folder Structure | ${APP_TITLE}` },
        { name: "description", content: "Display folders" },
    ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
    const user = await requireUser(request)
    if (!user) return redirect('/login')

    await dbConnect()


    const notes = await Note.find({ folder: params.folderId }, { content: 0, folder: 0 })
        .sort({ createdAt: -1 })
        .populate('folder').lean()

    const folder = await Folder.findOne({_id: params.folderId}).lean()

    const notesWithId = notes.map(note => ({
        ...note,
        id: note._id.toString(),
    }));


    return { notes: notesWithId, folderName: folder?.name }
}

export default function FolderSidebar({ loaderData, params }: Route.ComponentProps) {
    const { notes, folderName } = loaderData


    return (
        <div className="flex">
            <div className="w-1/4 bg-secondary dark:bg-secondary p-4 flex flex-col gap-4 h-screen">
                <p className="text-lg break-all">{folderName}</p>

                <div className="p-1 flex flex-col gap-4 overflow-auto">

                    {
                        notes.map((note, index) => {
                            return (
                                <NavLink to={`note-editor/${note.id}`}
                                    onClick={(e)=>{
                                        if(params.noteId===note.id) e.preventDefault()
                                    }}
                                    key={note.id}
                                    className={({ isActive, isPending }) => {
                                        const cls = `${isActive ? 'dark:bg-surfaceActive bg-surfaceActive' : isPending ? 'animate-pulse' : 'dark:bg-surface bg-surface hover:bg-surfaceHover dark:hover:bg-surfaceHover dark:active:brightness-110 active:brightness-110'} transition cursor-pointer p-3 rounded-md flex flex-col gap-2`
                                        return cls
                                    }}
                                >
                                    <p>{note.title}</p>
                                    <p className="dark:text-onSurface text-xs text-nowrap text-ellipsis overflow-hidden">
                                        <span className="font-light">{note.created_at}</span>&nbsp;
                                        {note.description}
                                    </p>
                                </NavLink>
                            )
                        })
                    }

                </div>
            </div>

            <div className="max-h-screen p-4 flex-1">
                {/* note editor */}
                <Outlet />
            </div>
        </div>
    )
}