import { CollectionReference, DocumentData, Firestore } from 'firebase-admin/firestore';
import LRUCache from 'lru-cache';
import { Inject, Service } from 'typedi';

import EntityNotFoundError from '../api/error/EntityNotFoundError.js';
import FirestoreError from '../api/error/FirestoreError.js';
import ManiacGuild from '../api/impl/guild.js';
import { FIRESTORE } from '../constant.js';
import createCache from '../utils/cache.js';
import { CachedEntity } from '../utils/decorators/cached.js';
import { ManiacGuildConverter } from '../utils/typeConverter.js';

@Service()
export default class GuildDatabase {
  private static readonly CACHE: LRUCache<string, ManiacGuild> = createCache(
    30,
    1000 * 60 * 60 * 12, //12 hours
  );

  private readonly guildsRef: CollectionReference<DocumentData>;

  constructor(@Inject(FIRESTORE) private readonly db: Firestore) {
    this.guildsRef = this.db.collection('guilds').withConverter(ManiacGuildConverter);
  }

  @CachedEntity.Read(GuildDatabase.CACHE)
  async get(id: string, suppressWarning = true) {
    const guildRef = this.guildsRef.doc(id);

    try {
      const guildDoc = await guildRef.get();

      if (!guildDoc.exists) {
        if (suppressWarning) {
          return null;
        }
        throw new EntityNotFoundError(`Guild '${id}' not exist.`);
      } else {
        return guildDoc.data() as ManiacGuild;
      }
    } catch (e) {
      throw new FirestoreError(
        `An error has occurred while attempt to get guild ${id}`,
        e as Error,
      );
    }
  }

  @CachedEntity.Insert(GuildDatabase.CACHE)
  async insert(guild: ManiacGuild) {
    const guildRef = this.guildsRef.doc(guild.id);

    try {
      await guildRef.create(guild);
    } catch (e) {
      throw new FirestoreError(
        `An error has occurred while attempt to insert guild ${guild.id}`,
        e as Error,
      );
    }
  }

  @CachedEntity.Update(GuildDatabase.CACHE)
  async update(guild: ManiacGuild) {
    const guildRef = this.guildsRef.doc(guild.id);

    try {
      await guildRef.set(guild);
    } catch (e) {
      throw new FirestoreError(
        `An error has occurred while attempt to update guild ${guild.id}`,
        e as Error,
      );
    }
  }

  @CachedEntity.Delete(GuildDatabase.CACHE)
  async delete(guild: ManiacGuild) {
    const guildRef = this.guildsRef.doc(guild.id);

    try {
      await guildRef.delete();
    } catch (e) {
      throw new FirestoreError(
        `An error has occurred while attempt to delete guild ${guild.id}`,
        e as Error,
      );
    }
  }
}
