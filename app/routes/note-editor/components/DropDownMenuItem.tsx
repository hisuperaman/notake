export default function DropDownMenuItem({ label, icon, isActive, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`${isActive ? 'bg-surfaceActive dark:bg-surfaceActive' : 'hover:bg-surfaceHover dark:hover:bg-surfaceHover active:bg-surfaceActive dark:active:bg-surfaceActive '} flex gap-2 items-center cursor-pointer p-2`}
        >
            <div className="">
                {icon}
            </div>
            <p>{label}</p>
        </div>
    )
}