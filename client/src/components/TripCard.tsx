/**
 * TripCard Component
 * 
 * Design Philosophy: Liquid Glass style with frosted glass effect
 * - Backdrop blur for glass effect
 * - Semi-transparent background with RGBA
 * - Soft shadow for depth
 * - Rounded corners: 16px
 * - Hover effect: Enhanced glass effect with more blur
 * - Smooth transitions: 0.2s ease-out
 * - Click to open participants modal
 * - Color coding by participant count:
 *   - 10-12: Soft yellow background
 *   - >12: Soft yellow background
 *   - <12: Frosted glass effect
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
  // Determine color based on participant count
  const getColorScheme = (count: number) => {
    if (count >= 12) {
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        accent: 'text-yellow-700',
      };
    } else {
      return {
        bg: 'bg-card',
        border: 'border-border/30',
        accent: 'text-foreground',
      };
    }
  };

  const colorScheme = getColorScheme(participants);

  // Calculate payment stats
  const paidCount = participantsList.filter(
    p => p.paymentStatus === 'paid'
  ).length;
  const unpaidCount = participantsList.filter(
    p => p.paymentStatus === 'unpaid'
  ).length;

  return (
    <div className="group relative">
      {/* Card container with Liquid Glass styling */}
      <div
        className={`relative rounded-[16px] p-5
                   shadow-[0_8px_32px_rgba(0,0,0,0.1)]
                   border border-white/20
                   hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]
                   transition-all duration-200 ease-out
                   cursor-pointer h-full
                   backdrop-blur-md
                   ${colorScheme.bg === 'bg-yellow-50' 
                     ? 'bg-yellow-50/80 border-yellow-200/30' 
                     : 'bg-white/10 border-white/20'}
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
            <div className="bg-green-50 rounded-lg p-2.5">
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
            <div className="bg-red-50 rounded-lg p-2.5">
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
