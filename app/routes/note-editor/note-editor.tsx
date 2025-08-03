import { APP_TITLE } from "~/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCalendar, faCalendarAlt, faEllipsisH, faEllipsisV, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faBackspace } from "@fortawesome/free-solid-svg-icons/faBackspace";
import TextEditor from "./components/text-editor";
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import DropDownMenu from "./components/DropDownMenu";
import DropDownMenuItem from "./components/DropDownMenuItem";
import SeparatorBorder from "./components/SeparatorBorder";
import { faFolder, faSave, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useDropdownAnimation } from "~/hooks/useDropdownAnimation";
import { useFetcher, useNavigate, useNavigation, useRouteLoaderData } from "react-router";
import { toDatetimeLocalString } from "~/utils/utils";
import dbConnect from "~/utils/db.connect";
import Note from "~/models/note.model";
import { toast } from "react-toastify";
import NoteEditorSkeleton from "~/skeletons/note-editor-skeleton";
import { useDebouncedCallback } from "use-debounce"
import type { FolderSelectionDropdownType, HeaderItemType } from "types";
import type { Route } from "./+types/note-editor";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: `Note Editor | ${APP_TITLE}` },
        { name: "description", content: "Edit Notes" },
    ];
}

export async function loader({ params, request }: Route.LoaderArgs) {
    if (params.noteId == 'new') {
        const note = {
            id: 'new',
            user_created_at: new Date(),
            folder: {
                id: params.folderId,
                name: 'Personal'
            },
            title: 'Title of the note goes here',
            content: 'Note content goes here...'
        }

        return { note }
    }

    await dbConnect()

    const note: any = await Note.findById(params.noteId).populate('folder').lean()


    if (note) {
        note.id = note._id.toString(),
            note.folder.id = note.folder._id.toString()
    }

    return { note }
}

function HeaderItem({ label, icon, children }: HeaderItemType) {
    return (
        <div className="text-xs flex border-b border-separator py-4 gap-16">
            <div className="flex gap-4 items-center text-onSurface dark:text-onSurface w-16">
                {icon}
                <p className="">{label}</p>
            </div>


            {children}
        </div>
    )
}

function FolderSelectionDropdown({ folder, onClick }: FolderSelectionDropdownType) {
    const { isOpen, setIsOpen, dropdownRef, buttonRef } = useDropdownAnimation()
    const { folders } = useRouteLoaderData('layouts/sidebar/sidebar-layout')

    function handleFolderClick(f: any) {
        onClick(f)
        setIsOpen(false)
    }

    return (
        <div className="relative">
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="underline underline-offset-2 cursor-pointer" ref={buttonRef}>
                {folder.name}
            </button>

            <div className="absolute w-48 origin-top-left z-9 max-h-48 overflow-auto hidden scale-0" ref={dropdownRef}>
                <DropDownMenu >
                    {
                        folders.map((f: any, index: Number) => {
                            return (
                                <DropDownMenuItem key={f.id} onClick={() => handleFolderClick(f)} isActive={folder.id == f.id} icon={<FontAwesomeIcon icon={faFolder} />} label={f.name} />
                            )
                        })
                    }
                </DropDownMenu>
            </div>
        </div>
    )
}

