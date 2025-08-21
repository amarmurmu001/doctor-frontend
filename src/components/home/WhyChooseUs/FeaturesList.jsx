
import FeatureItem from "./FeatureItem";

const FeaturesList = ({ 
  features, 
  numberSize,
  titleSize,
  descriptionSize,
  itemGap 
}) => {
  return (
    <div className={`flex  w-full mb-6`}>
      {features.map((feature) => (
        <FeatureItem
          key={feature.id}
          number={feature.number}
          title={feature.title}
          description={feature.description}
          numberSize={numberSize}
          titleSize={titleSize}
          descriptionSize={descriptionSize}
          gap={itemGap}
        />
      ))}
    </div>
  );
};

export default FeaturesList;


