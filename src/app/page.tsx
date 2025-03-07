"use client";

import { useState, useEffect } from "react";
import PrayerTime from "../components/prayer-time";
import CountdownTimer from "../components/countdown-timer";

interface PrayerTiming {
  name: string;
  time: string;
}

export default function Home() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTiming[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{name: string, time: string} | null>(null);

  // Namaz vakitlerini çekme
  useEffect(() => {
    async function fetchPrayerTimes() {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://api.aladhan.com/v1/timingsByCity?city=Istanbul&country=Turkey&method=13"
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
    
    // Her dakika güncelleme
    const intervalId = setInterval(() => {
      if (prayerTimes.length > 0) {
        const nextPrayer = findNextPrayer(prayerTimes);
        if (nextPrayer) {
          setNextPrayer(nextPrayer);
        }
      }
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

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
    <div className="flex flex-col text-white bg-lime-950 h-screen">
      {/* Geri sayım ve başlık için üst bölüm (esnek, içeriğe göre) */}
      <div className="flex justify-center items-center p-4">
        {nextPrayer && (
          <div className="text-center p-4 border rounded-2xl border-white/20 mb-2">
            <h1 className="text-2xl font-bold mb-2">Sıradaki Namaz</h1>
            <h2 className="text-xl">{nextPrayer.name} - {nextPrayer.time}</h2>
            <CountdownTimer targetTime={nextPrayer.time} prayerName={nextPrayer.name} />
          </div>
        )}
      </div>
      
      {/* Namaz vakitleri için alt bölüm (kalan tüm alanı kaplar) */}
      <div className="flex-1 flex flex-col">
        {prayerTimes.map((data, index) => (
          <PrayerTime 
            key={index} 
            time={data.time} 
            name={data.name} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
}