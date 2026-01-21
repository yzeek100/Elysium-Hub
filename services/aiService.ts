
import { GoogleGenAI } from "@google/genai";

const getEnv = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  if (typeof window !== 'undefined' && (window as any).env && (window as any).env[key]) {
    return (window as any).env[key];
  }
  return '';
};

export const aiService = {
  generateBio: async (name: string, tags: string[], age: string) => {
    // A chave DEVE vir de process.env.API_KEY conforme as regras
    const apiKey = getEnv('API_KEY');
    
    if (!apiKey) {
      return `Olá! Sou ${name}, tenho ${age} anos e estou ansiosa para te conhecer. Confira meus serviços!`;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Escreva uma biografia curta, sedutora e elegante para um perfil de acompanhante premium. 
        Nome: ${name}, Idade: ${age}, Características: ${tags.join(', ')}. 
        Escreva em primeira pessoa, de forma profissional mas envolvente. Máximo 3 linhas.`,
      });

      return response.text || `Olá! Sou ${name}, prazer em te conhecer.`;
    } catch (error) {
      console.error("Erro na IA:", error);
      return `Olá! Sou ${name}, confira meu perfil e entre em contato!`;
    }
  }
};
