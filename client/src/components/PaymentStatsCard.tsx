/**
 * PaymentStatsCard Component
 * 
 * Design Philosophy: Neomorphic card with payment statistics
 * - Shows paid/unpaid count for a trip
 * - Progress bar visualization
 * - Hover effects and smooth transitions
 */

import { CheckCircle2, AlertCircle } from 'lucide-react';

interface PaymentStatsCardProps {
  tripTitle: string;
  tripDate: string;
  totalParticipants: number;
  paidCount: number;
  unpaidCount: number;
}

export function PaymentStatsCard({
  tripTitle,
  tripDate,
  totalParticipants,
  paidCount,
  unpaidCount,
}: PaymentStatsCardProps) {
  const paidPercentage = totalParticipants > 0 ? (paidCount / totalParticipants) * 100 : 0;

  return (
    <div className="group relative">
      {/* Card container with neomorphic styling */}
      <div
        className="relative bg-card text-card-foreground rounded-[16px] p-5
                   shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                   border border-border/30
                   hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]
                   transition-all duration-200 ease-out
                   h-full"
      >
        {/* Header */}
        <div className="mb-4">
          <h3 className="font-poppins font-semibold text-sm text-foreground line-clamp-2">
            {tripTitle}
          </h3>
          <p className="text-xs text-muted-foreground font-inter mt-1">
            {tripDate}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Paid */}
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <p className="text-xs text-green-700 font-inter uppercase tracking-wider">
                Оплачено
              </p>
            </div>
            <p className="font-poppins font-bold text-lg text-green-600">
              {paidCount}
            </p>
          </div>

          {/* Unpaid */}
          <div className="bg-red-50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-xs text-red-700 font-inter uppercase tracking-wider">
                Не оплачено
              </p>
            </div>
            <p className="font-poppins font-bold text-lg text-red-600">
              {unpaidCount}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-inter uppercase tracking-wider">
              Процент оплаты
            </p>
            <p className="text-xs font-poppins font-semibold text-primary">
              {Math.round(paidPercentage)}%
            </p>
          </div>
          <div className="w-full h-2 bg-secondary/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300"
              style={{ width: `${paidPercentage}%` }}
            />
          </div>
        </div>

        {/* Total */}
        <div className="pt-3 border-t border-border/30">
          <p className="text-xs text-muted-foreground font-inter uppercase tracking-wider">
            Всего участников
          </p>
          <p className="font-poppins font-bold text-lg text-foreground mt-1">
            {totalParticipants}
          </p>
        </div>
      </div>
    </div>
  );
}
