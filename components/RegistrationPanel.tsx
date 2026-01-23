import React, { useState, useCallback } from 'react';
import { creatorService } from '../services/creatorService';
import { GenderCategory } from '../types';

// OPÇÕES DE TAGS PARA O FORMULÁRIO
const TAG_OPTIONS = {
  about: [
    'Novinha', 'Morena', 'Loira', 'Ruiva', 'Magra', 
    'Mignon', 'Atlética', 'Siliconada', 'Natural', 'Tatuada',
    'Estudante', 'Executiva', 'Madura', 'Fitness'
  ],
  services: [
    'Videochamada Privada', 'Conteúdo Digital', 'Sessão VIP', 
    'Massagem Relaxante', 'Fantasias', 'Jantar/Eventos',
    'Acompanhamento Online', 'Conversa Exclusiva', 'Sessão de Fotos'
  ],
};

// COMPONENTES DE INPUT FORA DA FUNÇÃO PRINCIPAL (CORRIGE BUG DE FOCO)
const DarkInput = ({ label, name, value, onChange, placeholder, type = "text" }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <input 
      name={name}
      type={type} 
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-900 border-2 border-slate-800 px-6 py-5 text-slate-100 text-base rounded-2xl focus:outline-none focus:border-rose-500 focus:bg-slate-800 transition-all font-bold placeholder:text-slate-600"
    />
  </div>
);

const DarkTextArea = ({ label, name, value, onChange, placeholder }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <textarea 
      name={name}
      value={value}
      onChange={onChange}
      className="w-full h-48 bg-slate-900 border-2 border-slate-800 px-6 py-6 text-slate-100 text-base rounded-[2rem] focus:outline-none focus:border-rose-500 focus:bg-slate-800 transition-all font-bold placeholder:text-slate-600 resize-none"
      placeholder={placeholder}
    />
  </div>
);

interface RegistrationPanelProps {
  onComplete: () => void;
  onCancel: () => void;
}

