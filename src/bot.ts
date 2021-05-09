import { ChatUserstate, client as Client } from 'tmi.js';
import riotApi from './services/riotApi';

import { botOptions } from './config/bot';
import { IRankedLeagues } from './interfaces';
import { getFollowAge, getUptime } from './commands';

const commands = [
  '!elo',
  '!uptime',
  '!github',
  '!idade',
  '!vod',
  '!comandos',
  '!configs',
  '!config',
  '!pc',
  '!followage',
];

let userId = '';

async function getRiotAccountId(): Promise<string> {
  const { data: user } = await riotApi.get(
    `summoner/v4/summoners/by-name/${process.env.LOL_NICKNAME}`,
  );
  return user.id;
}

async function getLeagueOfLegendsRankedInfo() {
  const { data: rankedLeagues } = await riotApi.get(
    `league/v4/entries/by-summoner/${userId}`,
  );
  return rankedLeagues;
}

async function getInfoByNick(target: string): Promise<[string] | void> {
  try {
    if (userId === '') {
      userId = await getRiotAccountId();
    }

    const rankedLeagues = await getLeagueOfLegendsRankedInfo();

    if (rankedLeagues.length === 0) {
      return bot.say(target, 'Não terminou as MD10 ainda BibleThump');
    }
    let eloFlex = '';
    let eloSolo = '';

    rankedLeagues.forEach((rankedLeague: IRankedLeagues) => {
      if (rankedLeague.queueType === 'RANKED_FLEX_SR') {
        eloFlex = `${rankedLeague.tier} ${rankedLeague.rank} (${rankedLeague.leaguePoints} PDL)`;
        return eloFlex;
      }

      eloSolo = `${rankedLeague.tier} ${rankedLeague.rank} (${rankedLeague.leaguePoints} PDL)`;
      return eloSolo;
    });

    if (eloFlex === '' && eloSolo !== '') {
      return bot.say(
        target,
        `──────────────────────────────── Solo/Duo ...... ${eloSolo}`,
      );
    }

    if (eloFlex !== '' && eloSolo === '') {
      return bot.say(
        target,
        `───────────────────────────────────────── Flex ...... ${eloFlex} `,
      );
    }

    return bot.say(
      target,
      `──────────────────────────────── Solo/Duo ...... ${eloSolo} ───────────────────────────────────────── Flex ...... ${eloFlex}`,
    );
  } catch (err) {
    return console.error({ error: err.message });
  }
}

function messageArrived(
  target: string,
  context: ChatUserstate,
  message: string,
  me: boolean,
) {
  if (me) {
    return;
  }
  const viewerMessage = message.trim();

  if (!viewerMessage.startsWith('!')) return;

  commands.forEach(command => {
    if (command === viewerMessage) {
      if (command === '!followage') {
        getFollowAge(target, context);
      }

      if (command === '!uptime') {
        getUptime(target);
      }

      if (command === '!github') {
        bot.say(
          target,
          'Me segue no GitHub pra ver muitos códigos fodas e talvez umas gambiarras github.com/williamtorres1',
        );
      }

      if (command === '!vod') {
        bot.say(
          target,
          'O vod vai ficar disponível por 14 dias assim que a live terminar.',
        );
      }

      if (command === '!idade') {
        bot.say(target, 'Tenho 20 anos ainda SeemsGood');
      }

      if (command === '!comandos') {
        bot.say(
          target,
          'Os comandos disponíveis são: !elo, !uptime, !github, !idade, !vod, !comandos, !configs, !followage',
        );
      }

      if (
        command === '!configs' ||
        command === '!pc' ||
        command === '!config'
      ) {
        bot.say(
          target,
          `As configs estão no sobre do meu perfil ou no link: twitch.tv/iwillsuportu/about`,
        );
      }

      if (command === '!delay') {
        bot.say(target, 'Sem delay Kreygasm');
      }

      if (command === '!elo') {
        getInfoByNick(target);
      }
    }
  });
}

function connectOnTwitch(address: string, port: string | number) {
  bot.say(process.env.TARGET_CHANNEL_NAME, 'Entrei KappaPride');
  console.log(
    `>> ${process.env.TARGET_CHANNEL_NAME} está online em ${address}:${port}`,
  );
}

export const bot = new Client(botOptions);

bot.on('message', messageArrived);
bot.on('connected', connectOnTwitch);
