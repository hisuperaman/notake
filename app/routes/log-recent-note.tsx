import { requireUser } from "~/utils/requireUser"
import type { Route } from "./+types/log-recent-note"
import User from "~/models/user.model"

export async function action({params, request}: Route.ActionArgs) {
    const userSession = await requireUser(request)
    if (userSession) {
        const formData = await request.formData()
        const noteId = formData.get('noteId') as String

        const user = await User.findOne({email: userSession.email})
        user.recentNotes = user.recentNotes.filter(rn => rn.toString()!==noteId)

        user.recentNotes.unshift(noteId)
        if(user.recentNotes.length>3) {
            user.recentNotes = user.recentNotes.slice(0, 3)
        }
        await user.save()
    }

    return null
}