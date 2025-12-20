// src/components/Input.jsx
export default function Input({ label, hint, className = "", ...props }) {
  return (
    <label className="block text-sm">
      {label && (
        <div className="mb-1 font-medium text-slate-100">
          {label}
        </div>
      )}
      <input
        className={`w-full rounded-lg border border-slate-300 bg-slate-300 px-3 py-2.5 text-sm text-slate-900 shadow-xs outline-none ring-0 transition placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/30 ${className}`}
        {...props}
      />
      {hint && (
        <p className="mt-1 text-xs text-slate-400">
          {hint}
        </p>
      )}
    </label>
  );
}
