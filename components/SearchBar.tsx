import React from 'react';
import { GenderCategory } from '../types';

interface SearchBarProps {
  detectedCity?: string | null;
  selectedCity?: string | null;
  selectedGender: GenderCategory | 'Todos';
  minPrice: string;
  maxPrice: string;
  radius: number | 'Ilimitado';
  isLocating?: boolean;
  onLocate?: () => void;
  onCityChange: (city: string | null) => void;
  onGenderChange: (gender: GenderCategory | 'Todos') => void;
  onPriceChange: (min: string, max: string) => void;
  onRadiusChange: (radius: number | 'Ilimitado') => void;
  onRegisterClick: () => void;
  onAdminClick: () => void;
}

const POPULAR_CITIES = ['São Paulo', 'Rio de Janeiro', 'Curitiba', 'Belo Horizonte'];
const GENDERS: (GenderCategory | 'Todos')[] = ['Todos', 'Mulher', 'Homem', 'Homossexual'];
const RADIUS_OPTIONS: (number | 'Ilimitado')[] = ['Ilimitado', 10, 25, 50, 100];

const SearchBar: React.FC<SearchBarProps> = ({ 
  detectedCity, selectedCity, selectedGender, minPrice, maxPrice, radius, isLocating, onLocate, onCityChange, onGenderChange, onPriceChange, onRadiusChange, onRegisterClick, onAdminClick
}) => {
  const currentCity = selectedCity || detectedCity;

  return (
    <div className="w-full space-y-2 animate-fade-in px-2 md:px-0">
      <div className="bg-white p-2.5 rounded-[1.8rem] shadow-premium flex flex-col md:flex-row items-center gap-2">
        <div className="flex-[2] w-full relative">
          <input 
            type="text" 
            value={currentCity || ""}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="Onde você está?" 
            className="w-full bg-[#F5F5F7] rounded-[1.4rem] px-5 py-3 text-[13px] font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all placeholder:text-slate-400"
          />
          <button 
            onClick={onLocate}
            className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors ${isLocating ? 'animate-spin' : ''}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
          </button>
        </div>

        <div className="flex-1 w-full flex items-center gap-2 bg-[#F5F5F7] rounded-[1.4rem] px-4 py-2">
          <div className="flex flex-col flex-1">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-0.5">Min (R$)</span>
            <input 
              type="number" 
              value={minPrice}
              onChange={(e) => onPriceChange(e.target.value, maxPrice)}
              placeholder="0"
              className="bg-transparent w-full px-1 text-[13px] font-bold text-slate-900 focus:outline-none placeholder:text-slate-300"
            />
          </div>
          <div className="w-[1px] h-6 bg-slate-200"></div>
          <div className="flex flex-col flex-1">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-0.5">Max (R$)</span>
            <input 
              type="number" 
              value={maxPrice}
              onChange={(e) => onPriceChange(minPrice, e.target.value)}
              placeholder="1000+"
              className="bg-transparent w-full px-1 text-[13px] font-bold text-slate-900 focus:outline-none placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={onAdminClick}
            className="bg-[#F5F5F7] text-slate-400 hover:text-slate-900 w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </button>
          <button 
            onClick={onRegisterClick}
            className="flex-1 md:flex-none bg-slate-950 text-white px-7 h-11 rounded-full font-bold text-[11px] uppercase tracking-tight hover:scale-105 transition-transform"
          >
            Anunciar
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Distância:</span>
          {RADIUS_OPTIONS.map(opt => (
            <button 
              key={opt}
              onClick={() => onRadiusChange(opt)}
              className={`px-3 py-1.5 rounded-full text-[9px] font-bold transition-all border whitespace-nowrap ${radius === opt ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
            >
              {typeof opt === 'number' ? `${opt}km` : opt}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {GENDERS.map(g => (
            <button 
              key={g}
              onClick={() => onGenderChange(g)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all border whitespace-nowrap ${selectedGender === g ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {POPULAR_CITIES.map(city => (
            <button 
              key={city}
              onClick={() => onCityChange(city)}
              className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-bold transition-all border ${selectedCity === city ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}
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