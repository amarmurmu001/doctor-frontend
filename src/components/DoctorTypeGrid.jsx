import DoctorTypeCard from "./DoctorTypeCard";

export default function DoctorTypeGrid({ categories, title, showTopRow = false }) {
  return (
    <div className="px-4 pb-4">
      {title && (
        <h2 className="text-xl font-bold mb-4">{title}</h2>
      )}
      <div className="grid grid-cols-3 gap-4 place-items-center">
        {(showTopRow ? categories.slice(0, 6) : categories).map(({ category, number }, index) => (
          <DoctorTypeCard 
            key={`${showTopRow ? 'top-' : ''}${category}-${index}`} 
            category={category} 
            number={number} 
          />
        ))}
      </div>
    </div>
  );
}
