import { Data } from 'dataclass';

import IManiacUser from '../entity/user.js';

export default class ManiacUser extends Data implements IManiacUser {
  id: string = '0';
  alternativeName: string = 'User#1234'; // 다른서버에서 보여질 이름
}
