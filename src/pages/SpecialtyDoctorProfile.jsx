import React from "react";
import DoctorProfile from "./DoctorProfile";

export default function SpecialtyDoctorProfile() {
  // Simply render the DoctorProfile component
  // The DoctorProfile component will automatically detect the specialists URL format
  // and handle the doctor loading and display
  return <DoctorProfile />;
}
