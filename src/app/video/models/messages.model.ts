import type { QueryData } from '@supabase/supabase-js';
import { supabase } from '../../../supabase';

export const messagesQuery = supabase
    .from('messages')
    .select('message_id, offset_sec, text, user_color, user_name, user_id');

export type Messages = QueryData<typeof messagesQuery>;
export type Message = Messages[number];
