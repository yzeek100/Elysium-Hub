
import { createClient } from '@supabase/supabase-js';

/**
 * IMPORTANTE: Em ambientes de produção (Vite/Netlify), as variáveis de ambiente 
 * DEVEM ser acessadas de forma literal (ex: import.meta.env.VITE_VAR).
 * Acesso dinâmico como import.meta.env[key] NÃO funciona no build final.
 */

const getSupabaseConfig = () => {
  // 1. Tenta acesso literal via Vite (Padrão para Netlify Moderno)
  // @ts-ignore
  let url = import.meta.env?.VITE_SUPABASE_URL;
  // @ts-ignore
  let key = import.meta.env?.VITE_SUPABASE_ANON_KEY;

  // 2. Fallback: Tenta acesso literal via process.env (Padrão Node/Webpack/Netlify Build)
  if (!url || !key) {
    try {
      // @ts-ignore
      url = url || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL : undefined);
      // @ts-ignore
      key = key || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY : undefined);
    } catch (e) {
      // Ignora erro se process não estiver definido
    }
  }

  return {
    url: (url || '').trim(),
    key: (key || '').trim()
  };
};

const config = getSupabaseConfig();

// Inicialização do cliente apenas se as chaves existirem
export const supabase = (config.url && config.key) 
  ? createClient(config.url, config.key) 
  : null;

// Log de erro aprimorado para diagnóstico
if (!supabase) {
  console.error(
    "ELYSIUM HUB ERROR: Chaves do Supabase ausentes no ambiente.\n" +
    "Solução:\n" +
    "1. No Netlify: Vá em 'Site Settings' > 'Environment Variables'\n" +
    "2. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_AN