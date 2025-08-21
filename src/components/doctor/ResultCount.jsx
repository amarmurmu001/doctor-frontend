export default function ResultCount({ count, location }) {
  return (
    <div className="px-4 py-3">
      <h2 className="text-xl font-bold">Total {count} Doctors Found in {location}</h2>
    </div>
  );
}


