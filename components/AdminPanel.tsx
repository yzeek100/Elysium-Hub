
import React, { useState, useEffect } from 'react';
import { creatorService } from '../services/creatorService';
import { Creator } from '../types';

const AdminPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      load();
    }
  }, [isAuthenticated]);

  const load = async () => {
    setLoading(true);
    const data = await creatorService.getAll();
    setCreators(data);
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este perfil?')) return;
    try {
      await creatorService.delete(id);
      setCreators(prev => prev.filter(c => c.id !== id));
      alert('Perfil excluído com sucesso.');
    } catch (err) {
      alert('Erro ao excluir.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha admin"
              className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 text-center rounded-2xl focus:outline-none focus:border-rose-500 font-bold"
            />
            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Entrar</button>
          </form>
          <button onClick={onBack} className="text-xs font-black text-slate-400 uppercase tracking-widest">Voltar ao site</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Gestão de Criadores</h1>
          <p className="text-slate-400 font-bold text-sm">Controle total dos perfis ativos.</p>
        </div>
        <button onClick={onBack} className="bg-slate-100 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">Sair do Painel</button>
      </div>

      <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-premium">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Criador</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Categoria</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Cidade</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="p-20 text-center text-slate-400 font-black uppercase">Carregando...</td></tr>
            ) : creators.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <img src={c.avatar} className="w-12 h-12 rounded-full object-cover shadow-sm" alt="" />
                    <div>
                      <p className="font-black text-slate-900 leading-none mb-1">{c.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{c.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase">{c.gender}</span>
                </td>
                <td className="px-8 py-6 font-bold text-slate-600 text-sm">{c.location_city}</td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => handleDelete(c.id)}
                    className="bg-rose-500 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-rose-100 hover:scale-110 transition-transform"
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
