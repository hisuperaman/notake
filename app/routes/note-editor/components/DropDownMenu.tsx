import type { DropDownMenuType } from "types";

export default function DropDownMenu({ xsText=false, children }: DropDownMenuType) {
    return (
        <div className={`${xsText ? 'text-xs' : ''} dark:bg-surface rounded-md overflow-hidden py-1 select-none`}>
            {children}
        </div>
    )
}