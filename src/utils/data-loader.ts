export async function dataLoader<T>(
  TAKE: number,
  cursor: string,
  _fetch: (cursor?: string) => Promise<{ cursor: string; data: T[] }>,
) {
  let _cursor = cursor || "";
  let stop = false;
  let records: T[] = [];
  do {
    const { data, cursor } = await _fetch(_cursor);
    if (data?.length) {
      records = records.concat(data);
      _cursor = cursor || "";
    }
    stop = data.length < TAKE;
  } while (!stop);
  return { data: records, cursor: _cursor };
}
