import { Firestore, CollectionReference, DocumentData } from 'firebase-admin/firestore';
import LRUCache from 'lru-cache';
import { Inject, Service } from 'typedi';

import ManiacUser from '../api/user.js';
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

  @CachedValue(UserDatabase.userCache)
  async getUser(id: string) {
    const userRef = this.usersRef.doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return null;
    } else {
      return userDoc.data() as ManiacUser;
    }
  }

  async insertUser(user: ManiacUser) {
    const userRef = this.usersRef.doc(user.id);
    await userRef.create(user);
  }

  async updateUser(user: Partial<ManiacUser>, isPartial = false) {
    const userRef = this.usersRef.doc(user.id!!);
    await userRef.set(user, { merge: isPartial });
  }

  async deleteUser(user: ManiacUser) {
    const userRef = this.usersRef.doc(user.id);
    await userRef.delete();
  }
}
