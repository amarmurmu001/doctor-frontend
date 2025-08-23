import React from 'react';

const ReviewTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <div className="text-sm text-[#9B51E0] font-medium cursor-pointer">See all &gt;</div>
      </div>
      
      {/* Combined Sunita's Review and Photo Gallery */}
      <div className="bg-[#F2F1F9] rounded-[20px] p-4">
        {/* Sunita Jain's Review */}
        <div className="flex items-start gap-3 mb-4">
          <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
            <img className="object-cover h-12 w-12" src="/icons/shape.png" alt="Sunita Jain" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">Sunita Jain</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((index) => (
                  <img key={index} className="w-4 h-4" src="/icons/icon.png" alt="star" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
            </p>
          </div>
        </div>
        
        {/* Image Gallery */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <img 
              src="/banner.png" 
              alt="Hospital Building" 
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
          <div className="space-y-3">
            <img 
              src="/banner.png" 
              alt="Hospital Interior" 
              className="w-full h-14 object-cover rounded-lg"
            />
            <img 
              src="/banner.png" 
              alt="Clinic Room" 
              className="w-full h-14 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Aryan's Review */}
      <div className="bg-[#F2F1F9] rounded-[20px] p-4">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
            <img className="object-cover h-12 w-12" src="/icons/shape.png" alt="Aryan" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">Aryan</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((index) => (
                  <img key={index} className="w-4 h-4" src="/icons/icon.png" alt="star" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
            </p>
          </div>
        </div>
      </div>

      {/* Abhishek Sharma's Review */}
      <div className="bg-[#F2F1F9] rounded-[20px] p-4">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
            <img className="object-cover h-12 w-12" src="/icons/icon.png" alt="Abhishek Sharma" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">Abhishek Sharma</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((index) => (
                  <img key={index} className="w-4 h-4" src="/icons/icon.png" alt="star" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
            </p>
          </div>
        </div>
      </div>

      {/* Priya Patel's Review */}
      <div className="bg-[#F2F1F9] rounded-[20px] p-4">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
            <img className="object-cover h-12 w-12" src="/icons/icon.png" alt="Priya Patel" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">Priya Patel</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((index) => (
                  <img key={index} className="w-4 h-4" src="/icons/icon.png" alt="star" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
            </p>
          </div>
        </div>
      </div>

      {/* Riya Jaiswal's Review */}
      <div className="bg-[#F2F1F9] rounded-[20px] p-4">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
            <img className="object-cover h-12 w-12" src="/icons/icon.png" alt="Riya Jaiswal" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">Riya Jaiswal</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((index) => (
                  <img key={index} className="w-4 h-4" src="/icons/icon.png" alt="star" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-2 mb-1">
        <button className="bg-black text-white text-xs py-2 px-4 rounded-xl">Post a review</button>
      </div>
    </div>
  );
};

export default ReviewTab;
