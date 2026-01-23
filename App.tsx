
import React, { useState, useEffect } from 'react';
import ProfileCard from './components/ProfileCard';
import Stories from './components/Stories';
import SearchBar from './components/SearchBar';
import RegistrationPanel from './components/RegistrationPanel';
import AdminPanel from './components/AdminPanel';
import ProfilePage from './components/ProfilePage';
import AgeVerificationModal from './components/AgeVerificationModal';
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

  // Persistence keys
  const STORAGE_KEY_CITY = 'elysium_filter_city';
  const STORAGE_KEY_UF = 'elysium_filter_uf';
  const STORAGE_KEY_GENDER = 'elysium_filter_gender';
  const STORAGE_KEY_MIN_PRICE = 'elysium_filter_min_price';
  const STORAGE_KEY_MAX_PRICE = 'elysium_filter_max_price';
  const STORAGE_KEY_RADIUS = 'elysium_filter_radius';

  // Persisted Filter States
  const [selectedUf, setSelectedUf] = useState<string>(() => localStorage.getItem(STORAGE_KEY_UF) || '');
  const [selectedCity, setSelectedCity] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY_CITY) || null);
  const [selectedGender, setSelectedGender] = useState<GenderCategory | 'Todos'>(() => (localStorage.getItem(STORAGE_KEY_GENDER) as any) || 'Todos');
  const [minPrice, setMinPrice] = useState<string>(() => localStorage.getItem(STORAGE_KEY_MIN_PRICE) || '');
  const [maxPrice, setMaxPrice] = useState<string>(() => localStorage.getItem(STORAGE_KEY_MAX_PRICE) || '');
  const [radius, setRadius] = useState<number | 'Ilimitado'>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_RADIUS);
    if (!stored || stored === 'Ilimitado') return 'Ilimitado';
    return parseInt(stored);
  });

  useEffect(() => {
    loadCreators();
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  // Sync filters to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_UF, selectedUf);
    localStorage.setItem(STORAGE_KEY_CITY, selectedCity || '');
    localStorage.setItem(STORAGE_KEY_GENDER, selectedGender);
    localStorage.setItem(STORAGE_KEY_MIN_PRICE, minPrice);
    localStorage.setItem(STORAGE_KEY_MAX_PRICE, maxPrice);
    localStorage.setItem(STORAGE_KEY_RADIUS, String(radius));
  }, [selectedUf, selectedCity, selectedGender, minPrice, maxPrice, radius]);

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

  const setView = (view: NavState['view']) => {
    setNav({ view });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCreators = creators.filter(creator => {
    const cityMatch = !selectedCity || creator.location_city?.toLowerCase().includes(selectedCity.toLowerCase());
    const genderMatch = selectedGender === 'Todos' || creator.gender === selectedGender;
    
    const price = creator.baseRate || 0;
    const min = minPrice === '' ? 0 : parseFloat(minPrice);
    const max = maxPrice === '' ? Infinity : parseFloat(maxPrice);
    const priceMatch = price >= min && price <= max;

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
        <div className="flex flex-col items-center pt-8 pb-4">
           <div className="w-10 h-10 bg-[#F13E5A] rounded-[0.9rem] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-rose-200 mb-2">E</div>
           <h1 className="text-2xl font-black tracking-tighter text-slate-900 leading-none">Elysium Hub</h1>
        </div>

        <Stories creators={creators} onCreatorClick={(id) => setNav({ view: 'profile', selectedCreatorId: id })} />

        <SearchBar 
          selectedUf={selectedUf}
          selectedCity={selectedCity}
          selectedGender={selectedGender}
          minPrice={minPrice}
          maxPrice={maxPrice}
          radius={radius}
          onUfChange={(uf) => setSelectedUf(uf)}
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[3/4.2] bg-slate-100 rounded-[2.5rem] animate-pulse"></div>
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
            <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 mb-4">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
               </div>
               <p className="text-slate-900 font-black text-lg">Nenhum criador nesta região</p>
               <p className="text-slate-400 text-sm mt-1 font-medium">Tente buscar em uma cidade vizinha ou aumentar o raio.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <AgeVerificationModal />
      <main>
        {nav.view === 'marketplace' && renderMarketplace()}
        {nav.view === 'profile' && nav.selectedCreatorId && (
          <ProfilePage 
            creator={creators.find(c => c.id === nav.selectedCreatorId)!} 
            onBack={() => setView('marketplace')} 
          />
        )}
        {nav.view === 'registration' && (
          <RegistrationPanel 
            onComplete={() => { loadCreators(); setView('marketplace'); }} 
            onCancel={() => setView('marketplace')}
          />
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
