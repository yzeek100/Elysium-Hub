
import { supabase } from '../lib/supabase';
import { Creator } from '../types';
import { MOCK_CREATORS } from '../constants';

export const creatorService = {
  async getAll(): Promise<Creator[]> {
    if (!supabase) return MOCK_CREATORS;

    try {
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) return MOCK_CREATORS;

      return data.map(item => ({
        id: item.id,
        name: item.name,
        age: item.age || 18,
        whatsapp: item.phone || '', // Mapeamento legado
        description: item.bio || '', // Mapeamento legado
        photos: item.photos || [],
        services: item.services_tags || [],
        rates: {
          hour: item.base_rate || 0,
          overnight: (item.base_rate || 0) * 4
        },
        gender: item.gender || 'Mulher',
        location_city: item.location_city || '',
        online: item.online,
        avatar: item.avatar,
        verified: item.verified,
        ratingCount: Math.floor(Math.random() * 30) + 1,
        location_lat: item.location_lat,
        location_lng: item.location_lng,
        // Mantendo legados para evitar quebras
        bio: item.bio,
        phone: item.phone,
        baseRate: item.base_rate
      }));
    } catch (e: any) {
      console.error("Erro ao buscar dados do Supabase, usando MOCK_CREATORS:", e.message);
      return MOCK_CREATORS;
    }
  },

  async delete(id: string) {
    if (!supabase) throw new Error("Supabase não configurado.");
    const { error } = await supabase.from('creators').delete().eq('id', id);
    if (error) throw error;
  },

  async update(id: string, updates: Partial<Creator>) {
    if (!supabase) throw new Error("Supabase não configurado.");
    
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.online !== undefined) payload.online = updates.online;
    if (updates.verified !== undefined) payload.verified = updates.verified;
    if (updates.baseRate !== undefined) payload.base_rate = updates.baseRate;
    
    const { error } = await supabase.from('creators').update(payload).eq('id', id);
    if (error) throw error;
  },

  async create(creatorData: Partial<Creator>) {
    if (!supabase) throw new Error("Supabase não configurado.");

    const payload = {
      name: creatorData.name,
      username: `@${creatorData.name?.toLowerCase().replace(/\s/g, '_')}_${Math.floor(Math.random() * 1000)}`,
      gender: creatorData.gender,
      age: Number(creatorData.age) || 18,
      phone: creatorData.whatsapp || creatorData.phone,
      bio: creatorData.description || creatorData.bio,
      avatar: creatorData.avatar,
      location_city: creatorData.location_city,
      location_area: creatorData.location_city,
      base_rate: Number(creatorData.baseRate) || 0,
      photos: creatorData.photos || [],
      services_tags: creatorData.services || [],
      online: true,
      verified: false,
      rating: 5
    };

    const { data, error } = await supabase.from('creators').insert([payload]).select();
    if (error) throw error;
    return data;
  }
};