const RegistrationPanel: React.FC<RegistrationPanelProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'Mulher' as GenderCategory,
    location_city: '',
    location_area: '',
    bio: '',
    baseRate: '',
    photos: ['', '', '', ''],
    aboutTags: [] as string[],
    servicesTags: [] as string[],
  });

  const totalSteps = 5;

  // Lógica de Geração de Descrição Picante (MOCK)
  const gerarDescricaoPicante = (nome: string, idade: string) => {
    if (!nome) return alert("Preencha seu nome primeiro!");
    const templates = [
      `Oi amores, sou a ${nome}, tenho ${idade || '20'} aninhos com carinha de 18. Sou aquela morena safada que faz tudo o que você sempre sonhou. Faço um oral bem babadinho, sou viciada em prazer e adoro um encontro sem tabus. Venha me conhecer e descobrir porque sou a favorita.`,
      `Prazer, me chamo ${nome}. Tenho ${idade || '22'} anos de puro fogo. Sou uma delícia completa, adoro explorar fantasias e garanto que comigo o seu tempo será inesquecível. Atendo com total discrição e carinho. O que você está esperando para me chamar no WhatsApp?`,
      `Mayle Santos? Não, sou a ${nome}, sua nova obsessão. Com ${idade || '19'} anos, sou a mistura perfeita de anjo e demônio. Faço o estilo namoradinha mas entre quatro paredes sou uma verdadeira leoa. Sou natural, cheirosinha e estou pronta para te deixar louco de tesão.`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  const handleMagicBio = () => {
    const bioText = gerarDescricaoPicante(formData.name, formData.age);
    if (bioText) {
      setFormData(prev => ({ ...prev, bio: bioText }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleTag = (category: 'aboutTags' | 'servicesTags', tag: string) => {
    setFormData(prev => {
      const currentTags = prev[category];
      const newTags = currentTags.includes(tag) 
        ? currentTags.filter(t => t !== tag) 
        : [...currentTags, tag];
      return { ...prev, [category]: newTags };
    });
  };

  const handlePhotoChange = (index: number, value: string) => {
    const newPhotos = [...formData.photos];
    newPhotos[index] = value;
    setFormData(prev => ({ ...prev, photos: newPhotos }));
  };

  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setFormData(prev => ({
            ...prev,
            location_city: 'São Paulo',
            location_area: 'Centro'
          }));
          setIsLocating(false);
        },
        () => {
          alert('Permissão de localização negada.');
          setIsLocating(false);
        }
      );
    }
  };

  const handleSubmit = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const cleanPhotos = formData.photos.filter(p => p.trim() !== '');
      if (cleanPhotos.length === 0) {
        alert('Adicione pelo menos uma foto.');
        setIsSaving(false);
        return;
      }

      await creatorService.create({
        ...formData,
        age: parseInt(formData.age) || 18,
        baseRate: parseInt(formData.baseRate) || 0,
        photos: cleanPhotos,
        avatar: cleanPhotos[0]
      });
      
      setShowSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (err: any) {
      alert(`Erro ao salvar: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 animate-fade-in">
        <div className="bg-slate-900 border border-slate-800 p-16 rounded-[4.5rem] shadow-premium text-center space-y-6">
           <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
           </div>
           <h2 className="text-4xl font-black text-white tracking-tighter">Anúncio Publicado!</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Seu perfil já está brilhando no marketplace.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-slate-950 border border-slate-900 p-8 md:p-16 rounded-[4.5rem] shadow-2xl relative">
        
        {/* PROGRESS BAR */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-slate-900 rounded-t-[4.5rem] overflow-hidden">
          <div 
            className="h-full bg-rose-500 transition-all duration-500 ease-out" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* STEPS RENDERING */}
        {step === 1 && (
          <div className="space-y-10 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-white tracking-tighter">Identidade</h2>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Informações básicas do perfil</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DarkInput label="Nome Artístico" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Mirella Silva" />
              <DarkInput label="WhatsApp" name="phone" value={formData.phone} onChange={handleChange} placeholder="(11) 99999-9999" />
              <DarkInput label="Idade" name="age" value={formData.age} onChange={handleChange} placeholder="Mínimo 18" type="number" />
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoria</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border-2 border-slate-800 px-6 py-5 text-slate-100 text-base rounded-2xl focus:outline-none focus:border-rose-500 focus:bg-slate-800 transition-all font-bold appearance-none"
                >
                  <option value="Mulher">Mulher</option>
                  <option value="Homem">Homem</option>
                  <option value="Homossexual">Homossexual</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Localização</label>
                 <div className="relative">
                    <input 
                      name="location_city"
                      value={formData.location_city}
                      onChange={handleChange}
                      placeholder="Ex: São Paulo"
                      className="w-full bg-slate-900 border-2 border-slate-800 px-6 py-5 text-slate-100 text-base rounded-2xl focus:outline-none focus:border-rose-500 focus:bg-slate-800 transition-all font-bold pr-14"
                    />
                    <button 
                      onClick={handleDetectLocation}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all ${isLocating ? 'animate-spin' : ''}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                    </button>
                 </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-white tracking-tighter">Bio & Atributos</h2>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Descreva seu estilo e físico</p>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tags de Perfil</label>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.about.map(tag => (
                  <button 
                    key={tag}
                    type="button"
                    onClick={() => toggleTag('aboutTags', tag)}
                    className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${formData.aboutTags.includes(tag) ? 'bg-white border-white text-slate-950 shadow-xl' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descrição do Perfil</label>
                <button 
                  type="button"
                  onClick={handleMagicBio}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl animate-pulse hover:scale-105 transition-all flex items-center gap-2 border border-white/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.477 2.387a2 2 0 00.547 1.022l1.585 1.585a2 2 0 002.828 0l1.585-1.585a2 2 0 00.547-1.022l.477-2.387a2 2 0 00-1.414-1.96l-2.387-.477a2 2 0 00-1.022.547l-1.585 1.585a2 2 0 01-2.828 0l-1.585-1.585z"/></svg>
                  ✨ Mágica com IA Safada
                </button>
              </div>
              <DarkTextArea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Clique no botão acima para uma descrição irresistível..."
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 animate-fade-in">
             <div className="space-y-2">
              <h2 className="text-5xl font-black text-white tracking-tighter">Negócios</h2>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Serviços e Valores</p>
            </div>
            <div className="space-y-8">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">O que você oferece?</label>
                  <div className="flex flex-wrap gap-2">
                    {TAG_OPTIONS.services.map(tag => (
                      <button 
                        key={tag}
                        type="button"
                        onClick={() => toggleTag('servicesTags', tag)}
                        className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${formData.servicesTags.includes(tag) ? 'bg-rose-500 border-rose-500 text-white shadow-xl' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
               </div>
               <div className="max-w-xs">
                 <DarkInput label="Investimento (R$ / Hora)" name="baseRate" value={formData.baseRate} onChange={handleChange} placeholder="Ex: 500" type="number" />
               </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-10 animate-fade-in">
            <h2 className="text-5xl font-black text-white tracking-tighter">Galeria</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {formData.photos.map((photo, i) => (
                 <div key={i} className={`relative group ${i === 0 ? 'ring-4 ring-rose-500 ring-offset-4 ring-offset-slate-950 rounded-[2.5rem]' : ''}`}>
                    <div className="aspect-[3/4.5] bg-slate-900 border-2 border-slate-800 rounded-[2.2rem] overflow-hidden relative">
                       {photo ? <img src={photo} className="w-full h-full object-cover" alt="Preview" /> : null}
                       <div className="absolute inset-x-2 bottom-2">
                          <input 
                            type="text" 
                            placeholder="URL da Imagem" 
                            value={photo}
                            onChange={(e) => handlePhotoChange(i, e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-[10px] font-bold focus:outline-none focus:border-rose-500 shadow-2xl"
                          />
                       </div>
                    </div>
                 </div>
               ))}
            </div>
            <p className="text-center text-slate-500 text-[10px] font-black uppercase tracking-widest">Dica: A primeira foto será a sua capa principal.</p>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-10 animate-fade-in">
            <h2 className="text-5xl font-black text-white tracking-tighter">Publicar</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-[3.5rem] p-10 space-y-8 shadow-2xl">
              <div className="space-y-4">
                <p className="text-[13px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                  Ao publicar, você confirma que tem mais de 18 anos e que é o titular das fotos enviadas. Seu anúncio será revisado em tempo real.
                </p>
                <label className="flex items-center gap-5 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="w-8 h-8 accent-rose-500 rounded-2xl bg-slate-800 border-slate-700 cursor-pointer" required />
                  </div>
                  <span className="text-[13px] font-black text-white uppercase tracking-widest group-hover:text-rose-500 transition-colors">Aceito os termos de uso e privacidade</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div className="flex justify-between mt-20 pt-10 border-t-2 border-slate-900">
          <button 
            type="button"
            onClick={() => step === 1 ? onCancel() : setStep(s => s - 1)}
            className="text-[12px] font-black uppercase tracking-widest transition-all text-slate-500 hover:text-white"
          >
            ← Voltar
          </button>
          {step < totalSteps ? (
            <button 
              type="button"
              onClick={() => setStep(s => s + 1)}
              className="bg-white text-slate-950 px-14 py-6 font-black text-[12px] uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-all"
            >
              Próximo Passo
            </button>
          ) : (
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="bg-rose-500 text-white px-20 py-6 font-black text-[12px] uppercase tracking-widest rounded-2xl shadow-2xl shadow-rose-500/20 disabled:opacity-50 hover:bg-rose-600 transition-all"
            >
              {isSaving ? 'Salvando...' : 'Finalizar Anúncio'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationPanel;