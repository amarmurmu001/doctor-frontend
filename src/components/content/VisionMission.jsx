export default function VisionMission() {
  return (
    <div className="flex h-[212px] lg:h-[265px] gap-1 lg:gap-4 text-white p-1 lg:p-4">
        <div className="flex-col flex-1 bg-[#7551b3] rounded-xl p-[8px] lg:p-6 lg:w-[490px]">
          <h2 className="text-2xl lg:text-2xl font-bold  lg:font-[500]">Vision</h2>
          <p className="text-[16px] lg:text-2xl lg:font-[500] lg:leading-relaxed">
            smarter tech - powered marketplace where discovery meets<br/> precision
            <br />and trust."
          </p>
        </div>
        <div className="flex-col flex-1 bg-[#313131] rounded-xl p-[8px] lg:p-6 lg:w-[490px]">
         <h2 className="text-2xl lg:text-2xl font-bold lg:font-[500]">Mission</h2> 
          <p className="text-[14px] lg:text-2xl lg:font-[500] lg:leading-relaxed">
            Rapid advancements in AI automation, cloud-native systems, voice
            interfaces, Hyper-Personalization, secure, and scale our platform
            worldwide.
          </p>
        </div>
      </div>
  );
}


