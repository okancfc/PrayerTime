export default function PrayerTime({
  time,
  name,
  index = 0,
  status = 'future'
}: {
  time: string;
  name: string;
  index?: number;
  status?: 'past' | 'next' | 'future';
}) {
  // Koyu yeşilden açık yeşile doğru renk dizisi
  const backgroundColors = [
    "bg-lime-950",
    "bg-lime-900",
    "bg-lime-800",
    "bg-lime-700",
    "bg-lime-600",
    "bg-lime-500",
  ];

  // İndex'e göre renk seçimi
  const bgColor = backgroundColors[index % backgroundColors.length];
  
  // Arka plan tam ekran olan dış div için class
  let containerClasses = `flex-1 flex font-bold text-center py-2 ${bgColor}`;

  return (
    <div className={containerClasses}>
      {/* İç kısım: Sadece sıradaki namazın çerçevesi küçültüldü, boşluklar korunuyor */}
      <div className={`flex justify-between items-center w-full px-6 ${status === 'next' ? 'ring-1 ring-white rounded-xl shadow-lg max-w-md mx-auto p-2' : ''}`}>
        <div className="w-1/2 flex justify-end">
          <h2 className={`text-3xl md:text-2xl px-32 ${status === 'past' ? 'opacity-40' : ''}`}>{time}</h2>
        </div>
        <div className="w-1/2 flex justify-start">
          <h2 className={`text-3xl md:text-2xl px-32 ${status === 'past' ? 'opacity-40' : ''}`}>{name}</h2>
        </div>
      </div>
    </div>
  );
}
