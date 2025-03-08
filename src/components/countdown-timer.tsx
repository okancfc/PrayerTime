"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetTime: string;
  prayerName: string;
}

const CountdownTimer = ({ targetTime, prayerName }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      try {
        const now = new Date();
        const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Hedef zamanı parçalama
        const [hoursStr, minutesStr] = targetTime.split(':');
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        
        if (isNaN(hours) || isNaN(minutes)) {
          console.error("Geçersiz zaman formatı:", targetTime);
          return;
        }
        
        // Hedef tarih oluşturma
        const targetDate = new Date(today);
        targetDate.setHours(hours, minutes, 0, 0);
        
        // Eğer hedef zaman geçmişse ve sonraki namaz yarınki ise, bir gün ekle
        if (prayerName.includes("Yarın")) {
          targetDate.setDate(targetDate.getDate() + 1);
        } else if (targetDate < now) {
          // Eğer hedef zaman bugün geçmişse, yarına ayarla
          targetDate.setDate(targetDate.getDate() + 1);
        }
        
        // Millsaniye cinsinden fark
        const difference = targetDate.getTime() - now.getTime();
        
        if (difference > 0) {
          // Saat, dakika, saniye hesaplama
          const hoursLeft = Math.floor(difference / (1000 * 60 * 60));
          const minutesLeft = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const secondsLeft = Math.floor((difference % (1000 * 60)) / 1000);
          
          setTimeLeft({ 
            hours: hoursLeft, 
            minutes: minutesLeft, 
            seconds: secondsLeft 
          });
        } else {
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        }
      } catch (error) {
        console.error("Geri sayım hesaplamasında hata:", error);
      }
    };

    // İlk hesaplama
    calculateTimeLeft();
    
    // Her saniye güncelle
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Temizleme
    return () => clearInterval(timer);
  }, [targetTime, prayerName]);

  // Zamanı formatlama
  const formatTimeUnit = (unit: number) => String(unit).padStart(2, "0");

  return (
      <div className="flex flex-col items-center justify-center mt-2 md:mt-4">
        <div className="text-3xl md:text-5xl font-bold">
          {formatTimeUnit(timeLeft.hours)}:{formatTimeUnit(timeLeft.minutes)}:{formatTimeUnit(timeLeft.seconds)}
        </div>
        <div className="mt-1 md:mt-2 text-md md:text-xl">
          {prayerName} Vaktine Kalan Süre
        </div>
      </div>
    );
};

export default CountdownTimer;