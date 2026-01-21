import React, { useState } from 'react';
import { Creator } from '../types';

interface ProfileCardProps {
  creator: Creator;
  onClick: (id: string) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ creator, onClick }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const photos = creator.photos && creator.photos.length > 0 ? creator.photos : [creator.avatar];

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`WhatsApp de ${creator.name}: ${creator.phone || 'Não disponível'}`);
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <div 
      onClick={() => onClick(creator.id)}
      className="group relative aspect-[3/4.5] bg-slate-200 rounded-[2.5rem] overflow-hidden shadow-card cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
    >
      {/* Background Image */}
      <img 
        src={photos[currentPhotoIndex]} 
        alt={creator.name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

      {/* Verification & Tags */}
      <div className="absolute top-6 left-6 flex gap-2">
        {creator.verified && (
          <div className="glass-dark px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            <span className="text-[9px] font-black text-white uppercase tracking-wider">Verificada</span>
          </div>
        )}
        <div className="glass-dark px-3 py-1.5 rounded-full">
           <span className="text-[9px] font-black text-white uppercase tracking-wider">Premium</span>
        </div>
      </div>

      {/* Online Status */}
      <div className="absolute top-6 right-6">
        <div className={`w-3 h-3 rounded-full ${creator.online ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-white/30'}`}></div>
      </div>

      {/* Information Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-white tracking-tight">
              {creator.name}, {creator.age}
            </h3>
            <div className="flex items-center gap-1 text-white/80 font-bold text-xs">
              <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <span>{creator.ratingCount || 0}</span>
            </div>
          </div>
          <p className="text-white/60 text-sm font-medium flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
            {creator.location_city}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 glass-dark rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-0.5">Investimento</span>
            <p className="font-black text-white text-xl leading-none">R$ {creator.baseRate}</p>
          </div>
          <button 
            onClick={handleCall}
            className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-950 shadow-xl transition-transform active:scale-90"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27 11.72 11.72 0 00.59 3.7 1 1 0 01-.27 1.11l-2.2 2.2z" /></svg>
          </button>
        </div>
      </div>

      {/* Photo Indicators */}
      {photos.length > 1 && (
        <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-1">
          {photos.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all ${i === currentPhotoIndex ? 'bg-white w-6' : 'bg-white/30 w-1.5'}`}></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileCard;