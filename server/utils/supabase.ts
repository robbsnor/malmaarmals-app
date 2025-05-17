// server/utils/supabase-server.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Never expose this to client

export const supabaseServerClient = () => {
    console.log('supabaseUrl', supabaseUrl)
    console.log('supabaseServiceRoleKey', supabaseServiceRoleKey)
    return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}
