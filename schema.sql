
-- 1. Criar a tabela de Criadores (Acompanhantes)
CREATE TABLE IF NOT EXISTS public.creators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    gender TEXT CHECK (gender IN ('Mulher', 'Homem', 'Homossexual')),
    age INTEGER NOT NULL,
    phone TEXT, -- Usado como WhatsApp no app
    bio TEXT,   -- Usado como Descrição no app
    avatar TEXT,
    location_city TEXT,
    location_area TEXT,
    base_rate NUMERIC DEFAULT 0,
    photos TEXT[] DEFAULT '{}',
    services_tags TEXT[] DEFAULT '{}',
    online BOOLEAN DEFAULT true,
    verified BOOLEAN DEFAULT false,
    rating NUMERIC DEFAULT 5.0,
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION
);

-- 2. Habilitar o Row Level Security (RLS)
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;

-- 3. Criar Políticas de Acesso
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Acesso público para leitura') THEN
        CREATE POLICY "Acesso público para leitura" ON public.creators FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permitir inserção pública') THEN
        CREATE POLICY "Permitir inserção pública" ON public.creators FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permitir delete público') THEN
        CREATE POLICY "Permitir delete público" ON public.creators FOR DELETE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permitir update público') THEN
        CREATE POLICY "Permitir update público" ON public.creators FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END $$;

-- 4. Criar índices para busca performática
CREATE INDEX IF NOT EXISTS idx_creators_city ON public.creators(location_city);
CREATE INDEX IF NOT EXISTS idx_creators_gender ON public.creators(gender);
CREATE INDEX IF NOT EXISTS idx_creators_online ON public.creators(online);

-- 5. Carga de Dados Fictícios (Marketplace Manaus)
INSERT INTO public.creators 
(name, username, gender, age, phone, bio, avatar, location_city, location_area, base_rate, photos, services_tags, verified, online)
VALUES
('Valentina', 'valentina_vip', 'Mulher', 21, '5592988123456', 'A loira dos seus sonhos em Manaus. Educada, discreta e pronta para momentos intensos.', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000', 'Manaus', 'Ponta Negra', 350, '{"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000","https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1000"}', '{"Oral", "G-String", "Massagem"}', true, true),

('Isabella', 'isa_adrianopolis', 'Mulher', 24, '5592988223344', 'Morena iluminada e elegante. Se você busca classe e uma pegada inesquecível, me chame.', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000', 'Manaus', 'Adrianópolis', 500, '{"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000","https://images.unsplash.com/photo-1512413911163-384013401768?q=80&w=1000"}', '{"Fetiche", "Dominação", "Jantar"}', true, true),

('Gabriela', 'gabi_ruiva', 'Mulher', 28, '5592988334455', 'Ruiva natural decidida. Experiência premium para quem valoriza atenção aos detalhes.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000', 'Manaus', 'Vieiralves', 400, '{"https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000","https://images.unsplash.com/photo-1534751511112-0d1197818df1?q=80&w=1000"}', '{"Oral", "Anal", "Fantasias"}', true, true),

('Julia', 'ju_tatuada', 'Mulher', 19, '5592988445566', 'Novinha tatuada, carinha de anjo e mente perigosa. Estilo namoradinha safada.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000', 'Manaus', 'Parque 10', 250, '{"https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000","https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000"}', '{"Beijo na boca", "Inversão", "Fio terra"}', false, true),

('Beatriz', 'bia_fitness', 'Mulher', 22, '5592988556677', 'Corpo atlético e viciada em prazer. Atendo em local próprio com total discrição.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000', 'Manaus', 'Alvorada', 300, '{"https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000","https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=1000"}', '{"Espanhola", "69", "Chuva de Prata"}', true, true),

('Mariana', 'mari_madura', 'Mulher', 31, '5592988667788', 'Madura, curvilínea e cheia de experiências. Deixe suas fantasias nas minhas mãos.', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000', 'Manaus', 'Dom Pedro', 450, '{"https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000","https://images.unsplash.com/photo-1491349174775-aaafddd81942?q=80&w=1000"}', '{"Anal", "Pompoarismo", "Duplex"}', true, true),

('Larissa', 'lari_canela', 'Mulher', 25, '5592988778899', 'Morena pele canela, cheirosinha e dedicada. O seu prazer é meu único compromisso.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000', 'Manaus', 'Tarumã', 320, '{"https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000","https://images.unsplash.com/photo-1542103749-8ef59b94f47e?q=80&w=1000"}', '{"GFE", "Oral", "Cunnilingus"}', true, true),

('Fernanda', 'fer_executiva', 'Mulher', 29, '5592988889900', 'Elegante de dia, sua melhor companhia à noite. Discreta e focada em resultados.', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=1000', 'Manaus', 'Aleixo', 600, '{"https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=1000","https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=1000"}', '{"Eventos", "Jantar", "Fantasias"}', false, true),

('Camila', 'mila_power', 'Mulher', 23, '5592988990011', 'Fitness, muita energia e zero tabus. Vamos explorar seus limites hoje?', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000', 'Manaus', 'Flores', 380, '{"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000","https://images.unsplash.com/photo-1481824429379-07aa5e5b0739?q=80&w=1000"}', '{"Massagem", "69", "Chuveirada"}', true, true),

('Amanda', 'amanda_japiim', 'Mulher', 35, '5592988001122', 'Experiente e sem frescuras. Faço tudo o que você imaginar. Me chame e surpreenda-se.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000', 'Manaus', 'Japiim', 400, '{"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000","https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000"}', '{"Fetiche", "Inversão", "Pompoarismo"}', true, true)
ON CONFLICT (username) DO NOTHING;
