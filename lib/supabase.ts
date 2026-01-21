
import { createClient } from '@supabase/supabase-js';

/**
 * IMPORTANTE: Em ambientes de produção como Netlify/Vite, as variáveis de ambiente
 * devem ser acessadas de forma ESTÁTICA (ex: process.env.NOME_DA_VAR).
 * O uso de colchetes dinâmicos [name] falha porque o compilador não consegue
 * realizar a substituição de texto durante o build.
 */

let supabaseUrl = '';
let supabaseAnonKey = '';

try {
  // Tentativa 1: Acesso via process.env (Padrão em muitos ambientes injetados)
  // @ts-ignore
  supabaseUrl = (typeof process !== 'undefined' && process.env) 
    ? (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL) 
    : '';
  
  // @ts-ignore
  supabaseAnonKey = (typeof process !== 'undefined' && process.env) 
    ? (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY) 
    : '';

  // Tentativa 2: Fallback para import.meta.env (Padrão Vite/ESM moderno)
  if (!supabaseUrl || !supabaseAnonKey) {
    const anyMeta = import.meta as any;
    if (anyMeta?.env) {
      supabaseUrl = supabaseUrl || anyMeta.env.VITE_SUPABASE_URL || anyMeta.env.SUPABASE_URL;
      supabaseAnonKey = supabaseAnonKey || anyMeta.env.VITE_SUPABASE_ANON_KEY || anyMeta.env.SUPABASE_ANON_KEY;
    }
  }

  // Tentativa 3: Fallback para objeto global window (Injeção manual)
  if (!supabaseUrl || !supabaseAnonKey) {
    const anyWindow = window as any;
    if (anyWindow?.env) {
      supabaseUrl = supabaseUrl || anyWindow.env.VITE_SUPABASE_URL || anyWindow.env.SUPABASE_URL;
      supabaseAnonKey = supabaseAnonKey || anyWindow.env.VITE_SUPABASE_ANON_KEY || anyWindow.env.SUPABASE_ANON_KEY;
    }
  }
} catch (e) {
  console.warn("Erro ao tentar ler variáveis de ambiente:", e);
}

// Limpeza de espaços em branco acidentais
supabaseUrl = supabaseUrl?.trim() || '';
supabaseAnonKey = supabaseAnonKey?.trim() || '';

// Inicialização do cliente
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  console.error(
    "ELYSIUM CRITICAL: Chaves do Supabase não detectadas no código. " +
    "Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão no Netlify " +
    "e que você clicou em 'Trigger Deploy' após salvar as variáveis."
  );
}
