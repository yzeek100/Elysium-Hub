
import React from 'react';
import { PLATFORM_FEE_PERCENTAGE } from '../constants.tsx';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Saldo Total', value: 'R$ 4.250,00', color: 'text-white' },
    { label: 'Disponível para Saque', value: 'R$ 1.120,50', color: 'text-green-400' },
    { label: 'Aguardando Liberação', value: 'R$ 3.129,50', color: 'text-yellow-400' },
  ];

  const recentActivity = [
    { type: 'Videochamada Privada', amount: 100, date: 'Hoje, 14:20', status: 'Processado' },
    { type: 'Sessão Exclusiva', amount: 300, date: 'Ontem, 21:00', status: 'Pendente' },
    { type: 'Conteúdo Digital', amount: 50, date: 'Ontem, 18:45', status: 'Processado' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Seu Painel de Performance</h1>
          <p className="text-gray-400">Gerencie seus ganhos e sessões em tempo real.</p>
        </div>
        <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all">
          Solicitar Saque
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-white/5 p-6 rounded-2xl">
            <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white">Atividade Recente</h2>
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-4 font-semibold">Serviço</th>
                  <th className="px-6 py-4 font-semibold">Valor Bruto</th>
                  <th className="px-6 py-4 font-semibold">Plataforma (25%)</th>
                  <th className="px-6 py-4 font-semibold">Líquido</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentActivity.map((act, i) => (
                  <tr key={i} className="text-sm text-gray-300 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">{act.type}</td>
                    <td className="px-6 py-4">R$ {act.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-red-400">- R$ {(act.amount * PLATFORM_FEE_PERCENTAGE).toFixed(2)}</td>
                    <td className="px-6 py-4 text-green-400">R$ {(act.amount * (1 - PLATFORM_FEE_PERCENTAGE)).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${act.status === 'Processado' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {act.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Configurar Disponibilidade</h2>
          <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Modo Online</span>
              <div className="w-12 h-6 bg-purple-600 rounded-full relative">
                 <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 space-y-2">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Preços de Referência</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Vídeo (15 min)</span>
                <span className="text-white">R$ 150,00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Sessão Exclusiva</span>
                <span className="text-white">R$ 300,00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
