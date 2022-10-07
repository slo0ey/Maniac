import { EmbedBuilder } from "discord.js";

const EmbedTemplate = {
  unregistered() {
    return new EmbedBuilder()
      .setTitle(':question: 아직 프로필이 없네요 :disappointed_relieved:')
      .setDescription('`/profile` 명령어를 통해 프로필을 만들어보세요!');
  },
};

export { EmbedTemplate };
