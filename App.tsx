import React, { useState, useEffect } from 'react';
import ProfileCard from './components/ProfileCard';
import Stories from './components/Stories';
import SearchBar from './components/SearchBar';
import RegistrationPanel from './components/RegistrationPanel';
import AdminPanel from './components/AdminPanel';
import { Creator, NavState, GenderCategory } from './types';
import { creatorService } from './services/creatorService';
import { supabase } from './lib/supabase';

// Helper para cálculo de distância entre coordenadas (Haversine)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const App: React.FC = () => {
  const [nav, setNav] = useState<NavState>({ view: 'marketplace' });
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<GenderCategory | 'Todos'>('Todos');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [radius, setRadius] = useState<number | 'Ilimitado'>('Ilimitado');
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    loadCreators();
    handleDetectLocation();
  }, []);

  const loadCreators = async () => {
    setLoading(true);
    try {
      if (supabase) {
        const data = await creatorService.getAll();
        setCreators(data);
      }
    } catch (err) {
      console.error("Erro ao carregar criadores:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        
        // Simulação de geocoding reverso simplificado
        setTimeout(() => {
          setDetectedCity("São Paulo");
          setSelectedCity(null);
          setIsLocating(false);
        }, 800);
      }, () => setIsLocating(false));
    }
  };

  const setView = (view: NavState['view']) => {
    setNav({ view });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCreators = creators.filter(creator => {
    const cityToFilter = selectedCity || detectedCity;
    const cityMatch = !cityToFilter || creator.location_city?.toLowerCase().includes(cityToFilter.toLowerCase());
    const genderMatch = selectedGender === 'Todos' || creator.gender === selectedGender;
    
    const price = creator.baseRate || 0;
    const min = minPrice === '' ? 0 : parseFloat(minPrice);
    const max = maxPrice === '' ? Infinity : parseFloat(maxPrice);
    const priceMatch = price >= min && price <= max;

    // Filtro de raio
    let radiusMatch = true;
    if (radius !== 'Ilimitado' && userCoords && creator.location_lat && creator.location_lng) {
      const distance = getDistance(userCoords.lat, userCoords.lng, creator.location_lat, creator.location_lng);
      radiusMatch = distance <= radius;
    }

    return cityMatch && genderMatch && priceMatch && radiusMatch;
  });

  const renderMarketplace = () => {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6 pb-20 space-y-4">
        {/* Header Branding - Subtítulo removido e tamanhos reduzidos */}
        <div className="flex flex-col items-center pt-6 pb-2">
           <div className="w-8 h-8 bg-[#F13E5A] rounded-[0.7rem] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-rose-200 mb-2">E</div>
           <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">Elysium Hub</h1>
        </div>

        <Stories creators={creators} onCreatorClick={(id) => setNav({ view: 'profile', selectedCreatorId: id })} />

        <SearchBar 
          detectedCity={detectedCity} 
          selectedCity={selectedCity}
          selectedGender={selectedGender}
          minPrice={minPrice}
          maxPrice={maxPrice}
          radius={radius}
          isLocating={isLocating} 
          onLocate={handleDetectLocation} 
          onCityChange={(city) => setSelectedCity(city)}
          onGenderChange={(gender) => setSelectedGender(gender)}
          onPriceChange={(min, max) => {
            setMinPrice(min);
            setMaxPrice(max);
          }}
          onRadiusChange={(r) => setRadius(r)}
          onRegisterClick={() => setView('registration')}
          onAdminClick={() => setView('admin')}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[3/4.2] bg-slate-100 rounded-[2rem] animate-pulse"></div>
            ))
          ) : filteredCreators.length > 0 ? (
            filteredCreators.map(creator => (
              <ProfileCard 
                key={creator.id} 
                creator={creator} 
                onClick={(id) => setNav({ view: 'profile', selectedCreatorId: id })}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-slate-100">
               <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 mb-3">
                 <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
               </div>
               <p className="text-slate-900 font-bold text-sm">Nenhum criador encontrado</p>
               <p className="text-slate-400 text-xs mt-1">Tente aumentar o raio de distância ou ajustar os filtros de preço.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    const creator = creators.find(c => c.id === nav.selectedCreatorId);
    if (!creator) {
      setView('marketplace');
      return null;
    }

    return (
      <div className="min-h-screen bg-white animate-fade-in pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="relative aspect-[3/4] w-full">
            <img src={creator.photos?.[0] || creator.avatar} className="w-full h-full object-cover" alt="Cover" />
            <button 
              onClick={() => setView('marketplace')}
              className="absolute top-5 left-5 w-10 h-10 glass rounded-full flex items-center justify-center text-slate-950 shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
            </button>
          </div>

          <div className="px-6 -mt-8 relative z-10 bg-white rounded-t-[2.5rem] pt-8">
            <div className="flex flex-col items-center text-center space-y-3 mb-8">
              <h1 className="text-4xl font-black text-slate-950 tracking-tighter">
                {creator.name}, {creator.age}
              </h1>
              <div className="flex items-center gap-2">
                 <span className="bg-slate-100 px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">{creator.gender}</span>
                 <span className="bg-rose-50 px-3 py-1.5 rounded-full text-[10px] font-bold text-rose-500 uppercase tracking-widest">{creator.location_city}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-10">
              <div className="bg-slate-50 p-5 rounded-[1.8rem] text-center">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Cachê</p>
                 <p className="text-xl font-black text-slate-950">R$ {creator.baseRate}</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-[1.8rem] text-center">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Avaliações</p>
                 <p className="text-xl font-black text-slate-950">{creator.ratingCount || 0}</p>
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Bio</h3>
              <p className="text-base text-slate-600 leading-relaxed font-medium">{creator.bio}</p>
              
              <div className="flex flex-wrap gap-1.5">
                {creator.aboutTags?.map(tag => (
                  <span key={tag} className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-full text-[10px] font-bold text-slate-600">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-4 left-0 right-0 px-4 z-50">
          <div className="max-w-md mx-auto glass rounded-[2rem] p-3 flex items-center gap-3 shadow-2xl">
            <div className="flex-1 px-3">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Investimento</p>
              <p className="text-lg font-black text-slate-950">R$ {creator.baseRate}</p>
            </div>
            <button className="bg-green-500 text-white h-12 px-8 rounded-[1.4rem] font-bold text-xs shadow-lg shadow-green-100 flex items-center gap-2 hover:scale-105 transition-transform active:scale-95">
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main>
        {nav.view === 'marketplace' && renderMarketplace()}
        {nav.view === 'profile' && renderProfile()}
        {nav.view === 'registration' && (
          <RegistrationPanel onComplete={() => { loadCreators(); setView('marketplace'); }} />
        )}
        {nav.view === 'admin' && (
          <AdminPanel onBack={() => { loadCreators(); setView('marketplace'); }} />
        )}
      </main>
      <footer className="py-12 text-center">
          <p className="text-[8px] uppercase tracking-[0.4em] font-black text-slate-300">
            © 2024 • Elysium Hub
          </p>
      </footer>
    </div>
  );
};

export default App;