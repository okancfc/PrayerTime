import { useState, useRef, useEffect } from 'react';

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

export default function CitySelector({ selectedCity, onCityChange }: CitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Türkiye illeri listesi - alfabetik sıralı
  const turkishCities = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya",
    "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik",
    "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum",
    "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir",
    "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "Istanbul",
    "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kırıkkale",
    "Kırklareli", "Kırşehir", "Kilis", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa",
    "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye",
    "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak",
    "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"
  ];

  // Dışarı tıklandığında dropdown'ı kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Şehir seçme butonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-40 sm:w-48 md:w-56 px-4 py-2 text-white bg-[#1a5921] rounded-lg border border-white/20 hover:bg-[#236b2d] transition-colors"
      >
        <span className="font-medium truncate">{selectedCity}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {/* Dropdown menü */}
      {isOpen && (
        <div className="absolute z-10 w-56 mt-2 origin-top-right bg-[#1a5921] rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="py-1">
            {turkishCities.map((city) => (
              <button
                key={city}
                className={`${
                  city === selectedCity ? 'bg-lime-700' : 'hover:bg-[#236b2d]'
                } text-white block w-full text-left px-4 py-2 text-sm`}
                onClick={() => {
                  onCityChange(city);
                  setIsOpen(false);
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}