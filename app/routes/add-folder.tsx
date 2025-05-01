import { requireUser } from "~/utils/requireUser";
import type { Route } from "./+types/add-folder";
import Folder from "~/models/folder.model";
import dbConnect from "~/utils/db.connect";

export async function action({ request }: Route.ActionArgs) {
    const user = await requireUser(request)
    if (!user) {
        return null
    }

    const formData = await request.formData()
    const folderName = formData.get('folder_name')

    if(!folderName) {
        return null
    }

    try {
        await dbConnect()

        const folder = new Folder({
            user: user.id,
            name: folderName
        })
        await folder.save()
        return null
    }
    catch (e) {
        console.log(e)
    }
}