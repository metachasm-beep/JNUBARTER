import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pbfkvjosccsyuzeorerd.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_nDAah3p2VXvsQmOHpjI0wQ_2ccc5EiF';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
