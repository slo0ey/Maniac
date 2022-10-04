import { QueryDocumentSnapshot } from 'firebase-admin/firestore';

import ManiacGuild from '../api/impl/guild.js';
import ManiacUser from '../api/impl/user.js';

export const ManiacUserConverter = {
  toFirestore: (user: ManiacUser) => {
    const { id, alternativeName } = user;
    return { id, alternativeName };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    return ManiacUser.create(snapshot.data());
  },
};

export const ManiacGuildConverter = {
  toFirestore: (guild: ManiacGuild) => {
    const { id, game_channels } = guild;
    return { id, game_channels };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    return ManiacGuild.create(snapshot.data());
  },
};
