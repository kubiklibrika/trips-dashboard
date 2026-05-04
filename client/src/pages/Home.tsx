/**
 * Home Page - Trips Dashboard
 * 
 * Design Philosophy: Neomorphic Dashboard
 * - Light background with subtle gradient
 * - Grid layout with 3-4 columns
 * - Soft shadows and smooth interactions
 * - Professional, calm atmosphere
 * - Click on trip card to view participants list
 * - Color-coded cards by participant count
 * - Data loaded from Google Drive API
 * - Trips sorted by date in ascending order
 * - Manual refresh button for updating data
 */

import { useEffect, useState } from 'react';
import { TripCard } from '@/components/TripCard';
import { ParticipantsModal } from '@/components/ParticipantsModal';
import { TripCalendar } from '@/components/TripCalendar';
import { SheepLoader } from '@/components/SheepLoader';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { RotateCw } from 'lucide-react';
import { toast } from 'sonner';

interface Participant {
  name: string;
  paymentStatus: string;
}

interface Trip {
  id: number;
  title: string;
  date: string;
  participants: number;
  participantsList: Participant[];
}

// Month mapping for date parsing
const monthMap: { [key: string]: number } = {
  'января': 1, 'февраля': 2, 'марта': 3, 'апреля': 4, 'мая': 5, 'июня': 6,
  'июля': 7, 'августа': 8, 'сентября': 9, 'октября': 10, 'ноября': 11, 'декабря': 12
};

// Parse date string and return comparable number for sorting
function parseDateForSort(dateStr: string): number {
  if (!dateStr) return 0;
  
  // Try to parse dates like "20-29 марта" or "7/11 сентября"
  const parts = dateStr.toLowerCase().split(' ');
  if (parts.length < 2) return 0;
  
  const monthName = parts[parts.length - 1];
  const month = monthMap[monthName] || 0;
  
  // Extract first day number from date range
  const dayPart = parts[0];
  const dayMatch = dayPart.match(/\d+/);
  const day = dayMatch ? parseInt(dayMatch[0]) : 0;
  
  // Return comparable number: month * 100 + day
  return month * 100 + day;
}

export default function Home() {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load trips from API (now loads from database on server)
  const { data: tripsData = [], isLoading, refetch } = trpc.trips.list.useQuery();
  const refreshMutation = trpc.trips.refresh.useMutation();
  const [isParsingGoogleDrive, setIsParsingGoogleDrive] = useState(true);

  // Check if we're still loading data from Google Drive on initial mount
  useEffect(() => {
    if (!isLoading) {
      setIsParsingGoogleDrive(false);
    }
  }, [isLoading]);
  
  // Sort trips by date in ascending order
  const trips = [...tripsData].sort((a, b) => {
    return parseDateForSort(a.date) - parseDateForSort(b.date);
  });

  const handleOpenModal = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrip(null);
  };

  const utils = trpc.useUtils();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setIsParsingGoogleDrive(true);
    try {
      // Call refresh mutation to force update cache from Google Drive
      await refreshMutation.mutateAsync();
      
      // Invalidate and refetch the trips list
      await utils.trips.list.invalidate();
      await refetch();
      
      toast.success('Данные обновлены', {
        description: 'Информация о выездах успешно загружена из Google Drive',
        duration: 3000,
      });
    } catch (error) {
      toast.error('Ошибка обновления', {
        description: 'Не удалось загрузить данные. Попробуйте позже.',
        duration: 3000,
      });
    } finally {
      setIsRefreshing(false);
      setIsParsingGoogleDrive(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Loading state - show sheep loader while parsing Google Drive */}
      {(isLoading || isParsingGoogleDrive) && <SheepLoader />}

      {/* Background image with overlay */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663200453583/Y478AcgKFLZ2Ut57UzHwjN/dashboard-bg-Yt2Kho2FEBWbCuXacJKGAz.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      
      {/* Overlay for better readability */}
      <div className="fixed inset-0 -z-10 bg-background/80 backdrop-blur-sm" />

      {/* Main content */}
      <main className="relative z-10 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header section with refresh button */}
          <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="font-poppins font-bold text-4xl md:text-5xl text-foreground mb-3">
                  Дашборд выездов 2026
                </h1>
                <p className="text-muted-foreground text-lg font-inter">
                  Информация о всех запланированных выездах и количестве участников. Нажмите на карточку для просмотра списка участников.
                </p>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing || isLoading}
                variant="outline"
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <RotateCw 
                  size={18} 
                  className={isRefreshing ? 'animate-spin' : ''}
                />
                {isRefreshing ? 'Обновление...' : 'Обновить'}
              </Button>
            </div>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Total trips card */}
            <div className="bg-card rounded-[16px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-border/50

                            animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <p className="text-sm text-muted-foreground font-inter uppercase tracking-wider mb-2">
                Всего выездов
              </p>
              <p className="font-poppins font-bold text-3xl text-primary">
                {trips.length}
              </p>
            </div>

            {/* Total participants card */}
            <div className="bg-card rounded-[16px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-border/50

                            animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              <p className="text-sm text-muted-foreground font-inter uppercase tracking-wider mb-2">
                Всего участников
              </p>
              <p className="font-poppins font-bold text-3xl text-primary">
                {trips.reduce((sum, trip) => sum + trip.participants, 0)}
              </p>
            </div>

            {/* Average participants card */}
            <div className="bg-card rounded-[16px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-border/50

                            animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <p className="text-sm text-muted-foreground font-inter uppercase tracking-wider mb-2">
                Среднее на выезд
              </p>
              <p className="font-poppins font-bold text-3xl text-primary">
                {trips.length > 0 ? Math.round(trips.reduce((sum, trip) => sum + trip.participants, 0) / trips.length) : 0}
              </p>
            </div>
          </div>

          {/* Trips grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-inter text-lg">
                Загрузка данных из базы данных...
              </p>
            </div>
          ) : trips.length > 0 ? (
            <div>
              <h2 className="font-poppins font-semibold text-2xl text-foreground mb-6">
                Выезды
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {trips.map((trip, index) => (
                  <div
                    key={trip.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{
                      animationDelay: `${100 + index * 50}ms`,
                    }}
                  >
                    <TripCard
                      title={trip.title}
                      date={trip.date}
                      participants={trip.participants}
                      participantsList={trip.participantsList}
                      onOpenModal={() => handleOpenModal(trip)}
                    />
                  </div>
                ))}
              </div>

              {/* Trip Calendar */}
              <TripCalendar trips={trips} />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-inter text-lg">
                {isLoading ? 'Загружка данных из Google Drive...' : 'Нет данных о выездах'}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Participants Modal */}
      {selectedTrip && (
        <ParticipantsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          tripTitle={selectedTrip.title}
          tripDate={selectedTrip.date}
          participants={selectedTrip.participantsList}
        />
      )}
    </div>
  );
}
