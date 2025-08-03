import { faNoteSticky, faPencil, faStickyNote } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Outlet } from "react-router";
import { APP_TITLE } from "~/config";

export default function AuthenticationLayout() {
    return (
        <div className="h-screen flex">
            <div className="m-auto p-1 bg-secondary w-3/4 h-[90%] flex">
                <div className="bg-primary w-3/5 flex justify-center items-center">
                    <div>
                        <p className="text-6xl">
                            <span className="italic">{APP_TITLE}</span>
                            <FontAwesomeIcon icon={faPencil} />
                        </p>
                    </div>
                </div>

                <div className="p-16 flex flex-col flex-1 gap-12">
                    <p className="text-2xl">
                        {APP_TITLE}
                    </p>
                    <div>
                        <Outlet />
                    </div>
                </div>

            </div>
        </div>
    )
}