import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
	const client = await serverSupabaseClient(event);

	const buckets = await client.storage.from("thumbnails").list();

	return buckets;
});
