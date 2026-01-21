import React, { useState, useEffect } from 'react';

interface UF {
  id: number;
  sigla: string;
  nome: string;
}

interface City {
  id: number;
  nome: string;
}

interface LocationFilterProps {
  onLocationChange: (city: string | null) => void;
  onSearch: () => void;
}

const LocationFilter: React.FC<LocationFilterProps> = ({ onLocationChange, onSearch }) => {
  const [ufs, setUfs] = useState<UF[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedUf, setSelectedUf] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [loadingCities, setLoadingCities] = useState(false);

  // Carregar Estados ao montar
  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(res => res.json())
      .then(data => setUfs(data))
      .catch(err => console.error("Erro ao buscar UFs:", err));
  }, []);

  // Carregar Cidades quando UF mudar
  useEffect(() => {
    if (!selectedUf) {
      setCities([]);
      return;
    }

    setLoadingCities(true);
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(res => res.json())
      .then(data => {
        setCities(data);
        setLoadingCities(false);
      })
      .catch(err => {
        console.error("Erro ao buscar cidades:", err);
        setLoadingCities(false);
      });
  }, [selectedUf]);

  const handleUfChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUf(e.target.value);
    setSelectedCity('');
    onLocationChange(null);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setSelectedCity(city);
    onLocationChange(city || null);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full animate-fade-in">
      {/* Estado Select */}
      <div className="relative w-full md:w-48">
        <select
          value={selectedUf}
          onChange={handleUfChange}
          className="w-full bg-slate-800 border-2 border-slate-700 text-slate-100 px-5 py-3.5 rounded-full text-xs font-bold appearance-none focus:outline-none focus:border-rose-500 transition-all cursor-pointer"
        >
          <option value="">Estado (UF)</option>
          {ufs.map(uf => (
            <option key={uf.id} value={uf.sigla}>{uf.sigla} - {uf.nome}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>

      {/* Cidade Select */}
      <div className="relative w-full flex-1">
        <select
          value={selectedCity}
          onChange={handleCityChange}
          disabled={!selectedUf || loadingCities}
          className="w-full bg-slate-800 border-2 border-slate-700 text-slate-100 px-5 py-3.5 rounded-full text-xs font-bold appearance-none focus:outline-none focus:border-rose-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <option value="">{loadingCities ? 'Carregando cidades...' : 'Selecione a Cidade'}</option>
          {cities.map(city => (
            <option key={city.id} value={city.nome}>{city.nome}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>

      {/* Botão de Busca */}
      <button 
        onClick={onSearch}
        className="w-full md:w-auto bg-rose-500 hover:bg-rose-600 text-white px-8 py-3.5 rounded-full flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-950/20 active:scale-95 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        Buscar
      </button>
    </div>
  );
};

export default LocationFilter;