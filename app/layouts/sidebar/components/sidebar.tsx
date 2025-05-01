import { APP_TITLE } from "~/config"
import type { Route } from "../+types/sidebar-layout"
import { NavLink, useFetcher, useLocation, useNavigate, useNavigation, useParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAdd, faEllipsisH, faEllipsisV, faFolderPlus, faPencil, faRightFromBracket, faSearch } from "@fortawesome/free-solid-svg-icons"
import { faFile, faFileAlt, faFolder, faFolderOpen } from "@fortawesome/free-regular-svg-icons"
import { useDropdownAnimation } from "~/hooks/useDropdownAnimation"
import DropDownMenu from "~/routes/note-editor/components/DropDownMenu"
import DropDownMenuItem from "~/routes/note-editor/components/DropDownMenuItem"
import { useRef, useState } from "react"


function RecentNoteItem({
    label,
    icon,
    to,
    activeIcon,
    isActive,
    isSecondary
}) {
    const location = useLocation()
    const allowNavigation = location.pathname !== to

    function handleNavClick(e) {
        if(!allowNavigation) e.preventDefault()
    }

    return (
        <NavLink to={to} onClick={handleNavClick} className={`${isActive ? (isSecondary ? 'bg-surface dark:bg-surface text-onSurfaceActive' : 'bg-menuActive dark:bg-menuActive text-onSurfaceActive') : 'text-onSurface hover:text-onSurfaceActive dark:hover:text-onSurfaceActive hover:bg-surfaceHover dark:hover:bg-surfaceHover dark:active:brightness-110 active:brightness-110'} p-2 cursor-pointer transition flex items-center gap-3`}>
            {(isActive && activeIcon) ? activeIcon : icon}
            <p className="text-nowrap overflow-hidden text-ellipsis">{label}</p>
        </NavLink>
    )
}


function FolderItem({ folder, allowNavigation }) {
    const { isOpen, setIsOpen, dropdownRef, buttonRef } = useDropdownAnimation()

    const [isEditable, setIsEditable] = useState(false)

    function toggleFolderDropdown(e) {
        e.preventDefault()
        e.stopPropagation()

        setIsOpen((prevIsOpen) => !prevIsOpen)
    }

    const fetcher = useFetcher()
    const busy = fetcher?.state !== 'idle'


    async function handleDeleteClick() {
        const formData = new FormData()
        formData.append('folder_id', folder.id)
        await fetcher.submit(formData, { action: '/destroy-folder', method: 'post' })
        setIsOpen(false)
    }

    function handleEditClick() {
        setIsEditable(true)
        setIsOpen(false)
    }

    function handleLinkClick(e) {
        if(!allowNavigation) e.preventDefault()
    }

    return (
        <div className="relative">
            <NavLink to={`/folder/${folder.id}`} onClick={handleLinkClick}
                className={({ isActive, isPending }) => {
                    const cls = `${isActive ? 'bg-surface dark:bg-surface text-onSurfaceActive' : isPending ? 'animate-pulse' : 'text-onSurface hover:text-onSurfaceActive dark:hover:text-onSurfaceActive hover:bg-surfaceHover dark:hover:bg-surfaceHover dark:active:brightness-110 active:brightness-110'} p-2 cursor-pointer transition flex items-center justify-between`
                    return cls
                }}
            >
                {({ isActive, isPending }) => {
                    return (
                        <>
                            <div className="flex gap-3 items-center w-5/6">
                                {isActive ? <FontAwesomeIcon icon={faFolderOpen} /> : <FontAwesomeIcon icon={faFolder} />}

                                {
                                    isEditable ? (
                                        <fetcher.Form action="/edit-folder" method="post" onSubmit={() => setIsEditable(false)}>
                                            <input
                                                type="hidden"
                                                name="folder_id"
                                                defaultValue={folder.id}
                                            />
                                            <input
                                                type="text"
                                                defaultValue={folder.name}
                                                name="folder_name"
                                                autoFocus
                                                onFocus={(e) => e.target.select()}
                                                onBlur={(e) => setIsEditable(false)}
                                                className="outline-none w-5/6" />
                                        </fetcher.Form>
                                    )
                                        : (

                                            <p className="text-nowrap overflow-hidden text-ellipsis">{fetcher.formData?.get("folder_name") || folder.name}</p>
                                        )
                                }
                            </div>

                            {
                                folder.name !== 'Personal' && (
                                    <button ref={buttonRef} onClick={(e) => toggleFolderDropdown(e)} type="button" className="hover:bg-onSurfaceActive dark:hover:bg-onSurfaceActive hover:text-primary dark:hover:text-primary transition duration-50 cursor-pointer px-2 rounded-full">
                                        <FontAwesomeIcon icon={faEllipsisV} />
                                    </button>
                                )
                            }


                        </>
                    )
                }}
            </NavLink>

            <div ref={dropdownRef} className="w-28 absolute top-0 right-0 scale-0 hidden z-10 origin-top-right">
                <DropDownMenu xsText={true}>
                    <DropDownMenuItem onClick={handleEditClick} label={'Edit'} />
                    <DropDownMenuItem onClick={handleDeleteClick} label={'Delete'} />
                </DropDownMenu>

            </div>
        </div>
    )
}

