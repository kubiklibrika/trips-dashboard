/**
 * SheepLoader Component
 * Animated loader with a sheep image
 */

export function SheepLoader() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      {/* Sheep image with bounce animation */}
      <div 
        className="mb-8"
        style={{
          animation: 'sheepBounce 1.5s ease-in-out infinite',
        }}
      >
        <img 
          src="/manus-storage/Снимокэкрана2026-05-04в13.22.40_78f0501a.png"
          alt="Loading sheep"
          className="w-48 h-48 object-contain"
        />
      </div>

      {/* Loading text */}
      <div className="text-center">
        <p className="text-slate-600 font-medium text-sm mb-3">Загрузка данных...</p>
        <div className="flex justify-center gap-1">
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

      {/* CSS Animations */}
      <style>{`
        @keyframes sheepBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
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
