/**
 * ParticipantsModal Component
 * 
 * Design Philosophy: Neomorphic modal with smooth animations
 * - Displays list of participants for a trip with payment status and program
 * - Search field to filter participants by name
 * - Filter buttons for payment status
 * - Smooth entrance/exit animations
 * - Clean, readable list format
 * - Equipment display (harness, wing, helmet) under each participant
 * - Fully responsive mobile-first design
 */

import { useState, useMemo } from 'react';
import { X, Users, Search, CheckCircle2, AlertCircle, Zap, Wind, Shield } from 'lucide-react';

interface Participant {
  name: string;
  paymentStatus: string;
  program: string;
  harness?: string | null;
  wing?: string | null;
  helmet?: string | null;
}

interface ParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle: string;
  tripDate: string;
  participants: Participant[];
}

type PaymentFilter = 'all' | 'paid' | 'unpaid';

export function ParticipantsModal({
  isOpen,
  onClose,
  tripTitle,
  tripDate,
  participants,
}: ParticipantsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all');

  // Filter participants based on search query and payment status
  const filteredParticipants = useMemo(() => {
    let filtered = participants;

    // Apply payment filter
    if (paymentFilter === 'paid') {
      filtered = filtered.filter(p => p.paymentStatus === 'paid');
    } else if (paymentFilter === 'unpaid') {
      filtered = filtered.filter(p => p.paymentStatus === 'unpaid');
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(participant =>
        participant.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [participants, searchQuery, paymentFilter]);

  // Calculate payment statistics
  const stats = useMemo(() => {
    const paid = participants.filter(p => p.paymentStatus === 'paid').length;
    const unpaid = participants.filter(p => p.paymentStatus === 'unpaid').length;
    return { paid, unpaid, total: participants.length };
  }, [participants]);

  // Calculate program statistics
  const programStats = useMemo(() => {
    const beginners = participants.filter(p => p.program && p.program.toLowerCase().includes('с нуля')).length;
    const others = participants.filter(p => p.program && !p.program.toLowerCase().includes('с нуля')).length;
    return { beginners, others };
  }, [participants]);

  if (!isOpen) return null;

  const getPaymentBadge = (status: string) => {
    if (status === 'paid') {
      return (
        <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-green-50 rounded-full whitespace-nowrap text-xs sm:text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
          <span className="font-medium text-green-700">Оплачено</span>
        </div>
      );
    } else if (status === 'unpaid') {
      return (
        <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-red-50 rounded-full whitespace-nowrap text-xs sm:text-xs">
          <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
          <span className="font-medium text-red-700">Не оплачено</span>
        </div>
      );
    }
    return null;
  };

  const getProgramBadge = (program: string) => {
    if (!program) return null;
    
    const isBeginner = program.toLowerCase().includes('с нуля');
    
    if (isBeginner) {
      return (
        <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-blue-50 rounded-full whitespace-nowrap text-xs sm:text-xs">
          <span className="font-medium text-blue-700">С нуля</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-purple-50 rounded-full whitespace-nowrap text-xs sm:text-xs">
          <span className="font-medium text-purple-700 truncate">{program}</span>
        </div>
      );
    }
  };

  const getEquipmentDisplay = (participant: Participant) => {
    const equipment = [];
    
    if (participant.harness) {
      equipment.push(
        <div key="harness" className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 bg-amber-50 rounded-full whitespace-nowrap text-xs sm:text-xs">
          <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 flex-shrink-0" />
          <span className="font-medium text-amber-700 truncate">{participant.harness}</span>
        </div>
      );
    }
    
    if (participant.wing) {
      equipment.push(
        <div key="wing" className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 bg-cyan-50 rounded-full whitespace-nowrap text-xs sm:text-xs">
          <Wind className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-600 flex-shrink-0" />
          <span className="font-medium text-cyan-700 truncate">{participant.wing}</span>
        </div>
      );
    }
    
    if (participant.helmet) {
      equipment.push(
        <div key="helmet" className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 bg-slate-50 rounded-full whitespace-nowrap text-xs sm:text-xs">
          <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600 flex-shrink-0" />
          <span className="font-medium text-slate-700 truncate">{participant.helmet}</span>
        </div>
      );
    }
    
    return equipment.length > 0 ? equipment : null;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal - Fully responsive */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div
          className="bg-card text-card-foreground rounded-t-2xl sm:rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                     w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col
                     border border-border/50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border/30">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h2 className="font-poppins font-semibold text-base sm:text-xl text-foreground truncate">
                  {tripTitle}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground font-inter">
                  {tripDate}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-secondary rounded-lg transition-colors duration-200 flex-shrink-0 ml-2"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Stats section - Responsive grid */}
          <div className="px-4 sm:px-6 pt-3 sm:pt-4 pb-2 sm:pb-2 border-b border-border/30">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="p-2.5 sm:p-3 bg-secondary/30 rounded-lg">
                <p className="text-xs text-muted-foreground font-inter uppercase tracking-wider mb-1">
                  Всего
                </p>
                <p className="font-poppins font-semibold text-base sm:text-lg text-foreground">
                  {stats.total}
                </p>
              </div>
              <div className="p-2.5 sm:p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700 font-inter uppercase tracking-wider mb-1">
                  Оплачено
                </p>
                <p className="font-poppins font-semibold text-base sm:text-lg text-green-600">
                  {stats.paid}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="p-2.5 sm:p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-red-700 font-inter uppercase tracking-wider mb-1">
                  Не оплачено
                </p>
                <p className="font-poppins font-semibold text-base sm:text-lg text-red-600">
                  {stats.unpaid}
                </p>
              </div>
              <div className="p-2.5 sm:p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 font-inter uppercase tracking-wider mb-1">
                  С нуля
                </p>
                <p className="font-poppins font-semibold text-base sm:text-lg text-blue-600">
                  {programStats.beginners}
                </p>
              </div>
            </div>
          </div>

          {/* Search and filter section - Responsive */}
          <div className="px-4 sm:px-6 pt-3 sm:pt-4 pb-3 sm:pb-4 border-b border-border/30 space-y-2.5 sm:space-y-3">
            {/* Search field */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск по имени..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-secondary/50 text-foreground placeholder-muted-foreground text-sm sm:text-base
                           rounded-lg border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50
                           font-inter transition-all duration-200"
              />
            </div>

            {/* Filter buttons - Responsive */}
            <div className="flex gap-1.5 sm:gap-2 flex-wrap">
              <button
                onClick={() => setPaymentFilter('all')}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-inter text-xs sm:text-sm font-medium transition-all duration-200 ${
                  paymentFilter === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-foreground hover:bg-secondary'
                }`}
              >
                Все
              </button>
              <button
                onClick={() => setPaymentFilter('paid')}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-inter text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                  paymentFilter === 'paid'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Оплачено</span>
                <span className="sm:hidden">Опл.</span>
              </button>
              <button
                onClick={() => setPaymentFilter('unpaid')}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-inter text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                  paymentFilter === 'unpaid'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Не оплачено</span>
                <span className="sm:hidden">Не опл.</span>
              </button>
            </div>
          </div>

          {/* Content - Responsive list */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            {filteredParticipants.length > 0 ? (
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground font-inter uppercase tracking-wider mb-3 sm:mb-4">
                  Найдено: <span className="font-poppins font-semibold text-primary">{filteredParticipants.length}</span>
                  {(searchQuery || paymentFilter !== 'all') && <span className="text-xs ml-2">из {participants.length}</span>}
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  {filteredParticipants.map((participant, index) => {
                    // Find original index for numbering
                    const originalIndex = participants.indexOf(participant);
                    const equipmentDisplay = getEquipmentDisplay(participant);
                    return (
                      <li
                        key={index}
                        className="flex flex-col gap-2 p-3 sm:p-4 rounded-lg hover:bg-secondary/50 transition-colors duration-150 border border-border/20"
                      >
                        {/* Name and badges row */}
                        <div className="flex items-start justify-between gap-2 sm:gap-4">
                          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mt-0.5">
                              <span className="text-xs sm:text-xs font-poppins font-semibold text-primary">
                                {originalIndex + 1}
                              </span>
                            </div>
                            <span className="font-inter text-sm sm:text-base text-foreground font-medium truncate">
                              {participant.name}
                            </span>
                          </div>
                        </div>

                        {/* Status badges - Stacked on mobile */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 pl-8 sm:pl-11">
                          {getProgramBadge(participant.program)}
                          {getPaymentBadge(participant.paymentStatus)}
                        </div>

                        {/* Equipment display - Wrapped on mobile */}
                        {equipmentDisplay && (
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 pl-8 sm:pl-11">
                            {equipmentDisplay}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                <Search className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/30 mb-2 sm:mb-3" />
                <p className="text-sm sm:text-base text-muted-foreground font-inter text-center">
                  {searchQuery || paymentFilter !== 'all' ? 'Участники не найдены' : 'Нет данных об участниках'}
                </p>
              </div>
            )}
          </div>

          {/* Footer - Responsive */}
          <div className="border-t border-border/30 p-3 sm:p-4 flex justify-end gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="px-3 sm:px-4 py-2 sm:py-2 bg-primary text-primary-foreground rounded-lg font-inter text-sm sm:text-base font-medium
                         hover:bg-primary/90 transition-colors duration-200"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
