
export enum ServiceType {
  VIDEO_CALL = 'Videochamada Privada',
  DIGITAL_CONTENT = 'Conteúdo Digital',
  TIP = 'Gorjeta',
  RESERVED_TIME = 'Sessão Exclusiva'
}

export type GenderCategory = 'Mulher' | 'Homem' | 'Homossexual';

export interface Creator {
  id: string;
  name: string;
  age: number;
  whatsapp: string;
  description: string;
  photos: string[];
  services: string[];
  rates: { 
    hour: number; 
    overnight: number; 
  };
  gender: GenderCategory;
  location_city: string;
  online: boolean;
  avatar: string;
  verified?: boolean;
  ratingCount?: number;
  location_lat?: number;
  location_lng?: number;
  // CamposLegado para compatibilidade com o banco
  bio?: string;
  phone?: string;
  baseRate?: number;
}

export interface NavState {
  view: 'home' | 'marketplace' | 'dashboard' | 'profile' | 'registration' | 'admin';
  selectedCreatorId?: string;
}