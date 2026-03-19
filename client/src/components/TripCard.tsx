/**
 * TripCard Component
 * 
 * Design Philosophy: Liquid Glass style with frosted glass effect and location-based backgrounds
 * - Backdrop blur for glass effect
 * - Semi-transparent background with gradient based on location
 * - Soft shadow for depth
 * - Rounded corners: 16px
 * - Hover effect: Enhanced glass effect with more blur
 * - Smooth transitions: 0.2s ease-out
 * - Click to open participants modal
 * - Location-based colors:
 *   - Turkey: Cyan/Blue gradient
 *   - Dagestan: Amber/Orange gradient
 *   - Chegem: Slate/Blue gradient
 *   - Default: Slate gradient
 */

import { CheckCircle2, AlertCircle } from 'lucide-react';

interface Participant {
  name: string;
  paymentStatus: string;
}

interface TripCardProps {
  title: string;
  date: string;
  participants: number;
  participantsList?: Participant[];
  onOpenModal?: () => void;
}

export function TripCard({ title, date, participants, participantsList = [], onOpenModal }: TripCardProps) {
  // Determine background based on location
  const getBackgroundStyle = (title: string) => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('турция') || lowerTitle.includes('анталья') || lowerTitle.includes('олюдениз')) {
      return 'from-cyan-300/25 via-blue-300/20 to-sky-300/15';
    } else if (lowerTitle.includes('дагестан')) {
      return 'from-amber-300/25 via-orange-300/20 to-yellow-300/15';
    } else if (lowerTitle.includes('чегем')) {
      return 'from-slate-400/20 via-blue-400/15 to-slate-500/10';
    }
    
    return 'from-slate-300/15 via-slate-300/10 to-slate-400/5';
  };

  const backgroundGradient = getBackgroundStyle(title);

  // Calculate payment stats
  const paidCount = participantsList.filter(
    p => p.paymentStatus === 'paid'
  ).length;
  const unpaidCount = participantsList.filter(
    p => p.paymentStatus === 'unpaid'
  ).length;

  return (
    <div className="group relative">
      {/* Card container with Liquid Glass styling and location-based background */}
      <div
        className={`relative rounded-[16px] p-5
                   shadow-[0_8px_32px_rgba(0,0,0,0.1)]
                   border border-white/30
                   hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]
                   transition-all duration-200 ease-out
                   cursor-pointer h-full
                   backdrop-blur-md
                   bg-gradient-to-br ${backgroundGradient}
                   hover:backdrop-blur-lg`}
        onClick={onOpenModal}
      >
        {/* Header */}
        <div className="mb-4">
          <h3 className="font-poppins font-semibold text-sm text-foreground line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground font-inter mt-1">
            {date}
          </p>
        </div>

        {/* Participants count - Large display */}
        <div className="mb-4 pb-4 border-b border-border/20">
          <p className="text-xs text-muted-foreground font-inter uppercase tracking-wider mb-2">
            Участники
          </p>
          <p className="font-poppins font-bold text-3xl text-primary">
            {participants}
          </p>
        </div>

        {/* Payment Stats */}
        {participantsList.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {/* Paid */}
            <div className="bg-green-50/80 backdrop-blur-sm rounded-lg p-2.5">
              <div className="flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                <p className="text-xs text-green-700 font-inter font-semibold">
                  Оплачено
                </p>
              </div>
              <p className="font-poppins font-bold text-base text-green-600">
                {paidCount}
              </p>
            </div>

            {/* Unpaid */}
            <div className="bg-red-50/80 backdrop-blur-sm rounded-lg p-2.5">
              <div className="flex items-center gap-1 mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                <p className="text-xs text-red-700 font-inter font-semibold">
                  Не оплачено
                </p>
              </div>
              <p className="font-poppins font-bold text-base text-red-600">
                {unpaidCount}
              </p>
            </div>
          </div>
        )}

        {/* Click hint */}
        <div className="absolute inset-0 rounded-[16px] bg-black/0 group-hover:bg-black/5 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="text-xs font-poppins font-semibold text-foreground/70">
            Нажми
          </span>
        </div>
      </div>
    </div>
  );
}
