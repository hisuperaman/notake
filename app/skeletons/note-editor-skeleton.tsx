import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NoteEditorSkeleton() {
    return (
        <div className="flex flex-col h-full gap-4 p-4 max-h-full">
            {/* header */}
            <div className="flex justify-between w-full">


                <p className="text-2xl font-semibold animate-pulse dark:bg-secondary bg-secondary w-3/4"></p>


                <div className="relative">
                    <button type="button" className="text-onSurface dark:text-onSurface border rounded-full w-8 h-8 flex justify-center items-center cursor-pointer hover:text-onSurfaceActive dark:hover:text-onSurfaceActive">
                        <FontAwesomeIcon icon={faEllipsisH} />
                    </button>
                </div>

            </div>

            <div className="flex flex-col animate-pulse dark:bg-secondary bg-secondary h-1/2 w-full">
                <div className="relative">
                    
                </div>
            </div>

            <div className="animate-pulse flex-1 dark:bg-secondary bg-secondary w-full">
                
            </div>
        </div>
    )
}