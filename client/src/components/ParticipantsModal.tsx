/**
 * ParticipantsModal Component - Variant 2: BOLD & MODERN
 * 
 * Design Philosophy: Bold typography with strong visual hierarchy
 * - Large vibrant headline with navy blue color
 * - Accent color bar on left side (blue to purple gradient)
 * - Dates in contrasting orange/coral color
 * - Participant cards with rounded corners and background color
 * - Larger payment status badges with icons
 * - Equipment section with colored tags
 * - Generous padding and spacing
 * - Modern tech feel with smooth rounded corners
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
  telegramNick?: string | null;
  avatarUrl?: string | null;
}

interface ParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle: string;
  tripDate: string;
  participants: Participant[];
}

type PaymentFilter = 'all' | 'paid' | 'unpaid';

/**
 * Avatar Display Component with smart fallback
 */
function AvatarDisplay({ participant }: { participant: Participant }) {
  const [imageError, setImageError] = useState(false);

  // If we have an avatar URL and it hasn't failed, try to load it
  if (participant.avatarUrl && !imageError) {
    // Check if it's a Telegram URL - if so, use CORS proxy
    let imageUrl = participant.avatarUrl;
    if (participant.avatarUrl.includes('t.me/i/userpic')) {
      // Use CORS proxy for Telegram images
      imageUrl = `https://corsproxy.io/?${encodeURIComponent(participant.avatarUrl)}`;
    }
    
    return (
      <img
        src={imageUrl}
        alt={participant.name}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0 shadow-md border-2 border-white"
        onError={() => setImageError(true)}
        loading="lazy"
      />
    );
  }

  // Fallback to DiceBear avatar using telegram nick
  if (participant.telegramNick) {
    const dicebearUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(participant.telegramNick)}&scale=80`;
    return (
      <img
        src={dicebearUrl}
        alt={participant.name}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0 shadow-md border-2 border-white"
        loading="lazy"
      />
    );
  }

  // Last resort: gradient with initials
  const initials = participant.name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
      <span className="text-white font-bold text-sm sm:text-base">
        {initials || '?'}
      </span>
    </div>
  );
}

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

  if (!isOpen) return null;

  const getPaymentBadge = (status: string) => {
    if (status === 'paid') {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full whitespace-nowrap text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-green-700">ОПЛАЧЕНО</span>
        </div>
      );
    } else if (status === 'unpaid') {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-full whitespace-nowrap text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
          <span className="text-orange-700">ОЖИДАЕТ</span>
        </div>
      );
    }
    return null;
  };

  const getEquipmentDisplay = (participant: Participant) => {
    const equipment = [];
    
    if (participant.harness) {
      equipment.push(
        <div key="harness" className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 rounded-lg whitespace-nowrap text-xs font-semibold">
          <Zap className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="text-blue-700 truncate">ПОДВЕСКА</span>
        </div>
      );
    }
    
    if (participant.wing) {
      equipment.push(
        <div key="wing" className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 rounded-lg whitespace-nowrap text-xs font-semibold">
          <Wind className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-green-700 truncate">КРЫЛО</span>
        </div>
      );
    }
    
    if (participant.helmet) {
      equipment.push(
        <div key="helmet" className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 rounded-lg whitespace-nowrap text-xs font-semibold">
          <Shield className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span className="text-red-700 truncate">ШЛЕМ</span>
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
          className="bg-white text-gray-900 rounded-t-3xl sm:rounded-2xl shadow-2xl
                     w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button - positioned absolutely */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 sm:hidden"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>

          {/* Header with accent bar */}
          <div className="relative px-5 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            {/* Accent bar on the left */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r-full" />
            
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Trip title - Large and bold */}
                <h1 className="font-bold text-3xl sm:text-4xl text-gray-900 leading-tight mb-2">
                  {tripTitle}
                </h1>
                
                {/* Trip date - Orange/coral color */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 text-orange-500">📅</div>
                  <p className="font-bold text-lg sm:text-xl text-orange-600">
                    {tripDate}
                  </p>
                </div>

                {/* Stats - Participants count */}
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-sm">
                    {stats.total} УЧАСТНИКОВ
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stats.paid} оплачено • {stats.unpaid} ожидает
                  </div>
                </div>
              </div>

              {/* Close button for desktop */}
              <button
                onClick={onClose}
                className="hidden sm:flex p-2 hover:bg-gray-200 rounded-full transition-colors duration-200 flex-shrink-0"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Search and filter section */}
          <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-gray-200 space-y-3 bg-white">
            {/* Search field */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по имени или фамилии..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 text-gray-900 placeholder-gray-500 text-sm
                           rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           font-medium transition-all duration-200"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setPaymentFilter('all')}
                className={`px-3 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 ${
                  paymentFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ВСЕ
              </button>
              <button
                onClick={() => setPaymentFilter('paid')}
                className={`px-3 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 ${
                  paymentFilter === 'paid'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">ОПЛАЧЕНО</span>
                <span className="sm:hidden">ОПЛ.</span>
              </button>
              <button
                onClick={() => setPaymentFilter('unpaid')}
                className={`px-3 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 ${
                  paymentFilter === 'unpaid'
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span className="hidden sm:inline">ОЖИДАЕТ</span>
                <span className="sm:hidden">ОЖД.</span>
              </button>
            </div>
          </div>

          {/* Participants list */}
          <div className="flex-1 overflow-y-auto">
            {filteredParticipants.length > 0 ? (
              <div className="px-5 sm:px-8 py-4 sm:py-6 space-y-3 sm:space-y-4">
                {filteredParticipants.map((participant, index) => (
                  <div
                    key={index}
                    className="p-4 sm:p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200"
                  >
                    {/* Avatar and Name with payment status */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Avatar with smart fallback */}
                        <AvatarDisplay participant={participant} />
                        
                        {/* Name and telegram nick */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base sm:text-lg text-gray-900 leading-tight">
                            {participant.name}
                          </h3>
                          {participant.telegramNick && (
                            <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
                              @{participant.telegramNick}
                            </p>
                          )}
                        </div>
                      </div>
                      {getPaymentBadge(participant.paymentStatus)}
                    </div>

                    {/* Program */}
                    {participant.program && (
                      <p className="text-xs sm:text-sm text-gray-600 font-medium mb-3 pl-0">
                        {participant.program}
                      </p>
                    )}

                    {/* Equipment tags */}
                    {getEquipmentDisplay(participant) && (
                      <div className="flex flex-wrap gap-2">
                        {getEquipmentDisplay(participant)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 sm:h-40">
                <p className="text-gray-500 font-medium text-center">
                  {searchQuery ? 'Участников не найдено' : 'Нет участников'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
