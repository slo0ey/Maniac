/* eslint-disable @typescript-eslint/no-explicit-any */
import LRUCache from 'lru-cache';

import Entity from '../../api/entity.js';

export const CachedEntity = {
  Read: function <V extends Entity>(cache: LRUCache<string, V>) {
    return function (
      target: any,
      prop: string,
      descriptor: TypedPropertyDescriptor<(k: string, ...args: any[]) => Promise<V | null>>,
    ) {
      const originFunc = descriptor.value!;
      descriptor.value = async function (k: string, ...args: any[]): Promise<V | null> {
        let result;
        if (!cache.has(k)) {
          result = await originFunc.apply(this, [k, ...args]);
          if (result !== null) cache.set(k, result);
        } else {
          result = cache.get(k)!;
        }
        return result;
      };
    };
  },
  Insert: function <V extends Entity>(cache: LRUCache<string, V>) {
    return function (
      target: any,
      prop: string,
      descriptor: TypedPropertyDescriptor<(v: V, ...args: any[]) => Promise<void>>,
    ) {
      const originFunc = descriptor.value!;
      descriptor.value = async function (v: V, ...args: any[]): Promise<void> {
        await originFunc.apply(this, [v, ...args]);
        cache.set(v.id, v);
      };
    };
  },
  Update: function <V extends Entity>(cache: LRUCache<string, V>) {
    return function (
      target: any,
      prop: string,
      descriptor: TypedPropertyDescriptor<(v: V, ...args: any[]) => Promise<void>>,
    ) {
      const originFunc = descriptor.value!;
      descriptor.value = async function (v: V, ...args: any[]) {
        await originFunc.apply(this, [v, ...args]);
        cache.set(v.id, v);
      };
    };
  },
  Delete: function <V extends Entity>(cache: LRUCache<string, V>) {
    return function (
      target: any,
      prop: string,
      descriptor: TypedPropertyDescriptor<(v: V, ...args: any[]) => Promise<void>>,
    ) {
      const originFunc = descriptor.value!;
      descriptor.value = async function (v: V, ...args: any[]) {
        await originFunc.apply(this, [v, ...args]);
        cache.delete(v.id);
      };
    };
  },
};

export const CachedValue = {
  Read: function <K, V>(cache: LRUCache<K, V>) {
    return function (
      target: any,
      prop: string,
      descriptor: TypedPropertyDescriptor<(k: K, ...args: any[]) => Promise<V>>,
    ) {
      const originFunc = descriptor.value!;
      descriptor.value = async function (k: K, ...args: any[]): Promise<V> {
        let result;
        if (!cache.has(k)) {
          result = await originFunc.apply(this, [k, ...args]);
          if (result !== null) cache.set(k, result);
        } else {
          result = cache.get(k)!;
        }
        return result;
      };
    };
  },
  Insert: function <K, V>(cache: LRUCache<K, V>) {
    return function (
      target: any,
      prop: string,
      descriptor: TypedPropertyDescriptor<(k: K, v: V, ...args: any[]) => Promise<void>>,
    ) {
      const originFunc = descriptor.value!;
      descriptor.value = async function (k: K, v: V, ...args: any[]): Promise<void> {
        await originFunc.apply(this, [k, v, ...args]);
        cache.set(k, v);
      };
    };
  },
  Update: function <K, V>(cache: LRUCache<K, V>) {
    return function (
      target: any,
      prop: string,
      descriptor: TypedPropertyDescriptor<(k: K, v: V, ...args: any[]) => Promise<void>>,
    ) {
      const originFunc = descriptor.value!;
      descriptor.value = async function (k: K, v: V, ...args: any[]) {
        await originFunc.apply(this, [k, v, ...args]);
        cache.set(k, v);
      };
    };
  },
  Delete: function <K, V>(cache: LRUCache<K, V>) {
    return function (
      target: any,
      prop: string,
      descriptor: TypedPropertyDescriptor<(k: K, v: V, ...args: any[]) => Promise<void>>,
    ) {
      const originFunc = descriptor.value!;
      descriptor.value = async function (k: K, v: V, ...args: any[]) {
        await originFunc.apply(this, [k, v, ...args]);
        cache.delete(k);
      };
    };
  },
};
