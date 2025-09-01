export default function ResultCount({ count, department, location }) {
  const departmentName = department ? `${department.charAt(0).toUpperCase() + department.slice(1)} ` : '';
  return (
    <div className="px-4 py-3">
      <h2 className="text-xl font-bold">
        {count} {departmentName}Doctors Found in {location}
      </h2>
    </div>
  );
}


