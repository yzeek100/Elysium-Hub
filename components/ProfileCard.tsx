
import React, { useState } from 'react';
import { Creator } from '../types';

interface ProfileCardProps {
  creator: Creator;
  onClick: (id: string) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ creator, onClick }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const photos = creator.photos && creator.photos.length > 0 ? creator.photos : [creator.avatar];

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Lógica para mostrar telefone ou abrir discador
    alert(`Telefone de ${creator.name}: ${creator.phone || 'Privado'}`);
  };

  return (
    <div 
      onClick={() => onClick(creator.id)}
      className="bg-white rounded-[2.5rem] overflow-hidden shadow-premium border border-slate-100 cursor-pointer hover:shadow-2xl transition-all max-w-[420px] mx-auto group relative"
    >
      {/* Photo Carousel Area */}
      <div className="relative aspect-[3/4.2] overflow-hidden bg-slate-100">
        <img 
          src={photos[currentPhotoIndex]} 
          alt={creator.name} 
          className="w-full h-full object-cover transition-all duration-500"
        />
        
        {/* Carousel Navigation Overlays */}
        {photos.length > 1 && (
          <>
            <button 
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}

        {/* Carousel Dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 px-10">
          {photos.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentPhotoIndex ? 'bg-white w-6 shadow-lg' : 'bg-white/40 w-1.5'}`}
            ></div>
          ))}
        </div>

        {/* Verification Check */}
        <div className="absolute top-6 right-6">
           <div className="bg-blue-600 p-1.5 rounded-xl shadow-xl border border-white/20">
             <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
           </div>
        </div>

        {/* Status Tag */}
        <div className="absolute top-6 left-6">
           <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/10">
             <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Destaque</span>
           </div>
        </div>
      </div>

      {/* Info Area */}
      <div className="p-7 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${creator.online ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {creator.online ? 'Disponível agora' : `Offline ${creator.offlineTime || 'há pouco'}`}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#F13E5A] font-black text-[11px] uppercase tracking-tighter">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <span>{creator.ratingCount} votos</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-2xl font-black text-slate-950 tracking-tight leading-none group-hover:text-[#F13E5A] transition-colors">
            {creator.name}, {creator.age}
          </h3>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
            <span className="truncate">{creator.location_area} • {creator.location_city}</span>
          </div>
        </div>

        {/* Value Section */}
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Investimento</span>
           <p className="font-black text-slate-950 text-lg">R$ {creator.baseRate} <span className="text-[10px] text-slate-400">/ 1h</span></p>
        </div>

        {/* Action Button - RE-STYLED FOR MAXIMUM VISIBILITY */}
        <button 
          onClick={handleCall}
          className="w-full bg-[#F13E5A] hover:bg-[#D63049] text-white py-4.5 px-6 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-rose-200 active:scale-95 group/btn border-b-4 border-black/10 active:border-b-0"
        >
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center group-hover/btn:scale-110 transition-transform">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27 11.72 11.72 0 00.59 3.7 1 1 0 01-.27 1.11l-2.2 2.2z" /></svg>
          </div>
          <span>Ver telefone agora</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
