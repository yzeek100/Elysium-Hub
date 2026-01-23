
import React from 'react';
import { GenderCategory } from '../types';
import LocationFilter from './LocationFilter';

interface SearchBarProps {
  selectedUf: string;
  selectedCity: string | null;
  selectedGender: GenderCategory | 'Todos';
  minPrice: string;
  maxPrice: string;
  radius: number | 'Ilimitado';
  onUfChange: (uf: string) => void;
  onCityChange: (city: string | null) => void;
  onGenderChange: (gender: GenderCategory | 'Todos') => void;
  onPriceChange: (min: string, max: string) => void;
  onRadiusChange: (radius: number | 'Ilimitado') => void;
  onRegisterClick: () => void;
  onAdminClick: () => void;
}

const GENDERS: (GenderCategory | 'Todos')[] = ['Todos', 'Mulher', 'Homem', 'Homossexual'];
const RADIUS_OPTIONS: (number | 'Ilimitado')[] = ['Ilimitado', 10, 25, 50, 100];

const SearchBar: React.FC<SearchBarProps> = ({ 
  selectedUf, selectedCity, selectedGender, minPrice, maxPrice, radius, onUfChange, onCityChange, onGenderChange, onPriceChange, onRadiusChange, onRegisterClick, onAdminClick
}) => {
  return (
    <div className="w-full space-y-4 animate-fade-in px-2 md:px-0">
      {/* Top Search Bar Row */}
      <div className="bg-slate-900 p-4 rounded-[2.5rem] shadow-2xl border border-slate-800 flex flex-col lg:flex-row items-center gap-4">
        
        {/* IBGE Location Filter Integration */}
        <div className="w-full lg:flex-1">
          <LocationFilter 
            initialUf={selectedUf}
            initialCity={selectedCity || ''}
            onUfChange={onUfChange}
            onLocationChange={onCityChange}
            onSearch={() => {}} // Lógica de busca automática já aplicada no App.tsx
          />
        </div>

        {/* Price Range Filter */}
        <div className="w-full lg:w-auto flex items-center gap-2 bg-slate-800 border-2 border-slate-700 rounded-full px-5 py-1.5">
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest ml-1">Min (R$)</span>
            <input 
              type="number" 
              value={minPrice}
              onChange={(e) => onPriceChange(e.target.value, maxPrice)}
              placeholder="0"
              className="bg-transparent w-16 text-[12px] font-bold text-white focus:outline-none placeholder:text-slate-600"
            />
          </div>
          <div className="w-[1px] h-6 bg-slate-700"></div>
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest ml-1">Max (R$)</span>
            <input 
              type="number" 
              value={maxPrice}
              onChange={(e) => onPriceChange(minPrice, e.target.value)}
              placeholder="1000+"
              className="bg-transparent w-16 text-[12px] font-bold text-white focus:outline-none placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={onAdminClick}
            className="w-12 h-12 bg-slate-800 border-2 border-slate-700 text-slate-400 hover:text-white rounded-full flex items-center justify-center transition-all shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </button>
          <button 
            onClick={onRegisterClick}
            className="flex-1 lg:flex-none bg-white text-slate-950 px-8 h-12 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-lg"
          >
            Anunciar
          </button>
        </div>
      </div>

      {/* Sub-Filters: Distance and Gender */}
      <div className="flex flex-col gap-3 px-1">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Distância:</span>
          {RADIUS_OPTIONS.map(opt => (
            <button 
              key={opt}
              onClick={() => onRadiusChange(opt)}
              className={`px-4 py-2 rounded-full text-[9px] font-black transition-all border-2 whitespace-nowrap ${radius === opt ? 'bg-rose-500 border-rose-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
            >
              {typeof opt === 'number' ? `${opt}km` : opt}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
          {GENDERS.map(g => (
            <button 
              key={g}
              onClick={() => onGenderChange(g)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black transition-all border-2 whitespace-nowrap ${selectedGender === g ? 'bg-white border-white text-slate-950 shadow-xl' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
