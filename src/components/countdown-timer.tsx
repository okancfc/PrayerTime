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
        
        // Eğer hedef zaman bugün geçmişse ve "Yarın" ifadesi yoksa, yarına ayarla
        if (targetDate < now && !prayerName.includes("Yarın")) {
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

  // Debug için
  console.log("Target time:", targetTime);
  console.log("Current time left:", timeLeft);

  // Zamanı formatlama
  const formatTimeUnit = (unit: number) => String(unit).padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <div className="text-5xl font-bold">
        {formatTimeUnit(timeLeft.hours)}:{formatTimeUnit(timeLeft.minutes)}:{formatTimeUnit(timeLeft.seconds)}
      </div>
      <div className="mt-2 text-xl">
        {prayerName} Vaktine Kalan Süre
      </div>
    </div>
  );
};

export default CountdownTimer;