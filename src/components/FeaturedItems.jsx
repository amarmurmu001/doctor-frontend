

const FeatureItem = ({ 
  number, 
  title, 
  description, 
  
 
}) => {
  return (
    <div className={`flex-1 flex  items-start `}>
      <div className={` font-bold text-7xl text-white leading-none`}>
        {number}
      </div>
      <div className="flex-1">
        <p className={`text-[11px] font-bold text-white leading-tight`}>
          {title}
        </p>
        <p className={` text-[11px] text-white mt-1 leading-tight`}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureItem;
