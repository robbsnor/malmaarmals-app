import { supabaseServerClient } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
    const supabase = supabaseServerClient();

    const { data, error } = await supabase.storage.from("thumbnails").list();
    console.log(data, error);
    return "2";
    // if (error) {
    //     return { error: error.message }
    // }

    // return { data }
});
