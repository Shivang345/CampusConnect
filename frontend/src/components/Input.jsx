export default function Input({ label, ...props }) {
  return (
    <label className="block">
      {label && <div className="text-sm mb-1 text-gray-600">{label}</div>}
      <input
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
        {...props}
      />
    </label>
  );
}
