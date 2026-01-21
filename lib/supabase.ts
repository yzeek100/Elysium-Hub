
import { createClient } from '@supabase/supabase-js';

// Função auxiliar para buscar variáveis em diferentes lugares possíveis (process.env ou window)
const getEnv = (key: string): string => {
  // 1. Tenta process.env (padrão Node/Bundlers)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  // 2. Tenta window.env (comum em alguns ambientes de preview)
  if (typeof window !== 'undefined' && (window as any).env && (window as any).env[key]) {
    return (window as any).env[key];
  }
  return '';
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');

// Só inicializa se tivermos os valores mínimos
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  console.error("ELYSIUM: Falha ao carregar chaves do Supabase. Verifique se as variáveis SUPABASE_URL e SUPABASE_ANON_KEY estão configuradas no Netlify.");
}

/* 
  SQL PARA CRIAR A TABELA (Execute no 'SQL Editor' do Supabase):

  CREATE TABLE IF NOT EXISTS creators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    username TEXT UNIQUE,
    age INTEGER,
    phone TEXT,
    bio TEXT,
    avatar TEXT,
    location_city TEXT,
    location_area TEXT,
    base_rate INTEGER,
    photos TEXT[] DEFAULT '{}',
    about_tags TEXT[] DEFAULT '{}',
    services_tags TEXT[] DEFAULT '{}',
    online BOOLEAN DEFAULT TRUE,
    rating INTEGER DEFAULT 5
  );

  ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Public Read" ON creators FOR SELECT USING (true);
  CREATE POLICY "Public Insert" ON creators FOR INSERT WITH CHECK (true);
*/
