
import { createClient } from '@supabase/supabase-js';

// No Netlify/Vite, as variáveis podem estar em process.env ou import.meta.env
// Vamos tentar capturar de todas as formas possíveis
const getVar = (name: string): string => {
  try {
    // @ts-ignore
    return process.env[name] || import.meta.env[name] || window.env?.[name] || '';
  } catch (e) {
    return '';
  }
};

const url = getVar('SUPABASE_URL');
const key = getVar('SUPABASE_ANON_KEY');

export const supabase = (url && key) ? createClient(url, key) : null;

if (!supabase) {
  console.error("ELYSIUM CRITICAL: Chaves do Supabase não encontradas no ambiente.");
}
