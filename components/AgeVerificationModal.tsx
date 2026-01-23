import React, { useState, useEffect } from 'react';

const AgeVerificationModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isVerified = localStorage.getItem('elysium_age_verified');
    if (!isVerified) {
      setIsVisible(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('elysium_age_verified', 'true');
    setIsVisible(false);
  };

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl text-center space-y-8 animate-fade-in">
        <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto border-2 border-rose-500/20">
          <span className="text-3xl font-black">18+</span>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-white tracking-tighter">Conteúdo Adulto</h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Este site contém material restrito para maiores de 18 anos. Ao entrar, você confirma que possui idade legal e aceita nossos termos.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleConfirm}
            className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-all shadow-xl"
          >
            Tenho +18 anos / Entrar
          </button>
          <button 
            onClick={handleExit}
            className="w-full bg-slate-800 text-slate-400 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:text-white transition-all"
          >
            Sair agora
          </button>
        </div>
        
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          Elysium Hub • Conexões Premium
        </p>
      </div>
    </div>
  );
};

export default AgeVerificationModal;