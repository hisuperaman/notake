export default function Button({ label, type, isPending, disabled, onClick }) {
    return (
        <button
            onClick={onClick}
            type={type || 'button'}
            disabled={isPending || disabled}
            className={`${isPending ? 'animate-pulse' : ''} w-full p-2 dark:bg-surface bg-primary rounded-md hover:bg-surfaceHover active:bg-surfaceActive dark:hover:bg-surfaceHover dark:active:bg-surfaceActive cursor-pointer`}
        >
            {label}
        </button>
    )
}