import { requireUser } from "~/utils/requireUser"
import dbConnect from "~/utils/db.connect"
import Note from "~/models/note.model"
import { redirect } from "react-router"
import type { Route } from "./+types/delete-note"

export async function action({ request }: Route.ActionArgs) {
    const user = await requireUser(request)
    if (!user) {
        return null
    }

    const formData = await request.formData()
    const noteId = formData.get('noteId')
    const folderId = formData.get('folderId')

    try {
        await dbConnect()

        const note = await Note.findById(noteId)
        await note.deleteOne()
        return redirect(`/folder/${folderId}`)
    }
    catch (e) {
        console.log(e)
    }
}