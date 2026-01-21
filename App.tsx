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
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<GenderCategory | 'Todos'>('Todos');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [radius, setRadius] = useState<number | 'Ilimitado'>('Ilimitado');

  useEffect(() => {
    loadCreators();
    // Geolocalização apenas para fins de cálculo de raio se disponível
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
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
          selectedGender={selectedGender}
          minPrice={minPrice}
          maxPrice={maxPrice}
          radius={radius}
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

  const renderProfile = () => {
    const creator = creators.find(c => c.id === nav.selectedCreatorId);
    if (!creator) {
      setView('marketplace');
      return null;
    }

    const photos = creator.photos?.length ? creator.photos : [creator.avatar];

    return (
      <div className="min-h-screen bg-slate-50 animate-fade-in pb-32">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="relative aspect-[3/4] md:aspect-video w-full overflow-hidden">
            <img src={photos[0]} className="w-full h-full object-cover" alt="Profile Hero" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-black/30"></div>
            
            <button 
              onClick={() => setView('marketplace')}
              className="absolute top-6 left-6 w-12 h-12 glass rounded-full flex items-center justify-center text-slate-950 shadow-2xl z-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
            </button>

            {creator.verified && (
              <div className="absolute top-6 right-6 bg-blue-500 text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                Perfil Verificado
              </div>
            )}
          </div>

          <div className="px-6 -mt-16 relative z-10 bg-slate-50 rounded-t-[3.5rem] pt-12">
            {/* Header Info */}
            <div className="flex flex-col items-center text-center space-y-4 mb-10">
              <h1 className="text-5xl font-black text-slate-950 tracking-tighter">
                {creator.name}, {creator.age}
              </h1>
              <div className="flex flex-wrap justify-center items-center gap-2">
                 <span className="bg-white border border-slate-100 px-4 py-2 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-sm">{creator.gender}</span>
                 <span className="bg-rose-100 border border-rose-200 px-4 py-2 rounded-full text-[10px] font-black text-rose-600 uppercase tracking-widest shadow-sm">{creator.location_city}</span>
                 <span className="bg-green-100 border border-green-200 px-4 py-2 rounded-full text-[10px] font-black text-green-700 uppercase tracking-widest shadow-sm">
                   {creator.online ? 'Disponível Agora' : 'Offline'}
                 </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cachê / Hora</p>
                 <p className="text-3xl font-black text-slate-950">R$ {creator.baseRate}</p>
              </div>
              <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avaliações</p>
                 <div className="flex items-center gap-2">
                   <p className="text-3xl font-black text-slate-950">{creator.ratingCount || 0}</p>
                   <svg className="w-6 h-6 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                 </div>
              </div>
            </div>

            {/* Tags Section */}
            {(creator.aboutTags?.length || creator.servicesTags?.length) && (
              <div className="space-y-4 mb-12">
                <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-1">Especialidades & Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {creator.aboutTags?.map(tag => (
                    <span key={tag} className="bg-slate-950 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest">#{tag}</span>
                  ))}
                  {creator.servicesTags?.map(tag => (
                    <span key={tag} className="bg-rose-500 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Description Section */}
            <div className="space-y-6">
              <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-1">Sobre Mim</h3>
              <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                <p className="text-lg text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                  {creator.bio}
                </p>
              </div>
            </div>

            {/* Gallery Section */}
            {photos.length > 1 && (
              <div className="mt-16 space-y-6">
                <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest ml-1">Galeria de Fotos</h3>
                <div className="grid grid-cols-2 gap-4">
                  {photos.map((url, idx) => (
                    <div key={idx} className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-sm border border-slate-100">
                      <img src={url} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Contact Bar */}
        <div className="fixed bottom-6 left-0 right-0 px-6 z-50">
          <div className="max-w-md mx-auto glass rounded-[2.5rem] p-4 flex items-center gap-4 shadow-2xl border border-white/40">
            <div className="flex-1 px-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Investimento</p>
              <p className="text-2xl font-black text-slate-950">R$ {creator.baseRate}</p>
            </div>
            <a 
              href={`https://wa.me/${creator.phone?.replace(/\D/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-500 text-white h-16 px-10 rounded-[1.8rem] font-bold text-sm shadow-xl shadow-green-100 flex items-center gap-2 hover:scale-105 transition-transform active:scale-95"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03a11.934 11.934 0 001.621 6.118L0 24l6.09-1.597a11.895 11.895 0 005.952 1.594h.005c6.634 0 12.032-5.396 12.035-12.032a11.85 11.85 0 00-3.518-8.498" /></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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