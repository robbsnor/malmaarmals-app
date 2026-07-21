const PAGE_SIZE = 5000;

/**
 * Fetches all rows from a Supabase query by paginating until no more data is returned.
 * @param queryFn - A function that receives `from` and `to` range indices and returns a Supabase query promise.
 * @returns An object containing all rows combined from every page and any error.
 * @example
 * const { data: messages, error } = await fetchAll((from, to) =>
 *     supabase.from('messages').select('*').eq('video_id', id).range(from, to)
 * );
 */
export async function fetchAll<T>(
    queryFn: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>
): Promise<{ data: T[]; error: unknown }> {
    const allRows: T[] = [];
    let from = 0;

    while (true) {
        const { data, error } = await queryFn(from, from + PAGE_SIZE - 1);

        if (error) return { data: allRows, error };
        if (!data || data.length === 0) break;

        allRows.push(...data);

        if (data.length < PAGE_SIZE) break;
        from += PAGE_SIZE;
    }

    return { data: allRows, error: null };
}
