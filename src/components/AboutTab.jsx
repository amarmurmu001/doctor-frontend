import React from 'react';

const AboutTab = ({ doctor }) => {
  return (
    <div className="space-y-6">
      {/* Hospital Images Gallery */}
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-2">
          <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0">
            <img 
              src="/banner.png" 
              alt="Hospital Exterior" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0">
            <img 
              src="/banner.png" 
              alt="Hospital Interior" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0">
            <img 
              src="/banner.png" 
              alt="Patient Room" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">About</h3>
        <p className="text-gray-600">
          {doctor?.about || 'No description provided yet.'}
        </p>
      </div>

      {/* Key Specialization */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Key Specialization</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span className="text-gray-600 text-base">{doctor?.specialty || 'General'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span className="text-gray-600 text-base">{doctor?.clinicName ? `Clinic: ${doctor.clinicName}` : '—'}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span className="text-gray-600 text-base">{typeof doctor?.consultationFee === 'number' ? `Fee: ₹${doctor.consultationFee}` : 'Fee: —'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span className="text-gray-600 text-base">{doctor?.city || '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Education */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Education</h3>
        <div className="space-y-2 text-gray-600">
          {(doctor?.education && doctor.education.length) ? doctor.education.map((ed, i) => (
            <div key={i}>
              <p className="font-medium">{ed}</p>
            </div>
          )) : <p>No education details provided.</p>}
        </div>
      </div>

      {/* Awards */}
      <h3 className="text-lg font-semibold mb-2">Awards</h3>
      <div className='bg-[#f6f6f6] shadow-[0_13.2px_13.2px_0_rgba(0,0,0,0.25)] rounded-lg p-1'>
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 bg-[#f6f6f6] rounded-lg flex-shrink-0">
            <img 
              src="/banner.png" 
              alt="Award Certificate" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <p className="text-gray-600">
              Gairdner Foundation International Award 2017 Gairdner Institute
            </p>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Languages</h3>
        <p className="text-gray-600">{(doctor?.languages && doctor.languages.length) ? doctor.languages.join(', ') : '—'}</p>
      </div>
    </div>
  );
};

export default AboutTab;
