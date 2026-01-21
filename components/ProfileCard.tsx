import React, { useState } from 'react';
import { Creator } from '../types';

interface ProfileCardProps {
  creator: Creator;
  onClick: (id: string) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ creator, onClick }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const photos = creator.photos && creator.photos.length > 0 ? creator.photos : [creator.avatar];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div 
      onClick={() => onClick(creator.id)}
      className="group relative aspect-[3/4.5] bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-card cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
    >
      {/* Photo Carousel */}
      <div className="absolute inset-0">
        <img 
          src={photos[currentPhotoIndex]} 
          alt={creator.name} 
          className="w-full h-full object-cover transition-opacity duration-500"
        />
      </div>
      
      {/* Navigation Arrows */}
      {photos.length > 1 && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button 
            onClick={handlePrev}
            className="w-10 h-10 glass-dark rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button 
            onClick={handleNext}
            className="w-10 h-10 glass-dark rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-60"></div>

      {/* Badges */}
      <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
        {creator.verified && (
          <div className="bg-blue-500 px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            <span className="text-[8px] font-black text-white uppercase tracking-widest">Verificada</span>
          </div>
        )}
        {creator.online && (
          <div className="bg-green-500/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            <span className="text-[8px] font-black text-white uppercase tracking-widest">Disponível</span>
          </div>
        )}
      </div>

      {/* Main Info */}
      <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-white tracking-tight">
              {creator.name}, {creator.age}
            </h3>
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg">
              <svg className="w-3 h-3 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <span className="text-white text-[10px] font-bold">{creator.ratingCount || 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-white/60 text-xs font-bold uppercase tracking-wider">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
            {creator.location_city}
          </div>
        </div>

        {/* Price Tag Box */}
        <div className="flex items-end justify-between">
          <div className="bg-white rounded-2xl p-4 shadow-2xl transform transition-transform group-hover:scale-105">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Cachê / Hora</span>
            <p className="font-black text-slate-900 text-2xl leading-none">R$ {creator.baseRate}</p>
          </div>
          
          <div className="flex gap-1 mb-2">
            {photos.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === currentPhotoIndex ? 'bg-white w-5' : 'bg-white/30 w-1'}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;