
import { GoogleGenAI } from "@google/genai";

export const aiService = {
  generateBio: async (name: string, tags: string[], age: string) => {
    // Utiliza estritamente process.env.API_KEY conforme diretrizes
    const apiKey = process.env.API_KEY;
    
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
