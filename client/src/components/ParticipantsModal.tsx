/**
 * ParticipantsModal Component
 * 
 * Design Philosophy: Neomorphic modal with smooth animations
 * - Displays list of participants for a trip with payment status and program
 * - Search field to filter participants by name
 * - Filter buttons for payment status
 * - Smooth entrance/exit animations
 * - Clean, readable list format
 */

import { useState, useMemo } from 'react';
import { X, Users, Search, CheckCircle2, AlertCircle } from 'lucide-react';

interface Participant {
  name: string;
  paymentStatus: string;
  program: string;
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
        <div className="flex items-center gap-1 px-2.5 py-1 bg-green-50 rounded-full">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span className="text-xs font-medium text-green-700">Оплачено</span>
        </div>
      );
    } else if (status === 'unpaid') {
      return (
        <div className="flex items-center gap-1 px-2.5 py-1 bg-red-50 rounded-full">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-xs font-medium text-red-700">Не оплачено</span>
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
        <div className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 rounded-full">
          <span className="text-xs font-medium text-blue-700">С нуля</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 rounded-full">
          <span className="text-xs font-medium text-purple-700">{program}</span>
        </div>
      );
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div
          className="bg-card text-card-foreground rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                     max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col
                     border border-border/50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-poppins font-semibold text-xl text-foreground">
                  {tripTitle}
                </h2>
                <p className="text-sm text-muted-foreground font-inter">
                  {tripDate}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Stats section */}
          <div className="px-6 pt-4 pb-2 border-b border-border/30">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-xs text-muted-foreground font-inter uppercase tracking-wider mb-1">
                  Всего
                </p>
                <p className="font-poppins font-semibold text-lg text-foreground">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700 font-inter uppercase tracking-wider mb-1">
                  Оплачено
                </p>
                <p className="font-poppins font-semibold text-lg text-green-600">
                  {stats.paid}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-red-700 font-inter uppercase tracking-wider mb-1">
                  Не оплачено
                </p>
                <p className="font-poppins font-semibold text-lg text-red-600">
                  {stats.unpaid}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 font-inter uppercase tracking-wider mb-1">
                  С нуля
                </p>
                <p className="font-poppins font-semibold text-lg text-blue-600">
                  {programStats.beginners}
                </p>
              </div>
            </div>
          </div>

          {/* Search and filter section */}
          <div className="px-6 pt-4 pb-4 border-b border-border/30 space-y-3">
            {/* Search field */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск по имени или фамилии..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 text-foreground placeholder-muted-foreground
                           rounded-lg border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50
                           font-inter transition-all duration-200"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setPaymentFilter('all')}
                className={`px-3 py-2 rounded-lg font-inter text-sm font-medium transition-all duration-200 ${
                  paymentFilter === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-foreground hover:bg-secondary'
                }`}
              >
                Все
              </button>
              <button
                onClick={() => setPaymentFilter('paid')}
                className={`px-3 py-2 rounded-lg font-inter text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  paymentFilter === 'paid'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Оплачено
              </button>
              <button
                onClick={() => setPaymentFilter('unpaid')}
                className={`px-3 py-2 rounded-lg font-inter text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  paymentFilter === 'unpaid'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                Не оплачено
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredParticipants.length > 0 ? (
              <div>
                <p className="text-sm text-muted-foreground font-inter uppercase tracking-wider mb-4">
                  Найдено участников: <span className="font-poppins font-semibold text-primary">{filteredParticipants.length}</span>
                  {(searchQuery || paymentFilter !== 'all') && <span className="text-xs ml-2">из {participants.length}</span>}
                </p>
                <ul className="space-y-2">
                  {filteredParticipants.map((participant, index) => {
                    // Find original index for numbering
                    const originalIndex = participants.indexOf(participant);
                    return (
                      <li
                        key={index}
                        className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors duration-150"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <span className="text-xs font-poppins font-semibold text-primary">
                              {originalIndex + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-inter text-foreground truncate block">
                              {participant.name}
                            </span>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {participant.program}
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex gap-2">
                          {getProgramBadge(participant.program)}
                          {getPaymentBadge(participant.paymentStatus)}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Search className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-inter">
                  {searchQuery || paymentFilter !== 'all' ? 'Участники не найдены' : 'Нет данных об участниках'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border/30 p-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-inter font-medium
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
