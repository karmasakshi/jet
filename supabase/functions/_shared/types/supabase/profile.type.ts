import { Database } from './database.type.ts';

export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
