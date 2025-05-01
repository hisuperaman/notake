import { requireUser } from "~/utils/requireUser";
import type { Route } from "./+types/destroy-folder";
import dbConnect from "~/utils/db.connect";
import Folder from "~/models/folder.model";


export async function action({ request }: Route.ActionArgs) {
    const user = await requireUser(request)
    if (!user) {
        return null
    }

    const formData = await request.formData()
    const folderId = formData.get('folder_id')

    if(!folderId) {
        return null
    }

    try {
        await dbConnect()

        const folder = await Folder.findById(folderId)
        await folder.deleteOne()
        return null
    }
    catch (e) {
        console.log(e)
    }
}