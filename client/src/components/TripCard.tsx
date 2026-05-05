/**
 * TripCard Component - Variant 3 Infographic Design
 * 
 * Design Philosophy: Clean infographic with visual hierarchy
 * - Large central number for participants
 * - Location icon on the left
 * - Dot grid visualization for payment status
 * - Horizontal percentage bar for program distribution
 */

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
      return 'bg-gradient-to-br from-gray-200 to-gray-100 border-gray-300';
    }
    return 'bg-gradient-to-br from-blue-100 to-cyan-50 border-blue-300';
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

  // Get location icon emoji based on title
  const getLocationIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('турция') || lowerTitle.includes('анталья') || lowerTitle.includes('олюдениз')) {
      return '🏖️';
    } else if (lowerTitle.includes('дагестан')) {
      return '⛰️';
    } else if (lowerTitle.includes('чегем')) {
      return '🏔️';
    }
    return '🗺️';
  };

  const locationIcon = getLocationIcon(title);



  // Calculate program percentages
  const beginnerPercent = participants > 0 ? Math.round((beginnerCount / participants) * 100) : 0;
  const otherPercent = 100 - beginnerPercent;

  return (
    <div className="group relative h-full">
      {/* Card container */}
      <div
        className={`relative rounded-xl p-5 h-full
                   shadow-sm hover:shadow-md
                   border
                   transition-all duration-200 ease-out
                   cursor-pointer
                   backdrop-blur-sm
                   flex flex-col
                   ${backgroundStyle}`}
        onClick={onOpenModal}
      >
        {/* Header with title and date */}
        <div className="flex-1 min-w-0 mb-4">
          <h3 className="font-poppins font-bold text-base text-foreground line-clamp-2 leading-tight">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground font-inter mt-1.5 flex items-center gap-1">
            📅 {date}
          </p>
        </div>

        {/* Central participants number - Large and prominent */}
        <div className="flex-1 flex flex-col items-center justify-center my-4">
          <p className="font-poppins font-black text-6xl text-primary leading-none">
            {participants}
          </p>
          <p className="text-sm text-muted-foreground font-inter mt-2 uppercase tracking-wider">
            участников
          </p>
        </div>

        {/* Payment status bar */}
        {participantsList.length > 0 && (
          <>
            {/* Payment bar section */}
            <div className="mb-4 space-y-2">
              <p className="text-xs text-muted-foreground font-inter uppercase tracking-wider text-center">
                Статус оплаты
              </p>
              
              {/* Horizontal payment bar */}
              <div className="flex h-8 rounded-lg overflow-hidden shadow-sm border border-border/20">
                {paidCount > 0 && (
                  <div
                    className="bg-green-500 flex items-center justify-center transition-all duration-300"
                    style={{ width: `${(paidCount / participants) * 100}%` }}
                  >
                    {(paidCount / participants) * 100 > 15 && (
                      <span className="text-white text-xs font-bold">
                        {paidCount}
                      </span>
                    )}
                  </div>
                )}
                {unpaidCount > 0 && (
                  <div
                    className="bg-red-500 flex items-center justify-center transition-all duration-300"
                    style={{ width: `${(unpaidCount / participants) * 100}%` }}
                  >
                    {(unpaidCount / participants) * 100 > 15 && (
                      <span className="text-white text-xs font-bold">
                        {unpaidCount}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Payment labels */}
              <div className="flex justify-between text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">Оплачено ({paidCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-muted-foreground">Не оплачено ({unpaidCount})</span>
                </div>
              </div>
            </div>

            {/* Program distribution bar section */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-inter uppercase tracking-wider text-center">
                Программа тура
              </p>
              
              {/* Horizontal percentage bar */}
              <div className="flex h-8 rounded-lg overflow-hidden shadow-sm border border-border/20">
                {beginnerPercent > 0 && (
                  <div
                    className="bg-green-500 flex items-center justify-center transition-all duration-300"
                    style={{ width: `${beginnerPercent}%` }}
                  >
                    {beginnerPercent > 15 && (
                      <span className="text-white text-xs font-bold">
                        {beginnerCount}
                      </span>
                    )}
                  </div>
                )}
                {otherPercent > 0 && (
                  <div
                    className="bg-purple-500 flex items-center justify-center transition-all duration-300"
                    style={{ width: `${otherPercent}%` }}
                  >
                    {otherPercent > 15 && (
                      <span className="text-white text-xs font-bold">
                        {otherProgramCount}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Program labels */}
              <div className="flex justify-between text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">С нуля ({beginnerCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-muted-foreground">Другие ({otherProgramCount})</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Hover overlay hint */}
        <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/3 transition-colors duration-200 opacity-0 group-hover:opacity-100 pointer-events-none" />
      </div>
    </div>
  );
}
