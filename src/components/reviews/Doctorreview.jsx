export default function(){
    return(
        <div className="bg-[#F2F1F9] rounded-[20px] p-3 sm:p-4 m-2 mt-4 h-full">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-[#9B51E0] text-center font-semibold text-base sm:text-lg">Doctor Experience</h2>
          <div className="text-sm text-[#9B51E0] font-medium cursor-pointer hover:text-[#7C3AED] transition-colors">View All &gt;</div>
        </div>
      
        {[
          { name: "Sunita Jain", image: "/icons/shape.png", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry." },
          { name: "Aryan", image: "/icons/shape.png", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry." },
          { name: "Abhishek Sharma", image: "/icons/shape.png", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry." }
        ].map((doctor, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl w-full max-w-[310px] md:w-[348px] md:max-w-[348px] h-[70px] sm:h-[82px] md:h-[92px] flex flex-row gap-2 sm:gap-[12px] py-3 sm:py-[16px] px-2 sm:px-[12px] mb-2 sm:mb-3 ${i % 2 === 0 ? 'ml-0' : 'ml-auto'}`}
          >
            <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-10 md:w-10 rounded-full overflow-hidden flex-shrink-0">
              <img className="object-cover h-8 w-8 sm:h-10 sm:w-10 md:h-10 md:w-10" src={doctor.image} alt={doctor.name} />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h2 className="capitalize font-medium text-xs sm:text-sm truncate">{doctor.name}</h2>
                <div className="flex gap-1 flex-shrink-0">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <img key={index} className="w-3 h-3 sm:w-[13.3px] sm:h-[12.6px]" src="/icons/icon.png" alt="star" />
                  ))}
                </div>
              </div>
              <p className="text-[7px] sm:text-[8.31px] text-gray-600 line-clamp-2 leading-tight">{doctor.text}</p>
            </div>
          </div>
        ))}
      
        <div className="flex justify-center mt-2 mb-1">
          <button className="bg-black text-white text-xs py-2 px-4 rounded-xl hover:bg-gray-800 transition-colors">Post a review</button>
        </div>
      </div>
    );
}


