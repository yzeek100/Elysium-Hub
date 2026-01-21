
import { GoogleGenAI } from "@google/genai";

export const aiService = {
  generateBio: async (name: string, tags: string[], age: string) => {
    // Guideline: The API key must be obtained exclusively from the environment variable process.env.API_KEY.
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.warn("API_KEY não encontrada. Usando bio padrão.");
      return `Olá! Sou ${name}, tenho ${age} anos e estou ansiosa para te conhecer. Confira meus serviços!`;
    }

    try {
      // Guideline: Use this process.env.API_KEY string directly when initializing the @google/genai client instance.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Guideline: Use ai.models.generateContent to query GenAI with both the model name and prompt.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Escreva uma biografia curta, sedutora e elegante para um perfil de acompanhante premium. 
        Nome: ${name}, Idade: ${age}, Características: ${tags.join(', ')}. 
        Escreva em primeira pessoa, de forma profissional mas envolvente. Máximo 3 linhas.`,
      });

      // Guideline: Access the .text property (not a method) directly from the response.
      return response.text || `Olá! Sou ${name}, prazer em te conhecer.`;
    } catch (error) {
      console.error("Erro na IA:", error);
      return `Olá! Sou ${name}, confira meu perfil e entre em contato!`;
    }
  }
};
