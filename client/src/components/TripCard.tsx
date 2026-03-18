/**
 * TripCard Component
 * 
 * Design Philosophy: Neomorphic style with soft shadows and muted colors
 * - Soft shadow: 0 8px 24px rgba(0,0,0,0.08)
 * - Rounded corners: 16px
 * - Hover effect: Lift-up with increased shadow
 * - Smooth transitions: 0.2s ease-out
 * - Click to open participants modal
 */

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
  return (
    <div className="group relative">
      {/* Card container with neomorphic styling */}
      <div 
        className="bg-card text-card-foreground rounded-[16px] p-6 transition-all duration-200 ease-out cursor-pointer
                      shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                      hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]
                      hover:-translate-y-1
                      border border-border/50"
        onClick={onOpenModal}
      >
        
        {/* Content wrapper */}
        <div className="flex flex-col h-full justify-between">
          
          {/* Trip title */}
          <div className="mb-4">
            <h3 className="font-poppins font-semibold text-lg leading-tight text-foreground">
              {title}
            </h3>
          </div>

          {/* Divider line */}
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full mb-4"></div>

          {/* Date information */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground font-inter">
              {date}
            </p>
          </div>

          {/* Participants count - large prominent display */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-inter uppercase tracking-wider mb-1">
                Участники
              </p>
              <p className="font-poppins font-bold text-4xl text-primary">
                {participants}
              </p>
            </div>
            
            {/* Decorative element with click hint */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <p className="text-xs text-muted-foreground font-inter opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Нажми
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