export default function NoteEditor({ loaderData, params }: Route.ComponentProps) {
    const { note } = loaderData

    const { isOpen, setIsOpen, dropdownRef, buttonRef } = useDropdownAnimation()

    const [isEditable, setIsEditable] = useState(true)

    const dateRef = useRef(null)

    const [noteContent, setNoteContent] = useState(note.content)
    const [currentFolder, setCurrentFolder] = useState({ id: note.folder.id, name: note.folder.name })

    useEffect(() => {
        setNoteContent(note.content)
        setCurrentFolder({ id: note.folder.id, name: note.folder.name })
    }, [note]);

    useEffect(() => {
        // if (params.noteId == 'new') {
        //     setIsEditable(true)
        // }
        // else {
        //     setIsEditable(false)
        // }
    }, [params.noteId])

    function handleDateClick(e: any) {
        e.preventDefault()
        e.target.showPicker()
    }

    const fetcher = useFetcher()
    const busy = fetcher?.state !== 'idle'

    const suggestionController = useRef<AbortController | null>(null)

    const [suggestion, setSuggestion] = useState('')

    const navigate = useNavigate()

    const navigation = useNavigation()

    const formRef = useRef(null)


    useEffect(() => {
        if (note.id !== 'new') {
            fetcher.submit({ noteId: note.id }, { action: '/log-recent-note', method: 'post' })
        }
    }, [note.id]);


    function handleSaveClick() {
        if (formRef.current) {
            const formData = new FormData(formRef.current)

            if (params.noteId === 'new') {
                fetcher.submit(formData, {
                    action: '/add-note',
                    method: 'post',
                })
                toast.success('Note created!')
            }
            else {
                formData.set('noteId', params.noteId)
                fetcher.submit(formData, {
                    action: '/update-note',
                    method: 'post',
                })
                toast.success('Note updated!')
            }

            setIsOpen(false)
        }
    }

    function handleDeleteClick() {
        const formData = new FormData()

        formData.set('noteId', params.noteId)
        formData.set('folderId', params.folderId)
        fetcher.submit(formData, {
            action: '/destroy-note',
            method: 'post',
        })
        toast.error('Note deleted!')
        setIsOpen(false)
    }


    const handleGetSuggestion = useDebouncedCallback(async (content) => {
        if(suggestionController.current) {
            suggestionController.current.abort()
        }
        if(content.length===0) {
            return
        }

        try {
            suggestionController.current = new AbortController()
            const response = await fetch(`/get-suggestion?content=${content}`, {
                method: 'get',
                signal: suggestionController.current.signal
            })
            if(!response.ok) {
                return
            }
            const data = await response.json()
            setSuggestion(data.suggestion)
        }
        catch(e: any) {
            if(e.name==='AbortError') {
                console.log('aborted')
            }
            else {

            }
        }
    }, 1500)


    if (navigation.state === 'loading') {
        return (
            <NoteEditorSkeleton />
        )
    }

    return (
        <fetcher.Form ref={formRef} className="flex flex-col gap-1 p-4 max-h-full">
            {/* header */}
            <div className="flex justify-between w-full">

                {
                    isEditable ?
                        (<input
                            className="text-2xl font-semibold outline-none w-3/4"
                            type="text"
                            name="title"
                            defaultValue={note.title}
                        />)
                        : (<p className="text-2xl font-semibold">{note.title}</p>)
                }


                <div className="relative">
                    <button ref={buttonRef} type="button" onClick={() => setIsOpen(!isOpen)} className="text-onSurface dark:text-onSurface border rounded-full w-8 h-8 flex justify-center items-center cursor-pointer hover:text-onSurfaceActive dark:hover:text-onSurfaceActive">
                        <FontAwesomeIcon icon={faEllipsisH} />
                    </button>

                    <div ref={dropdownRef} className="z-9 w-48 absolute top-0 mt-8 right-0 hidden scale-0 origin-top-right">
                        <DropDownMenu>
                            <DropDownMenuItem onClick={handleSaveClick} label={'Save'} icon={<FontAwesomeIcon icon={faSave} />} />

                            {
                                params.noteId === 'new' ? ('')
                                    : (
                                        <>
                                            <SeparatorBorder />
                                            <DropDownMenuItem onClick={handleDeleteClick} label={'Delete'} icon={<FontAwesomeIcon icon={faTrashCan} />} />
                                        </>

                                    )
                            }
                        </DropDownMenu>
                    </div>

                </div>

            </div>

            <div className="flex flex-col">
                <div className="relative">
                    <HeaderItem label={'Date'} icon={<FontAwesomeIcon icon={faCalendarAlt} />}>

                        <input type="datetime-local"
                            onClick={handleDateClick}
                            defaultValue={toDatetimeLocalString(note.user_created_at)}
                            ref={dateRef}
                            name="user_created_at"
                            className="underline underline-offset-2 cursor-pointer outline-none" id="" />
                    </HeaderItem>
                </div>

                <input type="hidden" name="folder" value={JSON.stringify(currentFolder)} />
                <HeaderItem label={'Folder'} icon={<FontAwesomeIcon icon={faFolder} />}>
                    <FolderSelectionDropdown
                        folder={currentFolder}
                        onClick={(f) => setCurrentFolder(f)}
                    />
                </HeaderItem>
            </div>

            <input type="hidden" name="content" value={noteContent} />
            <TextEditor
                key={params.noteId}
                onSuggestionAccept={()=>setSuggestion('')}
                suggestion={suggestion}
                content={note.content}
                onChange={(content: string) => {
                    setNoteContent(content)
                }}
                onLastCharacterChange={(lastChar: string) => {
                    // if (lastChar === ' ') {
                        handleGetSuggestion(lastChar)
                    // }
                }}
            />
        </fetcher.Form>
    )
}