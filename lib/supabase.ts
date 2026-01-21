
import { createClient } from '@supabase/supabase-js';

// Acesso às variáveis de ambiente de forma compatível com Vite/Netlify
const SUPABASE_URL = 
  // @ts-ignore
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 
  // @ts-ignore
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || 
  '';

const SUPABASE_ANON_KEY = 
  // @ts-ignore
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 
  // @ts-ignore
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || 
  '';

const cleanUrl = SUPABASE_URL.trim();
const cleanKey = SUPABASE_ANON_KEY.trim();

// Exporta o cliente. Se não houver chaves, será null, mas sem disparar alertas fatais.
export const supabase = (cleanUrl && cleanKey) 
  ? createClient(cleanUrl, cleanKey) 
  : null;
