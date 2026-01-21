
import { supabase } from '../lib/supabase';
import { Creator } from '../types';

export const creatorService = {
  async getAll(): Promise<Creator[]> {
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return data.map(item => ({
        id: item.id,
        name: item.name,
        username: item.username,
        age: item.age,
        phone: item.phone,
        bio: item.bio,
        avatar: item.avatar,
        location_city: item.location_city,
        location_area: item.location_area,
        baseRate: item.base_rate,
        online: item.online,
        photos: item.photos || [],
        aboutTags: item.about_tags || [],
        servicesTags: item.services_tags || [],
        rating: item.rating || 5,
        ratingCount: Math.floor(Math.random() * 30) + 1,
      }));
    } catch (e: any) {
      console.error("Erro ao buscar dados:", e.message);
      return [];
    }
  },

  async create(creatorData: Partial<Creator>) {
    if (!supabase) {
      throw new Error("As chaves do banco de dados não foram detectadas. Certifique-se de adicioná-las no painel do Netlify e fazer um NOVO DEPLOY.");
    }

    const payload = {
      name: creatorData.name,
      username: `@${creatorData.name?.toLowerCase().replace(/\s/g, '_')}_${Math.floor(Math.random() * 1000)}`,
      age: Number(creatorData.age) || 18,
      phone: creatorData.phone,
      bio: creatorData.bio,
      avatar: creatorData.avatar,
      location_city: creatorData.location_city,
      location_area: creatorData.location_area,
      base_rate: Number(creatorData.baseRate) || 0,
      photos: creatorData.photos || [],
      about_tags: creatorData.aboutTags || [],
      services_tags: creatorData.servicesTags || [],
      online: true,
      rating: 5
    };

    const { data, error } = await supabase
      .from('creators')
      .insert([payload])
      .select();

    if (error) {
      if (error.code === '42P01') {
        throw new Error("A tabela 'creators' não existe no banco. Vá no Supabase > SQL Editor e execute o comando de criação.");
      }
      throw error;
    }
    return data;
  }
};
