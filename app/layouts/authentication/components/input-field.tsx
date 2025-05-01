export default function InputField({ name, required, type, placeholder, onChange }) {
    return (
        <input
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            name={name}
            className="dark:bg-primary bg-primary p-2 outline-none transition border-b-1 border-separator focus:border-onSurface dark:border-separator dark:focus:border-onSurface transition duration-50 w-full"
            type={type||'text'}
        />
    )
}