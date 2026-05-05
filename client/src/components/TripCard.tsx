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

  // Generate dot grid for payment visualization
  const totalDots = Math.min(participants, 12);
  const dotsPerRow = 6;
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
        {/* Header with location icon and title */}
        <div className="flex items-start gap-3 mb-4">
          <div className="text-4xl flex-shrink-0">
            {locationIcon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-poppins font-bold text-base text-foreground line-clamp-2 leading-tight">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground font-inter mt-1.5 flex items-center gap-1">
              📅 {date}
            </p>
          </div>
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

        {/* Payment status dot grid */}
        {participantsList.length > 0 && (
          <>
            {/* Dot grid section */}
            <div className="mb-4 flex items-center justify-between">
              {/* Left: Paid count label */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground font-inter font-semibold">
                    Оплачено
                  </span>
                </div>
                <p className="font-poppins font-bold text-lg text-green-600">
                  {paidCount}
                </p>
              </div>

              {/* Center: Dot grid */}
              <div className="flex flex-wrap gap-1.5 justify-center max-w-[120px]">
                {dots.map((status, idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-transform hover:scale-125 ${
                      status === 'paid' 
                        ? 'bg-green-500 shadow-sm' 
                        : 'bg-red-500 shadow-sm'
                    }`}
                  />
                ))}
              </div>

              {/* Right: Unpaid count label */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-xs text-muted-foreground font-inter font-semibold">
                    Не оплачено
                  </span>
                </div>
                <p className="font-poppins font-bold text-lg text-red-600">
                  {unpaidCount}
                </p>
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
                    className="bg-blue-500 flex items-center justify-center transition-all duration-300"
                    style={{ width: `${beginnerPercent}%` }}
                  >
                    {beginnerPercent > 15 && (
                      <span className="text-white text-xs font-bold">
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
                    {otherPercent > 15 && (
                      <span className="text-white text-xs font-bold">
                        {otherPercent}%
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Program labels */}
              <div className="flex justify-between text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-muted-foreground">С нуля</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-muted-foreground">Другие</span>
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
