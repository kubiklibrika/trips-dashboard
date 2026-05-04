/**
 * SheepLoader Component
 * Animated loader with hand-drawn sheep jumping
 */

export function SheepLoader() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <style>{`
        .loader {
          width: 160px;
          height: 160px;
          position: relative;
        }

        .loader svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* Shadow */
        .shadow {
          position: absolute;
          bottom: 10px;
          left: 50%;
          width: 60px;
          height: 12px;
          background: rgba(0,0,0,0.15);
          border-radius: 50%;
          transform: translateX(-50%);
          animation: shadowScale 1.4s infinite ease-in-out;
        }

        @keyframes shadowScale {
          0%, 100% { transform: translateX(-50%) scaleX(1); opacity: 0.2; }
          20% { transform: translateX(-50%) scaleX(0.7); opacity: 0.1; }
          40% { transform: translateX(-50%) scaleX(1.1); opacity: 0.25; }
        }

        /* Sheep animation */
        .sheep {
          transform-origin: center bottom;
          animation: jump 1.4s infinite ease-in-out;
        }

        @keyframes jump {
          0%   { transform: translateY(0) scaleY(1); }
          15%  { transform: translateY(-20px) scaleY(1.05); }
          30%  { transform: translateY(0) scaleY(0.9); }
          45%  { transform: translateY(0) scaleY(1.02); }
          100% { transform: translateY(0) scaleY(1); }
        }

        /* Legs running */
        .leg {
          transform-origin: top center;
          animation: run 0.35s infinite ease-in-out alternate;
        }

        .leg2 { animation-delay: 0.18s; }

        @keyframes run {
          0% { transform: rotate(18deg); }
          100% { transform: rotate(-18deg); }
        }

        /* Hand-drawn jitter */
        .stroke {
          fill: none;
          stroke: #2b4c7e;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          animation: jitter 0.25s infinite linear;
        }

        @keyframes jitter {
          0% { stroke-width: 2.4; }
          50% { stroke-width: 2.8; }
          100% { stroke-width: 2.4; }
        }
      `}</style>

      <div className="loader">
        <div className="shadow"></div>

        <svg viewBox="0 0 160 120">
          <g className="sheep">

            {/* BODY */}
            <path className="stroke" d="
              M60 80
              C45 78, 40 65, 48 58
              C38 50, 50 38, 65 42
              C68 32, 85 35, 92 45
              C108 40, 118 55, 108 65
              C120 72, 100 88, 82 82
              C75 92, 65 90, 60 80
              Z" />

            {/* HEAD */}
            <path className="stroke" d="
              M38 65
              C28 60, 30 48, 40 45
              C50 43, 55 52, 48 62
              C45 68, 42 70, 38 65
              Z" />

            {/* EAR */}
            <path className="stroke" d="M34 48 Q22 42 28 55" />

            {/* EYE */}
            <circle cx="45" cy="55" r="2" fill="#2b4c7e" />

            {/* LEGS */}
            <line className="stroke leg" x1="78" y1="82" x2="78" y2="110" />
            <line className="stroke leg leg2" x1="95" y1="82" x2="95" y2="110" />

          </g>
        </svg>
      </div>

      {/* Loading text */}
      <div className="text-center mt-8">
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

      <style>{`
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
