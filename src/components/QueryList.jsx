import QueryItem from "./QueryItem";

export default function QueryList() {
  const queries = [
    { image: "/icons/heart.png", label: "Heart" },
    { image: "/icons/liver.png", label: "Liver" },
    { image: "/icons/lungs.png", label: "Lungs" },
    { image: "/icons/kidney.png", label: "Kidney" },
  ];

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Query</h2>
        <button className="text-sm text-gray-500">All</button>
      </div>

      {/* Query Items */}
      <div className="flex gap-5 overflow-x-auto pb-2">
        {queries.map((item, index) => (
          <QueryItem key={index} image={item.image} label={item.label} />
        ))}
      </div>
    </div>
  );
}
