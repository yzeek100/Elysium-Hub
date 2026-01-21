
import React from 'react';

interface SearchBarProps {
  detectedCity?: string | null;
  selectedCity?: string | null;
  isLocating?: boolean;
  onLocate?: () => void;
  onCityChange: (city: string | null) => void;
  onRegisterClick: () => void;
}

const POPULAR_CITIES = [
  'São Paulo',
  'Rio de Janeiro',
  'Belo Horizonte',
  'Curitiba',
  'Brasília',
  'Porto Alegre',
  'Salvador'
];

const SearchBar: React.FC<SearchBarProps> = ({ 
  detectedCity, 
  selectedCity, 
  isLocating, 
  onLocate, 
  onCityChange,
  onRegisterClick
}) => {
  const currentCity = selectedCity || detectedCity;

  return (
    <div className="w-full bg-white p-6 md:p-10 rounded-3xl md:rounded-[3rem] border border-slate-200 space-y-6 md:space-y-8 shadow-premium relative overflow-hidden">
      {/* Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-6 relative">
        <div className="flex-[1.5] flex border-2 border-slate-100 bg-slate-50 rounded-2xl focus-within:border-[#F13E5A] focus-within:bg-white transition-all group">
          <div className="pl-5 flex items-center text-[#F13E5A]">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
          </div>
          <input 
            type="text" 
            value={currentCity || ""}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="Sua localização..." 
            className="flex-1 px-4 py-5 bg-transparent text-slate-900 placeholder-slate-400 text-sm focus:outline-none font-bold" 
          />
        </div>
        
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 font-black text-[12px] uppercase tracking-[0.3em] transition-all rounded-2xl shrink-0">
          Pesquisar
        </button>

        <div className="hidden md:block w-[2px] bg-slate-100 mx-2"></div>

        <button 
          onClick={onRegisterClick}
          className="bg-[#F13E5A] hover:bg-[#D63049] text-white px-10 py-5 font-black text-[12px] uppercase tracking-[0.3em] transition-all rounded-2xl shadow-2xl shadow-rose-200 shrink-0 border-b-4 border-black/10 active:border-b-0 active:translate-y-1"
        >
          Anuncie Grátis
        </button>
      </div>

      {/* City Filter Row */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
           <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Cidades em Destaque</span>
           <button onClick={onLocate} className="text-[10px] font-black text-[#F13E5A] uppercase tracking-wider flex items-center gap-1 hover:underline">
             <svg className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
             {isLocating ? 'Detectando...' : 'Auto-Localizar'}
           </button>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2">
           <button 
             onClick={() => onCityChange(null)}
             className={`shrink-0 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${!selectedCity ? 'bg-[#F13E5A] border-[#F13E5A] text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}
           >
             Brasil
           </button>
           {POPULAR_CITIES.map(city => (
             <button 
               key={city}
               onClick={() => onCityChange(city)}
               className={`shrink-0 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedCity === city ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}
             >
               {city}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
