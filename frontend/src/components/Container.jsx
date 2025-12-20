// src/components/Container.jsx
export default function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto flex w-full max-w-5xl flex-col px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
