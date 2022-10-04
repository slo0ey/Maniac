import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Container } from 'typedi';

import { FIRESTORE } from '../constant.js';

export default async () => {
  let account;
  if (process.env.NODE_ENV !== 'production') {
    account = (await import('../serviceAccountKey.json', { assert: { type: 'json' } })).default;
  } else {
    const { FST, FSPI, FSPKI, FSPK, FSCE, FSCI, FSAU, FSTU, FSAPXCU, FSCXCU } = process.env;

    account = {
      type: FST!,
      project_id: FSPI!,
      private_key_id: FSPKI!,
      private_key: FSPK!,
      client_email: FSCE!,
      client_id: FSCI!,
      auth_uri: FSAU!,
      token_uri: FSTU!,
      auth_provider_x509_cert_url: FSAPXCU!,
      client_x509_cert_url: FSCXCU!,
    };
  }

  const app = initializeApp({
    credential: cert(account as ServiceAccount),
  });
  const db = getFirestore(app);
  Container.set(FIRESTORE, db);
};
