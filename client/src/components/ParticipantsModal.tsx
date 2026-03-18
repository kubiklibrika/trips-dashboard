/**
 * ParticipantsModal Component
 * 
 * Design Philosophy: Neomorphic modal with smooth animations
 * - Displays list of participants for a trip
 * - Search field to filter participants by name
 * - Smooth entrance/exit animations
 * - Clean, readable list format
 */

import { useState, useMemo } from 'react';
import { X, Users, Search } from 'lucide-react';

interface ParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle: string;
  tripDate: string;
  participants: string[];
}

export function ParticipantsModal({
  isOpen,
  onClose,
  tripTitle,
  tripDate,
  participants,
}: ParticipantsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter participants based on search query
  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) {
      return participants;
    }
    
    const query = searchQuery.toLowerCase();
    return participants.filter(participant =>
      participant.toLowerCase().includes(query)
    );
  }, [participants, searchQuery]);

  if (!isOpen) return null;

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
                     max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col
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

          {/* Search field */}
          <div className="px-6 pt-6 pb-4 border-b border-border/30">
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
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredParticipants.length > 0 ? (
              <div>
                <p className="text-sm text-muted-foreground font-inter uppercase tracking-wider mb-4">
                  Найдено участников: <span className="font-poppins font-semibold text-primary">{filteredParticipants.length}</span>
                  {searchQuery && <span className="text-xs ml-2">из {participants.length}</span>}
                </p>
                <ul className="space-y-2">
                  {filteredParticipants.map((participant, index) => {
                    // Find original index for numbering
                    const originalIndex = participants.indexOf(participant);
                    return (
                      <li
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors duration-150"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <span className="text-xs font-poppins font-semibold text-primary">
                            {originalIndex + 1}
                          </span>
                        </div>
                        <span className="font-inter text-foreground">
                          {participant}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Search className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-inter">
                  {searchQuery ? 'Участники не найдены' : 'Нет данных об участниках'}
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
