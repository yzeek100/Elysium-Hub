import React, { useState, useEffect } from 'react';
import { creatorService } from '../services/creatorService';
import { Creator } from '../types';

const AdminPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated]);

  const load = async () => {
    setLoading(true);
    const data = await creatorService.getAll();
    setCreators(data);
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') setIsAuthenticated(true);
    else alert('Acesso negado.');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir permanentemente?')) return;
    try {
      await creatorService.delete(id);
      setCreators(prev => prev.filter(c => c.id !== id));
    } catch (err) { alert('Erro.'); }
  };

  const filtered = creators.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] p-6">
        <div className="bg-white p-12 rounded-[3rem] shadow-premium max-w-md w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <h2 className="text-2xl font-black tracking-tight">Elysium Admin</h2>
            <p className="text-slate-400 text-sm font-medium mt-2">Área restrita de gestão</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full bg-[#F5F5F7] border-0 px-6 py-5 rounded-2xl focus:ring-2 focus:ring-slate-100 font-bold text-center"
            />
            <button className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Acessar</button>
          </form>
          <button onClick={onBack} className="w-full text-xs font-bold text-slate-300 uppercase tracking-widest">Voltar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-6 space-y-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Gestão</h1>
          <p className="text-slate-400 font-bold mt-1">Controle de perfis e aprovações.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Buscar..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold shadow-premium focus:outline-none"
          />
          <button onClick={onBack} className="bg-slate-100 px-6 py-4 rounded-2xl font-bold text-xs">Sair</button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-premium overflow-hidden border border-slate-50">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Criador</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Cidade</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="p-20 text-center text-slate-300 font-bold">Carregando dados...</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <img src={c.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt="" />
                    <div>
                      <p className="font-black text-slate-900 leading-none mb-1">{c.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">@{c.name.toLowerCase().replace(/ /g, '')}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${c.online ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                    {c.online ? 'Online' : 'Offline'}
                  </span>
                </td>
                <td className="px-10 py-6 font-bold text-slate-500 text-sm">{c.location_city}</td>
                <td className="px-10 py-6 text-right">
                  <button 
                    onClick={() => handleDelete(c.id)}
                    className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;