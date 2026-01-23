
import React from 'react';
import { Creator } from '../types';

interface ProfilePageProps {
  creator: Creator;
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ creator, onBack }) => {
  const photos = creator.photos?.length ? creator.photos : [creator.avatar];
  const baseRate = creator.baseRate || 0;

  // Cálculo de taxas baseadas em multiplicadores de mercado premium
  const priceList = [
    { label: '1 Hora', value: baseRate },
    { label: '2 Horas', value: Math.round(baseRate * 1.8) },
    { label: '5 Horas', value: Math.round(baseRate * 4) },
    { label: '12 Horas (Pernoite)', value: Math.round(baseRate * 8) },
    { label: '24 Horas', value: Math.round(baseRate * 14) },
  ];

  const whatsappLink = `https://wa.me/${creator.whatsapp?.replace(/\D/g, '')}?text=Olá ${creator.name}, vi seu perfil premium no Elysium e gostaria de agendar uma sessão.`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 animate-fade-in pb-40 overflow-x-hidden selection:bg-rose-500/30">
      {/* Botão Voltar Minimalista */}
      <button 
        onClick={onBack}
        className="fixed top-8 left-8 z-[70] w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500 shadow-2xl"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="max-w-4xl mx-auto px-6 pt-24">
        {/* GALERIA BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[500px] md:h-[600px]">
          {/* Foto Principal */}
          <div className="md:col-span-2 h-full rounded-3xl overflow-hidden group">
            <img 
              src={photos[0]} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
              alt={creator.name} 
            />
          </div>
          {/* Coluna de Fotos Menores */}
          <div className="hidden md:grid grid-rows-2 gap-4 h-full">
            <div className="rounded-3xl overflow-hidden">
              <img 
                src={photos[1] || photos[0]} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                alt="Detalhe 1" 
              />
            </div>
            <div className="rounded-3xl overflow-hidden relative">
              <img 
                src={photos[2] || photos[0]} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                alt="Detalhe 2" 
              />
              {photos.length > 3 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                  <span className="text-xl font-black text-white">+{photos.length - 2}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* IDENTITY SECTION */}
        <div className="relative flex flex-col items-center -mt-16 mb-16">
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-b from-white/20 to-transparent shadow-2xl mb-6">
            <img 
              src={creator.avatar} 
              className="w-full h-full rounded-full object-cover border-4 border-slate-950" 
              alt="Profile" 
            />
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase">
              {creator.name} <span className="text-slate-600">/ {creator.age}</span>
            </h1>
            <div className="flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              <span className="flex items-center gap-2">
                <svg className="w-3 h-3 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                {creator.location_city}
              </span>
              <span className="text-white/20">|</span>
              <span className="text-rose-500">A partir de R$ {baseRate}</span>
            </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 mt-20">
          {/* Bio & Details */}
          <div className="lg:col-span-3 space-y-12">
            <section className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Bio</h3>
              <p className="text-xl text-slate-400 font-light leading-relaxed">
                {creator.description || creator.bio || "Nenhuma descrição disponível."}
              </p>
            </section>

            <section className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Características</h3>
              <div className="flex flex-wrap gap-2">
                {creator.services?.map((tag, i) => (
                  <span key={i} className="px-5 py-2.5 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Pricing Section (Investimento) */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] space-y-10 shadow-premium">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 text-center">Investimento</h3>
              <div className="space-y-6">
                {priceList.map((item, i) => (
                  <div key={i} className="flex justify-between items-baseline group">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">
                      {item.label}
                    </span>
                    <div className="flex-1 border-b border-white/5 mx-4 border-dotted opacity-20 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-xl font-black text-white">
                      R$ {item.value}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-widest">
                * Valores sujeitos a alteração dependendo do deslocamento.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED CALL TO ACTION (CTA) */}
      <div className="fixed bottom-10 right-10 z-[80] flex items-center gap-3">
        {/* WhatsApp/Chat Secundário */}
        <a 
          href={whatsappLink}
          target="_blank"
          className="w-16 h-16 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all shadow-2xl"
          title="Outros Serviços"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </a>

        {/* Botão Principal de Videochamada */}
        <button 
          onClick={() => window.open(whatsappLink, '_blank')}
          className="h-16 px-8 bg-black border border-white/20 text-white rounded-full flex items-center gap-4 font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_40px_rgba(255,255,255,0.05)] hover:scale-105 transition-all group active:scale-95"
        >
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-rose-500 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          </div>
          Videochamada
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
