/**
 * ParticipantsModal Component
 * 
 * Design Philosophy: Neomorphic modal with smooth animations
 * - Displays list of participants for a trip
 * - Smooth entrance/exit animations
 * - Clean, readable list format
 */

import { useState } from 'react';
import { X, Users } from 'lucide-react';

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

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {participants.length > 0 ? (
              <div>
                <p className="text-sm text-muted-foreground font-inter uppercase tracking-wider mb-4">
                  Всего участников: <span className="font-poppins font-semibold text-primary">{participants.length}</span>
                </p>
                <ul className="space-y-2">
                  {participants.map((participant, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors duration-150"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <span className="text-xs font-poppins font-semibold text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <span className="font-inter text-foreground">
                        {participant}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Users className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-inter">
                  Нет данных об участниках
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
