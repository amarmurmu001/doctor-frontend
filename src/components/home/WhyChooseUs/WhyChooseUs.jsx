import React from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../stores/useAuthStore";
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
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  // Check if user is signed in
  const isSignedIn = user && token;
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

        {/* Apply Now Button - Only show for non-signed-in users */}
        {!isSignedIn && (
          <div className="flex justify-end mb-1">
            <button
              onClick={() => navigate("/auth/signup")}
              className={`${buttonColor} text-white px-6 border py-2 sm:px-8 sm:py-3 rounded-2xl font-semibold hover:opacity-90 transition-colors text-sm sm:text-base`}
            >
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhyChooseUs;
