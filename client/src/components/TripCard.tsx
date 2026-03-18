/**
 * TripCard Component
 * 
 * Design Philosophy: Neomorphic style with soft shadows and muted colors
 * - Soft shadow: 0 8px 24px rgba(0,0,0,0.08)
 * - Rounded corners: 16px
 * - Hover effect: Lift-up with increased shadow
 * - Smooth transitions: 0.2s ease-out
 * - Click to open participants modal
 * - Color coding by participant count:
 *   - 10-12: Green (ideal)
 *   - >12: Orange (over capacity)
 *   - 5-10: Light green (acceptable)
 *   - <5: White (low)
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
    if (count >= 10 && count <= 12) {
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        accent: 'text-green-700',
        accentBg: 'bg-green-100',
      };
    } else if (count > 12) {
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        accent: 'text-orange-700',
        accentBg: 'bg-orange-100',
      };
    } else if (count > 5 && count < 10) {
      return {
        bg: 'bg-lime-50',
        border: 'border-lime-200',
        accent: 'text-lime-700',
        accentBg: 'bg-lime-100',
      };
    } else {
      return {
        bg: 'bg-card',
        border: 'border-border/30',
        accent: 'text-foreground',
        accentBg: 'bg-secondary/50',
      };
    }
  };

  const colorScheme = getColorScheme(participants);

  // Calculate payment stats
  const paidCount = participantsList.filter(
    p => p.paymentStatus === 'оплачено'
  ).length;
  const unpaidCount = participantsList.filter(
    p => p.paymentStatus === 'не оплачено'
  ).length;
  const paidPercentage = participants > 0 ? (paidCount / participants) * 100 : 0;

  return (
    <div className="group relative">
      {/* Card container with color-coded styling */}
      <div
        className={`relative ${colorScheme.bg} text-card-foreground rounded-[16px] p-5
                   shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                   border ${colorScheme.border}
                   hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]
                   transition-all duration-200 ease-out
                   cursor-pointer h-full`}
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
          <p className={`font-poppins font-bold text-3xl ${colorScheme.accent}`}>
            {participants}
          </p>
        </div>

        {/* Payment Stats */}
        {participantsList.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-2 mb-4">
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

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-muted-foreground font-inter uppercase tracking-wider">
                  Оплачено
                </p>
                <p className="text-xs font-poppins font-semibold text-green-600">
                  {Math.round(paidPercentage)}%
                </p>
              </div>
              <div className="w-full h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300"
                  style={{ width: `${paidPercentage}%` }}
                />
              </div>
            </div>
          </>
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