function MenuSection({ label, icon, onActionClick, children }: Route.ComponentProps) {
    return (
        <div>
            <div className="flex justify-between text-onSurface dark:text-onSurface text-xs p-2">
                <p className="">{label}</p>
                {
                    icon && (
                        <button type="button" onClick={onActionClick} className="px-2 hover:text-onSurfaceActive dark:hover:text-onSurfaceActive cursor-pointer">
                            {icon}
                        </button>
                    )
                }
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}

export default function Sidebar({ loaderData }: Route.ComponentProps) {
    const { folders, recentNotes } = loaderData

    const [showNewFolder, setShowNewFolder] = useState(false)
    const newFolderRef = useRef<HTMLDivElement>(null)
    const newFolderInputRef = useRef<HTMLInputElement>(null)

    const fetcher = useFetcher()
    const busy = fetcher?.state !== 'idle'

    const navigate = useNavigate()

    const navigation = useNavigation()

    const params = useParams()

    function handleNewNoteClick() {
        const url = `/folder/${folders[0].id}/note-editor/new`
        navigate(url)
    }

    return (
        <div className="w-1/6 bg-primary dark:bg-primary select-none flex flex-col h-screen">
            <div className="p-4 flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <NavLink to={'/'} className="text-xl flex">
                        <span className="italic">{APP_TITLE}</span>
                        <FontAwesomeIcon icon={faPencil} width={14} />
                    </NavLink>
                    <button type="button" className="text-onSurface dark:text-onSurface hover:text-onSurfaceActive dark:hover:text-onSurfaceActive cursor-pointer p-1 px-2">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>

                <button onClick={handleNewNoteClick} type="button" className="flex gap-2 justify-center items-center bg-surface py-2 rounded-sm dark:bg-surface hover:bg-surfaceHover dark:hover:bg-surfaceHover dark:active:brightness-110 active:brightness-110 cursor-pointer transition">
                    <FontAwesomeIcon icon={faAdd} />
                    <p>New Note</p>
                </button>
            </div>

            <div className="flex flex-col flex-1 gap-4 overflow-auto">
                <MenuSection label='Recents'>
                    {
                        recentNotes.map((note, index) => {
                            return (
                                <RecentNoteItem
                                    allowNavigation={params.noteId!==note.id}
                                    to={`/folder/${note.folderId}/note-editor/${note.id}`}
                                    key={note.id}
                                    label={note.title}
                                    icon={<FontAwesomeIcon icon={faFile} />}
                                    isActive={(params.noteId === note.id && navigation.state === 'idle') ? true : false}
                                />
                            )
                        })
                    }
                </MenuSection>

                <MenuSection label='Folders' onActionClick={() => setShowNewFolder(true)} icon={showNewFolder ? null : <FontAwesomeIcon icon={faFolderPlus} />}>

                    {
                        showNewFolder && (
                            <fetcher.Form
                                method="post"
                                action="/add-folder"
                                onSubmit={() => newFolderInputRef.current?.blur()}
                                ref={newFolderRef}
                                className={`text-onSurface p-2 cursor-pointer transition flex items-center gap-3`}
                            >
                                <FontAwesomeIcon icon={faFolder} />
                                <input
                                    type="text"
                                    ref={newFolderInputRef}
                                    name="folder_name"
                                    autoFocus
                                    onBlur={(e) => {
                                        setShowNewFolder(false)
                                    }}
                                    className="outline-none w-3/4" />
                            </fetcher.Form>
                        )
                    }

                    {
                        folders.map((folder, index) => {
                            return (
                                <FolderItem key={folder.id} allowNavigation={params.folderId !== folder.id} folder={folder} />
                            )
                        })
                    }
                </MenuSection>

                <MenuSection label='Settings'>
                    <button type="button" onClick={() => fetcher.submit(null, { action: '/logout', method: 'post' })}
                        className={`w-full text-onSurface hover:text-onSurfaceActive dark:hover:text-onSurfaceActive hover:bg-surfaceHover dark:hover:bg-surfaceHover dark:active:brightness-110 active:brightness-110 p-2 cursor-pointer transition flex items-center justify-between`}
                    >

                        <div className="flex gap-3 items-center">
                            <FontAwesomeIcon icon={faRightFromBracket} />
                            <p className="text-nowrap overflow-hidden text-ellipsis">Logout</p>
                        </div>

                    </button>
                </MenuSection>

            </div>

            <div className="pb-2 text-center">
                <p className="text-xs">Developed with ❤️ by <a href="https://github.com/hisuperaman" target="_blank" className="">hisuperaman</a></p>
            </div>
        </div>
    )
}