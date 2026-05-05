/**
 * TripCard Component
 * 
 * Design Philosophy: Clean and minimal with focus on information hierarchy
 * - Simplified layout with better spacing
 * - Minimalist stat boxes without excessive styling
 * - Subtle colors that don't overwhelm
 * - Smooth interactions and hover effects
 * - Click to open participants modal
 */

import { Users } from 'lucide-react';

interface Participant {
  name: string;
  paymentStatus: string;
  program: string;
}

interface TripCardProps {
  title: string;
  date: string;
  participants: number;
  participantsList?: Participant[];
  onOpenModal?: () => void;
  isPassed?: boolean;
}

export function TripCard({ title, date, participants, participantsList = [], onOpenModal, isPassed = false }: TripCardProps) {
  // Determine background based on if trip has passed
  const getBackgroundStyle = (isPassed: boolean) => {
    if (isPassed) {
      return 'bg-gradient-to-br from-gray-100/50 to-gray-50/30 border-gray-200/40';
    }
    return 'bg-gradient-to-br from-blue-50/40 to-cyan-50/20 border-blue-200/30';
  };

  const backgroundStyle = getBackgroundStyle(isPassed);

  // Calculate payment stats
  const paidCount = participantsList.filter(
    p => p.paymentStatus === 'paid'
  ).length;
  const unpaidCount = participantsList.filter(
    p => p.paymentStatus === 'unpaid'
  ).length;

  // Calculate program stats
  const beginnerCount = participantsList.filter(
    p => p.program && p.program.toLowerCase().includes('с нуля')
  ).length;
  const otherProgramCount = participantsList.filter(
    p => p.program && !p.program.toLowerCase().includes('с нуля')
  ).length;

  return (
    <div className="group relative h-full">
      {/* Card container - Clean and minimal */}
      <div
        className={`relative rounded-xl p-4 h-full
                   shadow-sm hover:shadow-md
                   border
                   transition-all duration-200 ease-out
                   cursor-pointer
                   backdrop-blur-sm
                   ${backgroundStyle}`}
        onClick={onOpenModal}
      >
        {/* Header section */}
        <div className="mb-4">
          <h3 className="font-poppins font-semibold text-sm text-foreground line-clamp-2 leading-tight">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground font-inter mt-1.5">
            {date}
          </p>
        </div>

        {/* Main participants count */}
        <div className="mb-4 pb-4 border-b border-border/20">
          <div className="flex items-baseline gap-2">
            <p className="font-poppins font-bold text-2xl text-primary">
              {participants}
            </p>
            <p className="text-xs text-muted-foreground font-inter">
              участников
            </p>
          </div>
        </div>

        {/* Stats grid - Minimal style */}
        {participantsList.length > 0 && (
          <div className="space-y-2">
            {/* Payment row */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Оплачено</span>
              </div>
              <span className="font-semibold text-foreground">{paidCount}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-muted-foreground">Не оплачено</span>
              </div>
              <span className="font-semibold text-foreground">{unpaidCount}</span>
            </div>

            {/* Program row */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-border/20">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">С нуля</span>
              </div>
              <span className="font-semibold text-foreground">{beginnerCount}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span className="text-muted-foreground">Другие</span>
              </div>
              <span className="font-semibold text-foreground">{otherProgramCount}</span>
            </div>
          </div>
        )}

        {/* Hover overlay hint */}
        <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/3 transition-colors duration-200 opacity-0 group-hover:opacity-100 pointer-events-none" />
      </div>
    </div>
  );
}
