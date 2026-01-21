
import { createClient } from '@supabase/supabase-js';

// Acesso estático às variáveis. Isso permite que o Netlify/Vite 
// substitua o texto process.env.VAR pelo valor real durante o build.

let supabaseUrl = '';
let supabaseAnonKey = '';

try {
  // 1. Tenta via process.env (Padrão para injetar no build)
  // @ts-ignore
  supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  // @ts-ignore
  supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

  // 2. Tenta via import.meta.env (Padrão Vite ESM)
  if (!supabaseUrl || !supabaseAnonKey) {
    const metaEnv = (import.meta as any).env;
    if (metaEnv) {
      supabaseUrl = supabaseUrl || metaEnv.VITE_SUPABASE_URL || metaEnv.SUPABASE_URL || '';
      supabaseAnonKey = supabaseAnonKey || metaEnv.VITE_SUPABASE_ANON_KEY || metaEnv.SUPABASE_ANON_KEY || '';
    }
  }

  // 3. Fallback para window.env (Caso de injeção externa)
  if (!supabaseUrl || !supabaseAnonKey) {
    const anyWindow = window as any;
    if (anyWindow.env) {
      supabaseUrl = supabaseUrl || anyWindow.env.VITE_SUPABASE_URL || anyWindow.env.SUPABASE_URL || '';
      supabaseAnonKey = supabaseAnonKey || anyWindow.env.VITE_SUPABASE_ANON_KEY || anyWindow.env.SUPABASE_ANON_KEY || '';
    }
  }
} catch (e) {
  console.warn("Erro ao ler variáveis de ambiente:", e);
}

// Limpeza e validação
supabaseUrl = supabaseUrl.trim();
supabaseAnonKey = supabaseAnonKey.trim();

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  console.error(
    "ELYSIUM CRITICAL: Chaves do Supabase não encontradas. " +
    "Atenção: Se você já configurou no Netlify, você DEVE ir em 'Deploys' -> 'Trigger Deploy' -> 'Clear cache and deploy site' " +
    "para que as novas variáveis sejam injetadas no seu site."
  );
}
