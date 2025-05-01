export default function DropDownMenu({ xsText, children }) {
    return (
        <div className={`${xsText ? 'text-xs' : ''} dark:bg-surface rounded-md overflow-hidden py-1 select-none`}>
            {children}
        </div>
    )
}