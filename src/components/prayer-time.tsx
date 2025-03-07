export default function PrayerTime({
  time,
  name,
  index = 0,
}: {
  time: string;
  name: string;
  index?: number;
}) {
  // Koyu yeşilden açık yeşile doğru renk dizisi
  const backgroundColors = [
    "bg-lime-950", // En koyu yeşil
    "bg-lime-900",
    "bg-lime-800",
    "bg-lime-700",
    "bg-lime-600",
    "bg-lime-500", // En açık yeşil
  ];

  // İndex'e göre renk seçimi
  const bgColor = backgroundColors[index % backgroundColors.length];

  return (
    <div className={`flex-1 flex font-bold text-center border-t border-b border-white/10 ${bgColor}`}>
      <div className="w-1/2 flex justify-end items-center">
        <h2 className="text-3xl md:text-2xl px-6">{time}</h2>
      </div>
      <div className="w-1/2 flex justify-start items-center">
        <h2 className="text-3xl md:text-2xl px-6">{name}</h2>
      </div>
    </div>
  );
}