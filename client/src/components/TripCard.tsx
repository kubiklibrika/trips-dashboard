/**
 * TripCard Component - Infographic Design
 * 
 * Design Philosophy: Data-driven infographic with visual hierarchy
 * - Large central number for participants
 * - Location icon on the left
 * - Dot grid visualization for payment status
 * - Horizontal bar for program distribution
 * - Clean, scannable layout
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

  // Generate dot grid for payment visualization (max 12 dots in 3 rows of 4)
  const totalDots = Math.min(participants, 12);
  const dotsPerRow = 4;
  const dotRows = Math.ceil(totalDots / dotsPerRow);
  const dots = [];
  
  for (let i = 0; i < totalDots; i++) {
    dots.push(i < paidCount ? 'paid' : 'unpaid');
  }

  // Calculate program percentages
  const beginnerPercent = participants > 0 ? Math.round((beginnerCount / participants) * 100) : 0;
  const otherPercent = 100 - beginnerPercent;

  return (
    <div className="group relative h-full">
      {/* Card container */}
      <div
        className={`relative rounded-xl p-4 h-full
                   shadow-sm hover:shadow-md
                   border
                   transition-all duration-200 ease-out
                   cursor-pointer
                   backdrop-blur-sm
                   flex flex-col
                   ${backgroundStyle}`}
        onClick={onOpenModal}
      >
        {/* Header with location icon and title */}
        <div className="flex items-start gap-3 mb-4">
          <div className="text-3xl flex-shrink-0">
            {locationIcon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-poppins font-semibold text-sm text-foreground line-clamp-2 leading-tight">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground font-inter mt-1">
              📅 {date}
            </p>
          </div>
        </div>

        {/* Central participants number */}
        <div className="flex-1 flex items-center justify-center mb-4">
          <div className="text-center">
            <p className="font-poppins font-bold text-5xl text-primary leading-none">
              {participants}
            </p>
            <p className="text-xs text-muted-foreground font-inter mt-2">
              участников
            </p>
          </div>
        </div>

        {/* Payment status dot grid */}
        {participantsList.length > 0 && (
          <>
            <div className="mb-4">
              <p className="text-xs text-muted-foreground font-inter uppercase tracking-wider mb-2">
                Статус оплаты
              </p>
              <div className="flex flex-wrap gap-1.5">
                {dots.map((status, idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-transform hover:scale-125 ${
                      status === 'paid' 
                        ? 'bg-green-500' 
                        : 'bg-red-500'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">Оплачено: {paidCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-muted-foreground">Не оплачено: {unpaidCount}</span>
                </div>
              </div>
            </div>

            {/* Program distribution bar */}
            <div className="mb-2">
              <p className="text-xs text-muted-foreground font-inter uppercase tracking-wider mb-2">
                Программа тура
              </p>
              <div className="flex h-6 rounded-full overflow-hidden shadow-sm border border-border/20">
                {beginnerPercent > 0 && (
                  <div
                    className="bg-blue-500 flex items-center justify-center transition-all duration-300"
                    style={{ width: `${beginnerPercent}%` }}
                  >
                    {beginnerPercent > 20 && (
                      <span className="text-white text-xs font-semibold">
                        {beginnerPercent}%
                      </span>
                    )}
                  </div>
                )}
                {otherPercent > 0 && (
                  <div
                    className="bg-purple-500 flex items-center justify-center transition-all duration-300"
                    style={{ width: `${otherPercent}%` }}
                  >
                    {otherPercent > 20 && (
                      <span className="text-white text-xs font-semibold">
                        {otherPercent}%
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-muted-foreground">С нуля: {beginnerCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-muted-foreground">Другие: {otherProgramCount}</span>
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
