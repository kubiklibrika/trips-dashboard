/**
 * SheepLoader Component
 * Animated loader with a sheep jumping over clouds
 */

export function SheepLoader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-100 via-blue-50 to-white flex items-center justify-center z-50">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Sky background */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-sky-50 opacity-50" />

        {/* Main animation container */}
        <div className="relative w-96 h-48">
          {/* Clouds */}
          <div className="absolute left-0 top-12 w-24 h-12 opacity-70 animate-pulse">
            <svg viewBox="0 0 100 50" className="w-full h-full">
              <ellipse cx="50" cy="30" rx="35" ry="18" fill="#E0E7FF" stroke="#C7D2FE" strokeWidth="1.5" />
              <circle cx="25" cy="25" r="15" fill="#E0E7FF" stroke="#C7D2FE" strokeWidth="1.5" />
              <circle cx="75" cy="25" r="12" fill="#E0E7FF" stroke="#C7D2FE" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="absolute right-0 top-24 w-32 h-14 opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}>
            <svg viewBox="0 0 100 50" className="w-full h-full">
              <ellipse cx="50" cy="30" rx="40" ry="20" fill="#E0E7FF" stroke="#C7D2FE" strokeWidth="1.5" />
              <circle cx="20" cy="25" r="18" fill="#E0E7FF" stroke="#C7D2FE" strokeWidth="1.5" />
              <circle cx="80" cy="25" r="14" fill="#E0E7FF" stroke="#C7D2FE" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="absolute left-1/3 bottom-12 w-28 h-12 opacity-50 animate-pulse" style={{ animationDelay: '1s' }}>
            <svg viewBox="0 0 100 50" className="w-full h-full">
              <ellipse cx="50" cy="30" rx="35" ry="18" fill="#E0E7FF" stroke="#C7D2FE" strokeWidth="1.5" />
              <circle cx="25" cy="25" r="15" fill="#E0E7FF" stroke="#C7D2FE" strokeWidth="1.5" />
              <circle cx="75" cy="25" r="12" fill="#E0E7FF" stroke="#C7D2FE" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Sheep - jumping animation */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-16 h-16 animate-bounce" style={{ animationDuration: '1.2s' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Legs */}
              <line x1="30" y1="65" x2="30" y2="85" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" />
              <line x1="50" y1="65" x2="50" y2="85" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" />
              <line x1="70" y1="65" x2="70" y2="85" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" />
              <line x1="85" y1="65" x2="85" y2="85" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" />

              {/* Body - wool outline */}
              <ellipse cx="50" cy="45" rx="28" ry="25" fill="none" stroke="#4B5563" strokeWidth="2.5" />
              <circle cx="35" cy="30" r="12" fill="none" stroke="#4B5563" strokeWidth="2.5" />
              <circle cx="50" cy="25" r="13" fill="none" stroke="#4B5563" strokeWidth="2.5" />
              <circle cx="65" cy="30" r="12" fill="none" stroke="#4B5563" strokeWidth="2.5" />

              {/* Head */}
              <circle cx="50" cy="15" r="10" fill="none" stroke="#4B5563" strokeWidth="2.5" />

              {/* Ears */}
              <ellipse cx="42" cy="8" rx="3" ry="6" fill="none" stroke="#4B5563" strokeWidth="2" />
              <ellipse cx="58" cy="8" rx="3" ry="6" fill="none" stroke="#4B5563" strokeWidth="2" />

              {/* Eyes */}
              <circle cx="46" cy="13" r="1.5" fill="#4B5563" />
              <circle cx="54" cy="13" r="1.5" fill="#4B5563" />

              {/* Snout */}
              <circle cx="50" cy="18" r="2" fill="#4B5563" />

              {/* Tail */}
              <path d="M 75 45 Q 85 40 88 30" stroke="#4B5563" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          {/* Loading text */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-slate-600 font-medium text-sm">Загрузка данных...</p>
            <div className="flex justify-center gap-1 mt-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
