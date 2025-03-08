"use client";

import { useState, useEffect } from "react";
import PrayerTime from "../components/prayer-time";
import CountdownTimer from "../components/countdown-timer";
import CitySelector from "../components/city-selector";

interface PrayerTiming {
  name: string;
  time: string;
}

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string>("Istanbul");
  const [prayerTimes, setPrayerTimes] = useState<PrayerTiming[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{name: string, time: string} | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Şehir değiştikçe namaz vakitlerini yeniden çek
  useEffect(() => {
    async function fetchPrayerTimes() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${selectedCity}&country=Turkey&method=13`
        );
        
        if (!response.ok) {
          throw new Error("Namaz vakitleri alınamadı");
        }
        
        const data = await response.json();
        
        // API'den gelen verileri dönüştürme
        const timings = data.data.timings;
        const formattedTimes: PrayerTiming[] = [
          { name: "İmsak", time: timings.Fajr },
          { name: "Güneş", time: timings.Sunrise },
          { name: "Öğle", time: timings.Dhuhr },
          { name: "İkindi", time: timings.Asr },
          { name: "Akşam", time: timings.Maghrib },
          { name: "Yatsı", time: timings.Isha },
        ];
        
        setPrayerTimes(formattedTimes);
        
        // Bir sonraki namaz vaktini hesaplama
        const nextPrayer = findNextPrayer(formattedTimes);
        if (nextPrayer) {
          setNextPrayer(nextPrayer);
        }
      } catch (err) {
        setError("Namaz vakitleri yüklenirken bir hata oluştu.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPrayerTimes();
    
  }, [selectedCity]); // selectedCity değiştikçe çalış

  // Şu anki zamanı ve namaz vakitlerini güncelleyen zamanlayıcılar
  useEffect(() => {
    // Şu anki zamanı her saniye güncelle
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Her dakika namaz vaktini güncelleme
    const prayerInterval = setInterval(() => {
      if (prayerTimes.length > 0) {
        const nextPrayer = findNextPrayer(prayerTimes);
        if (nextPrayer) {
          setNextPrayer(nextPrayer);
        }
      }
    }, 60000);
    
    return () => {
      clearInterval(timeInterval);
      clearInterval(prayerInterval);
    };
  }, [prayerTimes]);

  // Bir sonraki namaz vaktini bulma
  const findNextPrayer = (times: PrayerTiming[]): {name: string, time: string} | null => {
    if (!times || times.length === 0) return null;
    
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;
    
    // Namaz vakitlerini dakika cinsinden dönüştürme
    const prayerTimesInMinutes = times.map(prayer => {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      return {
        name: prayer.name,
        time: prayer.time,
        timeInMinutes: hours * 60 + minutes
      };
    });
    
    // Şu anki zamandan sonraki ilk namaz vaktini bulma
    const upcomingPrayers = prayerTimesInMinutes.filter(
      prayer => prayer.timeInMinutes > currentTimeInMinutes
    );
    
    if (upcomingPrayers.length > 0) {
      // Bugün içinde sıradaki namaz
      const nextPrayer = upcomingPrayers.reduce((earliest, current) => 
        current.timeInMinutes < earliest.timeInMinutes ? current : earliest
      );
      
      return {
        name: nextPrayer.name,
        time: nextPrayer.time
      };
    } else {
      // Eğer bugün kalan namaz yoksa, yarının ilk namazı
      return {
        name: times[0].name + " (Yarın)",
        time: times[0].time
      };
    }
  };

// Namaz vaktinin durumunu hesaplama (geçmiş, sıradaki, gelecek)
const getPrayerStatus = (prayerName: string, prayerTime: string): 'past' | 'next' | 'future' => {
  if (!nextPrayer) return 'future';
  
  // Doğrudan nextPrayer ile karşılaştır (sıradaki namazı belirle)
  if (nextPrayer.name === prayerName || 
      (nextPrayer.name.includes("Yarın") && nextPrayer.name.includes(prayerName))) {
    return 'next';
  }
  
  // Şu anki zamanı dakika cinsinden hesapla
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;
  
  // Namaz vaktini dakika cinsinden hesapla
  const [hours, minutes] = prayerTime.split(':').map(Number);
  const prayerTimeInMinutes = hours * 60 + minutes;
  
  // Geçmiş namaz kontrolü (şimdiki zamandan önce mi?)
  if (prayerTimeInMinutes < currentTimeInMinutes) {
    return 'past';
  }
  
  return 'future';
};

  // Şehir değişimi işleyicisi
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setIsLoading(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-lime-950">
        <p>Namaz vakitleri yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-lime-950">
        <p>{error}</p>
        <p>Lütfen internet bağlantınızı kontrol edin ve sayfayı yenileyin.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-white bg-[#0C300F] min-h-screen overflow-hidden">
      {/* Şehir seçici ve geri sayım için üst bölüm */}
      <div className="flex flex-col justify-center items-center pt-2 pb-1 lg:h-[30vh]">
        {/* Şehir seçici */}
        <div className="mb-4">
          <CitySelector 
            selectedCity={selectedCity} 
            onCityChange={handleCityChange}
          />
        </div>
        
        {/* Geri sayım */}
        {nextPrayer && (
          <div className="text-center p-2 border rounded-2xl border-white/20 w-full max-w-xs md:max-w-md">
            <h1 className="text-lg md:text-xl font-bold mb-1">Sıradaki Namaz</h1>
            <h2 className="text-base md:text-lg">{nextPrayer.name} - {nextPrayer.time}</h2>
            <CountdownTimer targetTime={nextPrayer.time} prayerName={nextPrayer.name} />
          </div>
        )}
      </div>
      
      {/* Debug bilgisi */}
      <div className="text-center text-xs h-auto py-1">
        Şu anki zaman: {currentTime.toLocaleTimeString()} | {selectedCity}
      </div>
      
      {/* Namaz vakitleri için alt bölüm - flexbox ile dinamik yükseklik */}
      <div className="flex flex-col flex-grow border-t border-white/20">
        {prayerTimes.map((data, index) => {
          const status = getPrayerStatus(data.name, data.time);
          return (
            <PrayerTime 
              key={index} 
              time={data.time} 
              name={data.name} 
              index={index}
              status={status}
            />
          );
        })}
      </div>
    </div>
  );
}