import type { QueryData } from '@supabase/supabase-js';
import { supabase } from '../../../supabase';

export const messagesQueryStringSelect = 'message_id, offset_sec, text, user_color, user_name, user_id';

const messagesQuery = supabase.from('messages').select(messagesQueryStringSelect);

export type Messages = QueryData<typeof messagesQuery>;
export type Message = Messages[number];
