import LRUCache from 'lru-cache';

export default <K, V>(capacity: number, ttl: number) => {
  return new LRUCache<K, V>({
    max: capacity,
    ttl: ttl,
    noDisposeOnSet: true,
    updateAgeOnGet: true,
  });
};
