
import React, { useState } from 'react';
import { creatorService } from '../services/creatorService';
import { aiService } from '../services/aiService';

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

const RegistrationPanel: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    location_city: '',
    location_area: '',
    bio: '',
    baseRate: '',
    photos: ['', '', '', ''],
    aboutTags: [] as string[],
    servicesTags: [] as string[],
  });

  const totalSteps = 5;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAiBio = async () => {
    if (!formData.name || formData.aboutTags.length === 0) {
      alert("Preencha o nome e selecione alguns atributos antes de usar a IA.");
      return;
    }
    setIsGeneratingBio(true);
    const generated = await aiService.generateBio(formData.name, formData.aboutTags, formData.age);
    if (generated) {
      setFormData(prev => ({ ...prev, bio: generated.trim() }));
    }
    setIsGeneratingBio(false);
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
            location_area: 'Bela Vista'
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
      alert(`Erro ao salvar no banco: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const InputField = ({ label, name, placeholder, type = "text" }: { label: string, name: string, placeholder: string, type?: string }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <input 
        name={name}
        type={type} 
        value={(formData as any)[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 text-slate-900 text-sm rounded-2xl focus:outline-none focus:border-[#F13E5A] focus:bg-white transition-all font-bold"
      />
    </div>
  );

  if (showSuccess) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 animate-in zoom-in duration-500">
        <div className="bg-white border border-slate-100 p-16 rounded-[4.5rem] shadow-premium text-center space-y-6">
           <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl">
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
           </div>
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Perfil Publicado!</h2>
           <p className="text-slate-500 font-bold">Seu anúncio já está disponível para o Brasil inteiro.</p>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Identidade</h2>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-tight">Comece com seus dados básicos.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Nome Artístico" name="name" placeholder="Ex: Mirella Silva" />
              <InputField label="WhatsApp" name="phone" placeholder="(11) 99999-9999" />
              <InputField label="Idade" name="age" placeholder="Mínimo 18" type="number" />
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cidade</label>
                 <div className="relative">
                    <input 
                      name="location_city"
                      value={formData.location_city}
                      onChange={handleChange}
                      placeholder="Ex: São Paulo"
                      className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 text-slate-900 text-sm rounded-2xl focus:outline-none focus:border-[#F13E5A] focus:bg-white transition-all font-bold pr-14"
                    />
                    <button 
                      onClick={handleDetectLocation}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[#F13E5A] hover:bg-rose-50 rounded-xl transition-all ${isLocating ? 'animate-spin' : ''}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                    </button>
                 </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Sobre você</h2>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-tight">Selecione seus atributos físicos.</p>
            </div>
            
            <div className="space-y-6">
               <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.about.map(tag => (
                    <button 
                      key={tag}
                      type="button"
                      onClick={() => toggleTag('aboutTags', tag)}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${formData.aboutTags.includes(tag) ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                    >
                      {tag}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sua Bio Profissional</label>
                <button 
                  type="button"
                  onClick={handleAiBio}
                  disabled={isGeneratingBio}
                  className="bg-gradient-to-r from-purple-600 to-rose-500 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <svg className={`w-3 h-3 ${isGeneratingBio ? 'animate-spin' : ''}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L14.5 9H22L16 14L18.5 21L12 17L5.5 21L8 14L2 9H9.5L12 2Z"/></svg>
                  {isGeneratingBio ? 'Gerando...' : 'Mágica com IA'}
                </button>
              </div>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full h-32 bg-slate-50 border-2 border-slate-100 px-5 py-5 text-slate-900 text-sm rounded-2xl focus:outline-none focus:border-[#F13E5A] focus:bg-white transition-all font-bold"
                placeholder="Clique no botão acima para deixar nossa IA escrever por você..."
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
             <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Negócios</h2>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-tight">O que você oferece.</p>
            </div>
            <div className="space-y-8">
               <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.services.map(tag => (
                    <button 
                      key={tag}
                      type="button"
                      onClick={() => toggleTag('servicesTags', tag)}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${formData.servicesTags.includes(tag) ? 'bg-[#F13E5A] border-[#F13E5A] text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                    >
                      {tag}
                    </button>
                  ))}
               </div>
               <div className="max-w-xs">
                 <InputField label="Investimento (R$ / Hora)" name="baseRate" placeholder="Ex: 500" type="number" />
               </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Galeria</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {formData.photos.map((photo, i) => (
                 <div key={i} className={`relative group ${i === 0 ? 'ring-4 ring-[#F13E5A] ring-offset-4 rounded-[2.5rem]' : ''}`}>
                    <div className="aspect-[3/4.5] bg-slate-50 border-2 border-slate-100 rounded-[2.2rem] overflow-hidden relative">
                       {photo ? <img src={photo} className="w-full h-full object-cover" alt="Preview" /> : null}
                       <div className="absolute inset-x-2 bottom-2">
                          <input 
                            type="text" 
                            placeholder="Link da Foto" 
                            value={photo}
                            onChange={(e) => handlePhotoChange(i, e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold focus:outline-none shadow-lg"
                          />
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Publicar</h2>
            <div className="bg-slate-950 rounded-[3.5rem] p-10 space-y-8 shadow-2xl">
              <p className="text-[13px] text-slate-400 font-bold uppercase tracking-widest">
                SEU PERFIL SERÁ REVISADO E PUBLICADO IMEDIATAMENTE.
              </p>
              <label className="flex items-center gap-5 cursor-pointer">
                <input type="checkbox" className="w-8 h-8 accent-[#F13E5A] rounded-2xl" required />
                <span className="text-[13px] font-black text-white uppercase tracking-widest">Aceito os termos de uso</span>
              </label>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white border border-slate-100 p-8 md:p-16 rounded-[4.5rem] shadow-premium relative">
        {renderStep()}
        <div className="flex justify-between mt-20 pt-10 border-t-2 border-slate-50">
          <button 
            type="button"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1}
            className={`text-[12px] font-black uppercase tracking-widest ${step === 1 ? 'opacity-20' : ''}`}
          >
            Voltar
          </button>
          {step < totalSteps ? (
            <button 
              type="button"
              onClick={() => setStep(s => s + 1)}
              className="bg-slate-900 text-white px-12 py-5 font-black text-[12px] uppercase tracking-widest rounded-2xl"
            >
              Próximo
            </button>
          ) : (
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="bg-[#F13E5A] text-white px-16 py-5 font-black text-[12px] uppercase tracking-widest rounded-2xl shadow-xl disabled:opacity-50"
            >
              {isSaving ? 'Salvando...' : 'Finalizar e Publicar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationPanel;
