/* eslint-disable @typescript-eslint/no-explicit-any */
import LRUCache from 'lru-cache';

import Entity from '../../api/entity.js';

export default {
  Read: function read<V extends Entity>(cache: LRUCache<string, V>) {
    return function (
      target: any,
      prop: string,
      descriptor: TypedPropertyDescriptor<(k: string, ...args: any[]) => Promise<V>>,
    ) {
      const originFunc = descriptor.value!!;
      descriptor.value = async function (k: string, ...args: any[]): Promise<V> {
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
  },
  Insert: function insert<V extends Entity>(cache: LRUCache<string, V>) {
    return function (
      target: any,
      prop: string,
      descriptor: TypedPropertyDescriptor<(v: V, ...args: any[]) => Promise<void>>,
    ) {
      const originFunc = descriptor.value!!;
      descriptor.value = async function (v: V, ...args: any[]): Promise<void> {
        await originFunc.apply(this, [v, ...args]);
        cache.set(v.id, v);
      };
    };
  },
  Update: function update<V extends Entity>(cache: LRUCache<string, V>) {
    return function (
      target: any,
      prop: string,
      descriptor: TypedPropertyDescriptor<
        (v: Partial<V>, isPartial: boolean, ...args: any[]) => Promise<void>
      >,
    ) {
      const originFunc = descriptor.value!!;
    };
  },
  Delete: function update<V extends Entity>(cache: LRUCache<string, V>) {
    return function (
      target: any,
      prop: string,
      descriptor: TypedPropertyDescriptor<(v: V, ...args: any[]) => Promise<void>>,
    ) {
      const originFunc = descriptor.value!!;
    };
  },
};
