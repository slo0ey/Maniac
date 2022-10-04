export default class GuildMap<K, V> {
  private readonly guildMap: Map<string, Map<K, V>>;

  constructor() {
    this.guildMap = new Map();
  }

  get(guildId: string, key: K) {
    return this.guildMap.get(guildId)?.get(key);
  }

  set(guildId: string, key: K, value: V) {
    if (!this.guildMap.has(guildId)) {
      const map = new Map();
      map.set(key, value);
      this.guildMap.set(guildId, map);
    } else {
      this.guildMap.get(guildId)!.set(key, value);
    }
  }

  has(guildId: string, key: K) {
    if (!this.guildMap.has(guildId)) {
      return false;
    } else {
      return this.guildMap.get(guildId)!.has(key);
    }
  }

  delete(guildId: string, key: K) {
    this.guildMap.get(guildId)?.delete(key);
  }
}
