
import { createClient } from '@supabase/supabase-js';

/**
 * Função para capturar variáveis de ambiente de forma resiliente em navegadores.
 * Prioriza o prefixo VITE_ exigido pela maioria dos bundlers modernos para segurança.
 */
const getEnvVar = (name: string): string => {
  const viteName = `VITE_${name}`;
  
  try {
    // 1. Tenta via import.meta.env (Padrão Vite/Modern ESM)
    const anyMeta = import.meta as any;
    if (anyMeta?.env) {
      if (anyMeta.env[viteName]) return anyMeta.env[viteName];
      if (anyMeta.env[name]) return anyMeta.env[name];
    }
    
    // 2. Tenta via process.env (Fallback para ambientes build-time ou shims)
    if (typeof process !== 'undefined' && process.env) {
      if (process.env[viteName]) return process.env[viteName] as string;
      if (process.env[name]) return process.env[name] as string;
    }

    // 3. Tenta via objeto global window (Injeção manual ou scripts externos)
    const anyWindow = window as any;
    if (anyWindow?.env) {
      if (anyWindow.env[viteName]) return anyWindow.env[viteName];
      if (anyWindow.env[name]) return anyWindow.env[name];
    }
  } catch (e) {
    // Silencioso para não poluir o console se o acesso falharr
  }
  
  return '';
};

const supabaseUrl = getEnvVar('SUPABASE_URL');
const supabaseAnonKey = getEnvVar('SUPABASE_ANON_KEY');

// Só inicializa o cliente se ambas as chaves estiverem presentes
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  const missing = [];
  if (!supabaseUrl) missing.push("VITE_SUPABASE_URL");
  if (!supabaseAnonKey) missing.push("VITE_SUPABASE_ANON_KEY");
  
  console.error(
    `ELYSIUM CRITICAL: Variáveis ausentes: ${missing.join(', ')}. ` +
    "No Netlify, configure-as em Site Settings > Environment Variables e faça um novo Deploy."
  );
}
