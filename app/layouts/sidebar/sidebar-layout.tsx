import { Outlet, redirect } from "react-router";
import Sidebar from "./components/sidebar";
import type { Route } from "./+types/sidebar-layout";
import { requireUser } from "~/utils/requireUser";
import Folder from "~/models/folder.model";
import dbConnect from "~/utils/db.connect";
import User from "~/models/user.model";

export async function loader({ request, params }: Route.LoaderArgs) {
    const user = await requireUser(request)
    if (!user) return redirect('/login')

    await dbConnect()

    const folders = await Folder.find({ user: user.id }).sort({createdAt: 1}).lean()


    const foldersWithId = folders.map(folder => ({
        ...folder,
        id: folder._id.toString(),
        userId: folder.user.toString()
      }));

    const userModel = await User.findOne({email: user.email}, {recentNotes: 1}).populate('recentNotes').lean()

    const recentNotesWithId = userModel.recentNotes.map(recentNote => ({
        ...recentNote,
        id: recentNote._id.toString(),
        folderId: recentNote.folder.toString()
      }));

    return { folders: foldersWithId, recentNotes: recentNotesWithId }
}

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
    return (
        <div className="flex">
            <Sidebar loaderData={loaderData} />

            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    )
}