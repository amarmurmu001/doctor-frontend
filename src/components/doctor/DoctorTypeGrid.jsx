import DoctorTypeCard from "./DoctorTypeCard";

export default function DoctorTypeGrid({ categories, title, showTopRow = false, onCardClick }) {
  return (
    <div className="px-4 pb-4">
      {title && (
        <h2 className="text-xl font-bold mb-4 text-center sm:text-left">{title}</h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 place-items-center max-w-6xl mx-auto">
        {(showTopRow ? categories.slice(0, 6) : categories).map(({ category, number }, index) => (
          <DoctorTypeCard
            key={`${showTopRow ? 'top-' : ''}${category}-${index}`}
            category={category}
            number={number}
            onClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
}


