/**
 * SheepLoader Component
 * Animated loader with a sheep jumping over clouds
 */

export function SheepLoader() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      {/* Main animation container */}
      <div className="relative w-96 h-64 flex items-center justify-center">
        
        {/* Cloud 1 - Left */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-20 h-12">
          <svg viewBox="0 0 100 60" className="w-full h-full">
            <path
              d="M 20 40 Q 15 25 30 20 Q 40 10 55 15 Q 65 10 75 20 Q 85 25 80 40 Z"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Cloud 2 - Right */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-24 h-14">
          <svg viewBox="0 0 100 60" className="w-full h-full">
            <path
              d="M 15 40 Q 10 25 25 18 Q 35 8 50 12 Q 60 5 75 15 Q 88 22 85 40 Z"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Sheep - jumping animation */}
        <div 
          className="absolute w-32 h-32"
          style={{
            animation: 'sheepJump 2s ease-in-out infinite',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Head */}
            <circle cx="50" cy="20" r="12" fill="none" stroke="#4B5563" strokeWidth="2.5" />
            
            {/* Ears */}
            <ellipse cx="42" cy="10" rx="4" ry="8" fill="none" stroke="#4B5563" strokeWidth="2" />
            <ellipse cx="58" cy="10" rx="4" ry="8" fill="none" stroke="#4B5563" strokeWidth="2" />
            
            {/* Eyes */}
            <circle cx="46" cy="18" r="1.5" fill="#4B5563" />
            <circle cx="54" cy="18" r="1.5" fill="#4B5563" />
            
            {/* Snout */}
            <circle cx="50" cy="25" r="2" fill="#4B5563" />

            {/* Body - wool outline with curves */}
            <ellipse cx="50" cy="50" rx="32" ry="28" fill="none" stroke="#4B5563" strokeWidth="2.5" />
            
            {/* Wool texture - circles */}
            <circle cx="35" cy="35" r="13" fill="none" stroke="#4B5563" strokeWidth="2.5" />
            <circle cx="50" cy="30" r="14" fill="none" stroke="#4B5563" strokeWidth="2.5" />
            <circle cx="65" cy="35" r="13" fill="none" stroke="#4B5563" strokeWidth="2.5" />
            <circle cx="40" cy="55" r="12" fill="none" stroke="#4B5563" strokeWidth="2" />
            <circle cx="60" cy="55" r="12" fill="none" stroke="#4B5563" strokeWidth="2" />

            {/* Front left leg */}
            <line x1="35" y1="75" x2="35" y2="95" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" />
            <circle cx="35" cy="97" r="2" fill="#4B5563" />
            
            {/* Front right leg */}
            <line x1="50" y1="78" x2="50" y2="98" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="100" r="2" fill="#4B5563" />
            
            {/* Back left leg */}
            <line x1="65" y1="75" x2="65" y2="95" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" />
            <circle cx="65" cy="97" r="2" fill="#4B5563" />
            
            {/* Back right leg */}
            <line x1="80" y1="75" x2="80" y2="95" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" />
            <circle cx="80" cy="97" r="2" fill="#4B5563" />

            {/* Tail */}
            <path 
              d="M 80 50 Q 92 45 95 35" 
              stroke="#4B5563" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round" 
            />
          </svg>
        </div>

        {/* Loading text */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-slate-600 font-medium text-sm">Загрузка данных...</p>
          <div className="flex justify-center gap-1 mt-2">
            <div 
              className="w-2 h-2 bg-blue-400 rounded-full"
              style={{
                animation: 'dotBounce 1.4s ease-in-out infinite',
                animationDelay: '0s'
              }}
            />
            <div 
              className="w-2 h-2 bg-blue-400 rounded-full"
              style={{
                animation: 'dotBounce 1.4s ease-in-out infinite',
                animationDelay: '0.2s'
              }}
            />
            <div 
              className="w-2 h-2 bg-blue-400 rounded-full"
              style={{
                animation: 'dotBounce 1.4s ease-in-out infinite',
                animationDelay: '0.4s'
              }}
            />
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes sheepJump {
          0% {
            bottom: 0;
            transform: translateX(-50%) scaleX(1);
          }
          25% {
            bottom: 60px;
            transform: translateX(-50%) scaleX(1);
          }
          50% {
            bottom: 0;
            transform: translateX(-50%) scaleX(-1);
          }
          75% {
            bottom: 60px;
            transform: translateX(-50%) scaleX(-1);
          }
          100% {
            bottom: 0;
            transform: translateX(-50%) scaleX(1);
          }
        }

        @keyframes dotBounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
