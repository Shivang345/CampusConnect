export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
