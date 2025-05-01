import { requireUser } from "~/utils/requireUser"
import dbConnect from "~/utils/db.connect"
import Note from "~/models/note.model"
import { redirect } from "react-router"
import type { Route } from "./+types/add-note"

export async function action({ request }: Route.ActionArgs) {
    const user = await requireUser(request)
    if (!user) {
        return null
    }

    const formData = await request.formData()
    const {folder, title, content, user_created_at} = Object.fromEntries(formData)

    const folderObj = JSON.parse(folder as string)

    try {
        await dbConnect()

        const note = new Note({
            folder: folderObj.id,
            title: title,
            content: content,
            user_created_at: user_created_at
        })
        await note.save()
        return redirect(`/folder/${folderObj.id}/note-editor/${note._id.toString()}`)
    }
    catch (e) {
        console.log(e)
    }
}