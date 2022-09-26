/* eslint-disable @typescript-eslint/no-explicit-any */
import LRUCache from 'lru-cache';

export default function <K, V>(cache: LRUCache<K, V>) {
  return function (
    target: any,
    prop: string,
    descriptor: TypedPropertyDescriptor<(k: K, ...args: any[]) => Promise<V | null>>,
  ) {
    const originFunc = descriptor.value!!;
    descriptor.value = async function (k: K, ...args: any[]): Promise<V | null> {
      let result;
      if (!cache.has(k)) {
        result = await originFunc.apply(this, [k, ...args]);
        if (result !== null) cache.set(k, result);
      } else {
        result = cache.get(k)!!;
      }
      return result;
    };
  };
}
