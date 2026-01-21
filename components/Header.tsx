
import React from 'react';
import { NavState } from '../types';

interface HeaderProps {
  currentView: string;
  setView: (view: NavState['view']) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="sticky top-0 z-[60] bg-white border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm">
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setView('marketplace')}
      >
        <div className="relative">
          <div className="w-10 h-10 bg-[#F13E5A] flex items-center justify-center font-logo text-white font-black group-hover:scale-110 transition-transform rounded-xl shadow-lg shadow-rose-100">
            E
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-logo font-black tracking-tight text-slate-900 leading-none">ELYSIUM</span>
          <span className="text-[9px] font-black tracking-[0.3em] text-[#F13E5A] uppercase">Premium Hub</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={() => setView('dashboard')}
          className="hidden sm:block text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
        >
          Painel
        </button>
        <button 
          onClick={() => setView('registration')}
          className="bg-[#F13E5A] text-white px-6 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#D63049] transition-all shadow-xl shadow-rose-200 active:scale-95"
        >
          Anuncie Grátis
        </button>
      </div>
    </header>
  );
};

export default Header;