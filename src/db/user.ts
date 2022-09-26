import { Firestore, CollectionReference, DocumentData } from 'firebase-admin/firestore';
import LRUCache from 'lru-cache';
import { Inject, Service } from 'typedi';

import type ManiacUser from '../api/entity/user.js';
import EntityNotFoundError from '../api/error/EntityNotFoundError.js';
import FirestoreError from '../api/error/FirestoreError.js';
import { FIRESTORE } from '../constant.js';
import createCache from '../utils/cache.js';
import CachedValue from '../utils/decorators/cachedValue.js';

@Service()
export default class UserDatabase {
  private static readonly userCache: LRUCache<string, ManiacUser> = createCache(
    50,
    1000 * 60 * 60,
  );

  private readonly usersRef: CollectionReference<DocumentData>;

  constructor(@Inject(FIRESTORE) private readonly db: Firestore) {
    this.usersRef = this.db.collection('users');
  }

  @CachedValue.Read(UserDatabase.userCache)
  async getUser(id: string) {
    const userRef = this.usersRef.doc(id);

    try {
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new EntityNotFoundError(`User '${id}' not exist.`);
      } else {
        return userDoc.data() as ManiacUser;
      }
    } catch (e) {
      throw new FirestoreError(
        `An error has occurred while attempt to get user ${id}`,
        e as Error,
      );
    }
  }

  @CachedValue.Insert(UserDatabase.userCache)
  async insertUser(user: ManiacUser) {
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

  @CachedValue.Update(UserDatabase.userCache)
  async updateUser(user: Partial<ManiacUser>, isPartial = false) {
    const userRef = this.usersRef.doc(user.id!!);

    try {
      await userRef.set(user, { merge: isPartial });
    } catch (e) {
      throw new FirestoreError(
        `An error has occurred while attempt to update user ${user.id!!}`,
        e as Error,
      );
    }
  }

  @CachedValue.Delete(UserDatabase.userCache)
  async deleteUser(user: ManiacUser) {
    const userRef = this.usersRef.doc(user.id);

    try {
      await userRef.delete();
    } catch (e) {
      throw new FirestoreError(
        `An error has occurred while attempt to delete user ${user.id!!}`,
        e as Error,
      );
    }
  }
}
