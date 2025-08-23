import QueryItem from "./QueryItem";

export default function QueryList() {
  const queries = [
    { image: "/icons/heart.png", label: "Heart" },
    { image: "/icons/liver.png", label: "Liver" },
    { image: "/icons/lungs.png", label: "Lungs" },
    { image: "/icons/kidney.png", label: "Kidney" },
    { image: "/icons/kidney.png", label: "Kidney" },
    { image: "/icons/kidney.png", label: "Kidney" },
    { image: "/icons/kidney.png", label: "Kidney" },
    { image: "/icons/kidney.png", label: "Kidney" },
    { image: "/icons/kidney.png", label: "Kidney" },
    { image: "/icons/kidney.png", label: "Kidney" },
    { image: "/icons/kidney.png", label: "Kidney" },
    { image: "/icons/kidney.png", label: "Kidney" },
  ];

  const handleQueryClick = (query) => {
    console.log('Query clicked:', query.label);
    // Handle query click logic here
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Query</h2>
        <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">All</button>
      </div>

      {/* Query Items - Horizontal Scrollable Carousel */}
      <div className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2">
        {queries.map((item, index) => (
          <QueryItem 
            key={index} 
            image={item.image} 
            label={item.label} 
            onClick={() => handleQueryClick(item)}
          />
        ))}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
          scrollbar-width: none;  /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;  /* Safari and Chrome */
        }
      `}</style>
    </div>
  );
}


