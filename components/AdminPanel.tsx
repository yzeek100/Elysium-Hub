import React, { useState, useEffect } from 'react';
import { creatorService } from '../services/creatorService';
import { Creator } from '../types';

const AdminPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

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
    setActionInProgress(id);
    try {
      await creatorService.delete(id);
      setCreators(prev => prev.filter(c => c.id !== id));
    } catch (err: any) { 
      alert(`Erro ao excluir: ${err.message}`); 
    } finally {
      setActionInProgress(null);
    }
  };

  const handleToggleOnline = async (id: string, currentStatus: boolean) => {
    setActionInProgress(id);
    try {
      await creatorService.update(id, { online: !currentStatus });
      setCreators(prev => prev.map(c => c.id === id ? { ...c, online: !currentStatus } : c));
    } catch (err: any) {
      alert(`Erro ao atualizar status: ${err.message}`);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleToggleVerified = async (id: string, currentStatus: boolean) => {
    setActionInProgress(id);
    try {
      await creatorService.update(id, { verified: !currentStatus });
      setCreators(prev => prev.map(c => c.id === id ? { ...c, verified: !currentStatus } : c));
    } catch (err: any) {
      alert(`Erro ao atualizar verificação: ${err.message}`);
    } finally {
      setActionInProgress(null);
    }
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
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Gestão</h1>
          <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-widest">Painel de Controle de Criadores</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Buscar por nome..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold shadow-premium focus:outline-none"
          />
          <button onClick={onBack} className="bg-slate-100 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest">Sair</button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-premium overflow-hidden border border-slate-50">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Criador</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Verificação</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="p-20 text-center text-slate-300 font-bold">Carregando dados...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="p-20 text-center text-slate-300 font-bold">Nenhum criador encontrado.</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} className={`hover:bg-slate-50/50 transition-colors ${actionInProgress === c.id ? 'opacity-50 pointer-events-none' : ''}`}>
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <img src={c.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt="" />
                    <div>
                      <p className="font-black text-slate-900 leading-none mb-1">{c.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{c.location_city}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <button 
                    onClick={() => handleToggleVerified(c.id, !!c.verified)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${c.verified ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                    {c.verified ? 'Verificado' : 'Não Verif.'}
                  </button>
                </td>
                <td className="px-10 py-6">
                  <button 
                    onClick={() => handleToggleOnline(c.id, !!c.online)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${c.online ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  >
                    {c.online ? 'Online' : 'Offline'}
                  </button>
                </td>
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