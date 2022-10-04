import { Firestore, CollectionReference, DocumentData } from 'firebase-admin/firestore';
import LRUCache from 'lru-cache';
import { Inject, Service } from 'typedi';

import EntityNotFoundError from '../api/error/EntityNotFoundError.js';
import FirestoreError from '../api/error/FirestoreError.js';
import type ManiacUser from '../api/impl/user.js';
import { FIRESTORE } from '../constant.js';
import createCache from '../utils/cache.js';
import { CachedEntity } from '../utils/decorators/cached.js';
import { ManiacUserConverter } from '../utils/typeConverter.js';

@Service()
export default class UserDatabase {
  private static readonly CACHE: LRUCache<string, ManiacUser> = createCache(50, 1000 * 60 * 60);

  private readonly usersRef: CollectionReference<DocumentData>;

  constructor(@Inject(FIRESTORE) private readonly db: Firestore) {
    this.usersRef = this.db.collection('users').withConverter(ManiacUserConverter);
  }

  @CachedEntity.Read(UserDatabase.CACHE)
  async get(id: string, suppressWarning = true) {
    const userRef = this.usersRef.doc(id);

    try {
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        if (suppressWarning) {
          return null;
        }
        throw new EntityNotFoundError(`User '${id}' not exist.`);
      } else {
        return userDoc.data() as ManiacUser;
      }
    } catch (e) {
      throw new FirestoreError(`An error has occurred while attempt to get user ${id}`, e as Error);
    }
  }

  @CachedEntity.Insert(UserDatabase.CACHE)
  async insert(user: ManiacUser) {
    const userRef = this.usersRef.doc(user.id);

    try {
      await userRef.create(user);
    } catch (e) {
      throw new FirestoreError(
        `An error has occurred while attempt to insert user ${user.id}`,
        e as Error,
      );
    }
  }

  @CachedEntity.Update(UserDatabase.CACHE)
  async update(user: ManiacUser) {
    const userRef = this.usersRef.doc(user.id);

    try {
      await userRef.set(user);
    } catch (e) {
      throw new FirestoreError(
        `An error has occurred while attempt to update user ${user.id}`,
        e as Error,
      );
    }
  }

  @CachedEntity.Delete(UserDatabase.CACHE)
  async delete(user: ManiacUser) {
    const userRef = this.usersRef.doc(user.id);

    try {
      await userRef.delete();
    } catch (e) {
      throw new FirestoreError(
        `An error has occurred while attempt to delete user ${user.id}`,
        e as Error,
      );
    }
  }
}
