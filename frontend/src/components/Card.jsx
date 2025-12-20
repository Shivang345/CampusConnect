// src/components/Card.jsx
export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:border-slate-300 hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}
