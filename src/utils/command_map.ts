import { Container } from 'typedi';

import { Arguments, Command } from '../command.js';
import { COMMAND_MAP } from '../constant.js';

export default () => {
  const commandMap = new Map<string, Command<Arguments>>();
  Container.set(COMMAND_MAP, commandMap);

  return commandMap;
};
