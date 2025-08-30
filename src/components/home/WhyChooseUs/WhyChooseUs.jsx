import FeaturesList from "./FeaturesList";

const WhyChooseUs = ({
  title = "Why choose us",
  subtitle = "Consultant",
  features = [],
  buttonText = "Apply Now",
  backgroundColor = "bg-[#7551B2]",
  buttonColor = "bg-[#5154B5]",
  onButtonClick = () => {},
}) => {
  return (
    <div>
      <h3 className="text-center md:hidden text-black font-bold text-xl mb-4">
        {title}
      </h3>
      <div className={`${backgroundColor} w-full p-1 md:p-4`}>
        <h2 className="text-center text-white text-2xl mb-2 md:mb-4">
          {subtitle}
        </h2>

        <div className="flex flex-col items-center justify-center p-1 md:p-4 border-1 border-white rounded-3xl  mb-2">
          <h2 className="text-center text-white font text-lg sm:text-xl mb-4">
            Why <span className="font-extrabold text-[#4D9FF1]">DOCTAR</span>{" "}
            for Doctors
          </h2>

          <FeaturesList features={features} />
        </div>

        {/* Apply Now Button */}
        <div className="flex justify-end mb-1">
          <button
            onClick={onButtonClick}
            className={`${buttonColor} text-white px-6 border py-2 sm:px-8 sm:py-3 rounded-2xl font-semibold hover:opacity-90 transition-colors text-sm sm:text-base`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
