import { supabase } from '../lib/supabase';
import { Creator } from '../types';

export const creatorService = {
  async getAll(): Promise<Creator[]> {
    if (!supabase) {
      console.error("Supabase não inicializado. Verifique SUPABASE_URL e SUPABASE_ANON_KEY.");
      return [];
    }

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
        gender: item.gender || 'Mulher',
        age: item.age,
        phone: item.phone,
        bio: item.bio,
        avatar: item.avatar,
        location_city: item.location_city,
        location_area: item.location_area,
        location_lat: item.location_lat,
        location_lng: item.location_lng,
        baseRate: item.base_rate,
        online: item.online,
        verified: item.verified,
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

  async delete(id: string) {
    if (!supabase) throw new Error("Supabase não configurado.");
    const { error } = await supabase
      .from('creators')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async update(id: string, updates: Partial<Creator>) {
    if (!supabase) throw new Error("Supabase não configurado.");
    
    // Mapeia os campos do camelCase do frontend para o snake_case do banco
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.online !== undefined) payload.online = updates.online;
    if (updates.verified !== undefined) payload.verified = updates.verified;
    if (updates.baseRate !== undefined) payload.base_rate = updates.baseRate;
    
    const { error } = await supabase
      .from('creators')
      .update(payload)
      .eq('id', id);
      
    if (error) throw error;
  },

  async create(creatorData: Partial<Creator>) {
    if (!supabase) {
      throw new Error("O site não conseguiu ler as chaves do banco.");
    }

    const payload = {
      name: creatorData.name,
      username: `@${creatorData.name?.toLowerCase().replace(/\s/g, '_')}_${Math.floor(Math.random() * 1000)}`,
      gender: creatorData.gender,
      age: Number(creatorData.age) || 18,
      phone: creatorData.phone,
      bio: creatorData.bio,
      avatar: creatorData.avatar,
      location_city: creatorData.location_city,
      location_area: creatorData.location_area,
      location_lat: creatorData.location_lat,
      location_lng: creatorData.location_lng,
      base_rate: Number(creatorData.baseRate) || 0,
      photos: creatorData.photos || [],
      about_tags: creatorData.aboutTags || [],
      services_tags: creatorData.servicesTags || [],
      online: true,
      verified: false,
      rating: 5
    };

    const { data, error } = await supabase
      .from('creators')
      .insert([payload])
      .select();

    if (error) throw error;
    return data;
  }
};