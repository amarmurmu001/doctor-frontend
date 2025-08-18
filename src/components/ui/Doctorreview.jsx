export default function(){
    return(
        <div className="bg-[#F2F1F9] rounded-[20px] p-4 w-[431px] mt-4">
        <h2 className="text-[#9B51E0] text-center font-semibold text-lg mb-4">Doctor Experience</h2>
      
        {[
          { name: "Sunita Jain", image: "/icons/shape.png", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry." },
          { name: "Aryan", image: "/icons/shape.png", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry." },
          { name: "Abhishek Sharma", image: "/icons/shape.png", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry." }
        ].map((doctor, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl w-[310px] h-[82px] flex flex-row gap-[12px] py-[16px] px-[12px] mb-3 ${i % 2 === 0 ? 'ml-0' : 'ml-auto'}`}
          >
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img className="object-cover h-10 w-10" src={doctor.image} alt={doctor.name} />
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-center">
                <h2 className="capitalize font-medium text-sm">{doctor.name}</h2>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <img key={index} className="w-[13.3px] h-[12.6px]" src="/icons/icon.png" alt="star" />
                  ))}
                </div>
              </div>
              <p className="text-[8.31px] text-gray-600">{doctor.text}</p>
            </div>
          </div>
        ))}
      
        <div className="flex justify-center mt-2 mb-1">
          <button className="bg-black text-white text-xs py-2 px-4 rounded-xl">Post a review</button>
        </div>
        <div className="text-center text-sm text-[#9B51E0] font-medium underline cursor-pointer">View All &gt;</div>
      </div>
    );
}