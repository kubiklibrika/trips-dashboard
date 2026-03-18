/**
 * Home Page - Trips Dashboard
 * 
 * Design Philosophy: Neomorphic Dashboard
 * - Light background with subtle gradient
 * - Grid layout with 3-4 columns
 * - Soft shadows and smooth interactions
 * - Professional, calm atmosphere
 */

import { useEffect, useState } from 'react';
import { TripCard } from '@/components/TripCard';

interface Trip {
  id: number;
  title: string;
  date: string;
  participants: number;
}

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load trips data from JSON file
    const loadTrips = async () => {
      try {
        const response = await fetch('/trips-data.json');
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error('Error loading trips data:', error);
        // Fallback data if file doesn't load
        setTrips([
          { id: 1, title: "Турция - Анталья+Олю", date: "20-29 марта", participants: 22 },
          { id: 2, title: "Турция - Анталья+Олю", date: "3-12 апреля", participants: 17 },
          { id: 3, title: "Россия - Дагестан", date: "17-26 апреля", participants: 20 },
          { id: 4, title: "Россия - Чегем", date: "25-29 мая", participants: 23 },
          { id: 5, title: "Россия - Чегем", date: "15-19 июня", participants: 22 },
          { id: 6, title: "Россия - Чегем", date: "22-26 июня", participants: 18 },
          { id: 7, title: "Россия - Чегем", date: "13-17 июля", participants: 23 },
          { id: 8, title: "Россия - Чегем", date: "20-24 июля", participants: 19 },
          { id: 9, title: "Россия - Чегем", date: "17-21 августа", participants: 15 },
          { id: 10, title: "Россия - Чегем", date: "24-28 августа", participants: 11 },
          { id: 11, title: "Россия - Чегем", date: "7-11 сентября", participants: 23 },
          { id: 12, title: "Турция - Олюдениз", date: "2-11 октября", participants: 13 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  return (
    <div className="min-h-screen bg-background">
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
          
          {/* Header section */}
          <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
            <h1 className="font-poppins font-bold text-4xl md:text-5xl text-foreground mb-3">
              Дашборд выездов
            </h1>
            <p className="text-muted-foreground text-lg font-inter">
              Информация о всех запланированных выездах и количестве участников
            </p>
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
          {!loading && trips.length > 0 ? (
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
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-inter text-lg">
                {loading ? 'Загрузка данных...' : 'Нет данных о выездах'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
