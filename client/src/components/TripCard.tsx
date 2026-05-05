import { MapPin, Waves, Mountain, Trees } from 'lucide-react';

interface Participant {
  name: string;
  paymentStatus: string;
  program?: string;
}

interface TripCardProps {
  title: string;
  date: string;
  participants: number;
  participantsList?: Participant[];
  onOpenModal: () => void;
  isPassed?: boolean;
}

export function TripCard({ title, date, participants, participantsList = [], onOpenModal, isPassed = false }: TripCardProps) {
  // Calculate payment stats
  const paidCount = participantsList.filter(
    p => p.paymentStatus === 'paid'
  ).length;
  const unpaidCount = participantsList.filter(
    p => p.paymentStatus === 'unpaid'
  ).length;

  // Calculate program stats
  const fromZeroCount = participantsList.filter(
    p => p.program?.toLowerCase() === 'с нуля'
  ).length;
  const otherProgramCount = participantsList.filter(
    p => p.program?.toLowerCase() !== 'с нуля'
  ).length;

  // Get location icon based on title
  const getLocationIcon = () => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('турция') || titleLower.includes('олюдениз') || titleLower.includes('анталья')) {
      return <Waves className="w-8 h-8 text-primary" />;
    }
    if (titleLower.includes('чегем')) {
      return <Mountain className="w-8 h-8 text-primary" />;
    }
    if (titleLower.includes('дагестан')) {
      return <Trees className="w-8 h-8 text-primary" />;
    }
    return <MapPin className="w-8 h-8 text-primary" />;
  };

  // Get background color based on passed status
  const getBackgroundClass = () => {
    return isPassed ? 'bg-gray-100' : 'bg-blue-50';
  };

  return (
    <div
      className={`relative rounded-xl p-6 h-full
                 shadow-sm hover:shadow-md
                 border border-border/30
                 transition-all duration-200 ease-out
                 cursor-pointer
                 flex flex-col
                 ${getBackgroundClass()}`}
      onClick={onOpenModal}
    >
      {/* Header with location icon and title */}
      <div className="flex items-start gap-3 mb-6">
        <div className="flex-shrink-0 pt-1">
          {getLocationIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-poppins font-bold text-base text-foreground line-clamp-2 leading-tight">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground font-inter mt-1.5">
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

      {/* Payment status dots grid */}
      {participantsList.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="text-xs text-muted-foreground font-inter uppercase tracking-wider text-center">
            Статус оплаты
          </p>
          
          {/* Dots grid for payment status */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {/* Paid dots (green) */}
            {Array.from({ length: paidCount }).map((_, i) => (
              <div
                key={`paid-${i}`}
                className="w-2.5 h-2.5 rounded-full bg-green-500"
                title={`Оплачено (${i + 1})`}
              />
            ))}
            {/* Unpaid dots (red) */}
            {Array.from({ length: unpaidCount }).map((_, i) => (
              <div
                key={`unpaid-${i}`}
                className="w-2.5 h-2.5 rounded-full bg-red-500"
                title={`Не оплачено (${i + 1})`}
              />
            ))}
          </div>

          {/* Payment legend */}
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Оплачено ({paidCount})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Не оплачено ({unpaidCount})
            </span>
          </div>
        </div>
      )}

      {/* Program distribution bar */}
      {participantsList.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-inter uppercase tracking-wider text-center">
            Программа тура
          </p>
          
          {/* Program bar */}
          <div className="flex h-8 rounded-lg overflow-hidden border border-border/30 shadow-sm">
            {/* From zero (green) */}
            {fromZeroCount > 0 && (
              <div
                className="bg-green-500 flex items-center justify-center text-white text-xs font-bold transition-all duration-200"
                style={{ width: `${(fromZeroCount / participants) * 100}%` }}
              >
                {fromZeroCount > 0 && fromZeroCount}
              </div>
            )}
            {/* Other programs (purple) */}
            {otherProgramCount > 0 && (
              <div
                className="bg-purple-500 flex items-center justify-center text-white text-xs font-bold transition-all duration-200"
                style={{ width: `${(otherProgramCount / participants) * 100}%` }}
              >
                {otherProgramCount > 0 && otherProgramCount}
              </div>
            )}
          </div>

          {/* Program legend */}
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-green-500" />
              С нуля ({fromZeroCount})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-purple-500" />
              Другие ({otherProgramCount})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
