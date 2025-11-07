import type { QueryData } from '@supabase/supabase-js';
import { supabase } from '../../../supabase';

const messagesQuery = supabase
    .from('messages')
    .select('*')
    .select('message_id, offset_sec, text, user_color, user_name')
    .order('offset_sec', { ascending: true });

export type Messages = QueryData<typeof messagesQuery>;
export type Message = Messages[number];
