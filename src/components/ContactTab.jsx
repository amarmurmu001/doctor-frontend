import React, { useEffect, useRef, useCallback } from 'react';

const ContactTab = ({ doctor }) => {
  const mapRef = useRef(null);

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !doctor?.address?.location?.coordinates || !window.google) return;

    const [lng, lat] = doctor.address.location.coordinates;
    
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 15,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    new window.google.maps.Marker({
      position: { lat, lng },
      map: map,
      title: doctor.clinicName || doctor.user?.clinicName || `Dr. ${doctor.user?.name}'s Clinic`,
      icon: {
        url: 'data:image/svg+xml;base64,' + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ef4444">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(32, 32)
      }
    });


  }, [doctor]);

  const loadGoogleMapsScript = useCallback(() => {
    if (window.google && window.google.maps) {
  
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
  
      initializeMap();
    };
    script.onerror = () => {
      console.error('Failed to load Google Maps script');
    };
    document.head.appendChild(script);
  }, [initializeMap]);

  useEffect(() => {
    if (doctor?.address?.location?.coordinates && window.google) {
      initializeMap();
    } else if (doctor?.address?.location?.coordinates) {
      loadGoogleMapsScript();
    }
  }, [doctor, initializeMap, loadGoogleMapsScript]);



  // Get current date and next 7 days for timing
  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase(),
        dayNumber: date.getDate(),
        isToday: i === 0
      });
    }
    return days;
  };

  const next7Days = getNext7Days();
  return (
    <div className="space-y-6">
      {/* Location Heading */}
      <h3 className="text-lg font-semibold">Location</h3>
      
      {/* Location Section */}
      <div className="bg-[#f2f1f9] rounded-[20px] p-4 shadow-sm">
        {/* Map Container */}
        <div className="relative mb-4">
          <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
            {doctor?.address?.location?.coordinates ? (
              <div 
                ref={mapRef}
                className="w-full h-full"
                style={{ minHeight: '192px' }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-2xl mb-2">🗺️</div>
                  <p className="text-sm">Location not available</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Address Block */}
        <div className="bg-[#c3b8dc] rounded-2xl p-4 mb-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            {doctor?.address ? (
              <>
                {doctor.address.line1}
                {doctor.address.line2 && `, ${doctor.address.line2}`}
                {doctor.address.city && `, ${doctor.address.city}`}
                {doctor.address.state && `, ${doctor.address.state}`}
                {doctor.address.postalCode && ` ${doctor.address.postalCode}`}
                {doctor.address.country && `, ${doctor.address.country}`}
              </>
            ) : (
              '2nd Floor, No. 1, Neeladri Rd, above Samsung Showroom, Karuna Nagar, Electronic City Phase I, Electronic City, Bengaluru, Karnataka 560100'
            )}
          </p>
        </div>
        
        {/* Distance and Time with Directions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">Distance</p>
              <p className="text-sm font-semibold">
                {doctor?.distance || '8 Km'}
              </p>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Time</p>
              <p className="text-sm font-semibold">
                {doctor?.estimatedTime || '15 Mins'}
              </p>
            </div>
          </div>
          
          {/* Directions Button */}
          <button className="w-12 h-12 bg-[#7551B2] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#6B46C1] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Reception Heading with Appointment */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Reception</h3>
        <span className="text-sm text-gray-500">
          (Appointment {doctor?.appointmentHours || '8 AM to 10 PM'})
        </span>
      </div>
      
      {/* Reception Section */}
      <div className="bg-[#f2f1f9] rounded-[20px] p-4 shadow-sm">
        {/* Contact Options */}
        <div className="space-y-3">
          {/* Phone Numbers */}
          {(doctor?.contactPhones?.length > 0 ? doctor.contactPhones : ['+91 68753 4234']).map((phone, index) => (
            <div key={`phone-${index}`} className="bg-[#c3b8dc] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#7551B2] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.554.89l.833 4.223M3 5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2M3 5a2 2 0 012-2h3.28a1 1 0 01.554.89l.833 4.223M3 5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2" />
                </svg>
              </div>
              <span className="text-lg font-bold text-black" style={{fontWeight: 700}}>
                {phone}
              </span>
            </div>
          ))}

          {/* WhatsApp - First phone number */}
          <div className="bg-[#c3b8dc] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-black" style={{fontWeight: 700}}>
              {doctor?.contactPhones?.[0] || '+91 68753 4234'}
            </span>
          </div>

          {/* Email Addresses */}
          {(doctor?.contactEmails?.length > 0 ? doctor.contactEmails : ['support@doctor.com']).map((email, index) => (
            <div key={`email-${index}`} className="bg-[#c3b8dc] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#EA4335] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-black" style={{fontWeight: 700}}>
                {email}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Heading */}
      <h3 className="text-lg font-semibold">Doctor</h3>
      
      {/* Doctor Section */}
      <div className="bg-[#f2f1f9] rounded-[20px] p-4 shadow-sm">
        <div className="mb-3">
          <p className="text-sm text-gray-600">
            Direct contact with {doctor?.user?.name || 'Dr. '} 
            {doctor?.clinicName ? ` at ${doctor.clinicName}` : ''}
          </p>
        </div>
        
        {/* Contact Options */}
        <div className="space-y-3">
          {/* Phone Numbers (same as reception for now) */}
          {(doctor?.contactPhones?.length > 0 ? doctor.contactPhones.slice(0, 2) : ['+91 68753 4234']).map((phone, index) => (
            <div key={`doctor-phone-${index}`} className="bg-[#c3b8dc] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#7551B2] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.554.89l.833 4.223M3 5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2M3 5a2 2 0 012-2h3.28a1 1 0 01.554.89l.833 4.223M3 5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2" />
                </svg>
              </div>
              <span className="text-lg font-bold text-black" style={{fontWeight: 700}}>
                {phone}
              </span>
            </div>
          ))}

          {/* WhatsApp */}
          <div className="bg-[#c3b8dc] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-black" style={{fontWeight: 700}}>
              {doctor?.contactPhones?.[0] || '+91 68753 4234'}
            </span>
          </div>

          {/* Email */}
          <div className="bg-[#c3b8dc] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#7551B2] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-black" style={{fontWeight: 700}}>
              {doctor?.contactEmails?.[0] || 'support@doctor.com'}
            </span>
          </div>
        </div>
      </div>

      {/* Timing Heading */}
      <h3 className="text-lg font-semibold">Timing</h3>
      
      {/* Timing Section */}
      <div className="bg-[#f2f1f9] rounded-[20px] p-4 shadow-sm">
        {/* Days List */}
        <div className="space-y-3">
          {next7Days.map((day, index) => {
            const isToday = day.isToday;
            const hasSlots = doctor?.slots?.find(slot => 
              new Date(slot.date).toDateString() === day.date.toDateString()
            );
            
            return (
              <div key={index} className="flex gap-3">
                <div className={`w-20 h-16 border border-black rounded-lg flex flex-col items-center justify-center ${
                  isToday 
                    ? 'bg-[#7551B2] text-white' 
                    : 'bg-white text-gray-700'
                }`}>
                  <span className="text-xs font-medium">{day.dayName}</span>
                  <span className="text-lg font-bold">{day.dayNumber}</span>
                </div>
                <div className="flex-1 bg-white border border-black rounded-lg p-3">
                  {hasSlots && hasSlots.times?.length > 0 ? (
                    <div className="space-y-1">
                      {hasSlots.times.map((time, timeIndex) => (
                        <p key={timeIndex} className={`text-sm font-medium ${
                          isToday ? 'text-[#7551B2]' : 'text-gray-700'
                        } ${isToday && timeIndex === 0 ? 'underline' : ''}`}>
                          {time}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 font-medium">
                      {isToday
                        ? (doctor?.noSlotsMessage || 'No slots available today')
                        : (doctor?.defaultTiming || '7:00 AM to 9:30 PM')
                      }
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContactTab;
