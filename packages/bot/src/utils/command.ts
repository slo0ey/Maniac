import Container from "typedi";
import { Arguments, Command } from "../command";
import { COMMAND_MAP } from "../constant";

export function createCommandMap() {
  const commandMap = new Map<string, Command<Arguments>>();
  Container.set(COMMAND_MAP, commandMap);

  return commandMap;
}