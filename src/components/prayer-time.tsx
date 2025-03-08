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
    "bg-[#124015]", // En koyu ton
    "bg-[#1a5921]",
    "bg-[#236b2d]",
    "bg-[#2d7f3a]",
    "bg-[#389447]",
    "bg-[#43a954]"  // En açık ton
  ];
  
  // İndex'e göre renk seçimi
  const bgColor = backgroundColors[index % backgroundColors.length];
    
  return (
    <div className={`flex-1 min-h-0 flex font-bold text-center items-center justify-center ${bgColor}`}>
      {/* Dış çerçeve: Tüm içeriği kaplayacak şekilde */}
      <div className={`flex justify-between items-center w-xs max-w-2xl mx-10 sm:mx-4 md:mx-8 lg:mx-16 ${status === 'next' ? 'ring-1 ring-white rounded-xl shadow-lg py-2 md:py-2' : ''}`}>
        <div className="w-5/12 flex justify-end p-4">
          <h2 className={`text-base sm:text-lg md:text-xl ${status === 'past' ? 'opacity-40' : ''}`}>{name}</h2>
        </div>
        
        {/* Ortada boşluk bırakmak için */}
        <div className="w-2/12 flex justify-center">
          <div className="border-b border-white/20 w-4 sm:w-8 md:w-16"></div>
        </div>
        
        <div className="w-5/12 flex justify-start p-4">
          <h2 className={`text-base sm:text-lg md:text-xl ${status === 'past' ? 'opacity-40' : ''}`}>{time}</h2>
        </div>
      </div>
    </div>
  );
}