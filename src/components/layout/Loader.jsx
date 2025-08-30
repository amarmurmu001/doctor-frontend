export default function Loader() {
  return (
    <div className="w-full min-h-[40vh] flex items-center justify-center">
      <div className="relative">
        {/* Google-style spinner with 4 dots */}
        <div className="w-8 h-8 relative">
          {/* Dot 1 - Top */}
          <div
            className="absolute w-1.5 h-1.5 bg-[#7551B2] rounded-full"
            style={{
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              animation: 'google-spinner-1 1.4s ease-in-out infinite'
            }}
          ></div>

          {/* Dot 2 - Right */}
          <div
            className="absolute w-1.5 h-1.5 bg-[#7551B2] rounded-full"
            style={{
              top: '50%',
              right: '0',
              transform: 'translateY(-50%)',
              animation: 'google-spinner-2 1.4s ease-in-out infinite 0.2s'
            }}
          ></div>

          {/* Dot 3 - Bottom */}
          <div
            className="absolute w-1.5 h-1.5 bg-[#7551B2] rounded-full"
            style={{
              bottom: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              animation: 'google-spinner-3 1.4s ease-in-out infinite 0.4s'
            }}
          ></div>

          {/* Dot 4 - Left */}
          <div
            className="absolute w-1.5 h-1.5 bg-[#7551B2] rounded-full"
            style={{
              top: '50%',
              left: '0',
              transform: 'translateY(-50%)',
              animation: 'google-spinner-4 1.4s ease-in-out infinite 0.6s'
            }}
          ></div>
        </div>

        
      </div>
    </div>
  );
}


