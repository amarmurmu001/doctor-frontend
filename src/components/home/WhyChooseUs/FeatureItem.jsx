

const FeatureItem = ({ 
  number, 
  title, 
  description, 
  
 
}) => {
  return (
    <div className={`flex-1 flex md:gap-2  items-start `}>
      <div className={` font-bold text-6xl md:text-8xl text-white leading-none`}>
        {number}
      </div>
      <div className="flex-1">
        <p className={`text-[9px] md:text-xl font-bold   text-white leading-tight`}>
          {title}
        </p>
        <p className={` text-[9px] md:text-lg text-white mt-1 leading-tight`}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureItem;


