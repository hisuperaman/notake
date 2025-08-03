import type { ReactNode } from "react"

export type DropDownMenuItemType = {
    label: string
    icon: any
    isActive?: boolean
    onClick: () => void
}

export type DropDownMenuType = {
    xsText?: boolean
    children: ReactNode
}

export type FolderSelectionDropdownType = {
    folder: any
    onClick: (f: any) => void
}

export type HeaderItemType = {
    label: string,
    icon: any
    children: ReactNode
}