// Helper functions for Supabase database operations with proper typing
// Use these helpers to avoid TypeScript errors when database types are incomplete

import { supabase } from './supabase';

// Helper to insert data with type safety bypass
export async function insertData(
  table: string,
  data: any | any[]
) {
  return await supabase
    .from(table)
    .insert(data as any)
    .select();
}

// Helper to update data with type safety bypass
export async function updateData(
  table: string,
  data: any,
  match: Record<string, any>
) {
  let query = supabase
    .from(table)
    .update(data as any);

  Object.entries(match).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  return await query.select();
}

// Helper to fetch data with proper typing
export async function fetchData(
  table: string,
  select = '*',
  filters?: Record<string, any>
): Promise<{ data: any[] | null; error: any }> {
  let query = supabase
    .from(table)
    .select(select);

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }

  return await query as { data: any[] | null; error: any };
}

// Helper to fetch single record
export async function fetchOne(
  table: string,
  select = '*',
  filters: Record<string, any>
): Promise<{ data: any | null; error: any }> {
  let query = supabase
    .from(table)
    .select(select);

  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  return await query.maybeSingle() as { data: any | null; error: any };
}

// Helper to delete data
export async function deleteData(
  table: string,
  match: Record<string, any>
) {
  let query = supabase
    .from(table)
    .delete();

  Object.entries(match).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  return await query;
}

// Export supabase client for direct use when needed
export { supabase };
