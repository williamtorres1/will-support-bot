import 'dotenv/config';

import { ChatUserstate, client as Client } from 'tmi.js';
import {
  formatISO,
  parseISO,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
} from 'date-fns';

import { AxiosResponse } from 'axios';
import twitchApi from './services/twitchApi';
import riotApi from './services/riotApi';

import BotOptions from './config/bot';

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

const bot = new Client(BotOptions);

interface RankedLeagues {
  leagueId: string;
  queueType: 'RANKED_FLEX_SR' | 'RANKED_SOLO_5X5';
  tier:
    | 'IRON'
    | 'BRONZE'
    | 'SILVER'
    | 'GOLD'
    | 'PLATINUM'
    | 'DIAMOND'
    | 'MASTER'
    | 'GRANDMASTER'
    | 'CHALLENGER';
  rank: 'I' | 'II' | 'III' | 'IV';
  leaguePoints: number;
  wins: number;
  loses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

interface responseDateFollowAge {
  from_id: string;
  from_login: string;
  from_name: string;
  to_id: string;
  to_login: string;
  to_name: string;
  followed_at: string;
}

async function getInfoByNick(target: string): Promise<[string] | void> {
  try {
    console.log('>> Fetching data on riot api');
    const { data: user } = await riotApi.get(
      `summoner/v4/summoners/by-name/${process.env.LOL_NICKNAME}`,
    );
    const { data: rankedLeagues } = await riotApi.get(
      `league/v4/entries/by-summoner/${user.id}`,
    );
    if (rankedLeagues.length === 0) {
      bot.say(target, 'Não terminou as MD10 ainda BibleThump');
    }
    let eloFlex = '';
    let eloSolo = '';
    rankedLeagues.forEach((rankedLeague: RankedLeagues) => {
      if (rankedLeague.queueType === 'RANKED_FLEX_SR') {
        eloFlex = `${rankedLeague.tier} ${rankedLeague.rank} (${rankedLeague.leaguePoints} PDL)`;
        return eloFlex;
      }

      eloSolo = `${rankedLeague.tier} ${rankedLeague.rank} (${rankedLeague.leaguePoints} PDL)`;
      return eloSolo;
    });
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
  const commandName = message.trim();
  commands.forEach(command => {
    if (command === commandName) {
      if (command === '!followage') {
        const { 'room-id': to_id, 'user-id': user_id } = context;
        twitchApi
          .get(`/users/follows?from_id=${user_id}&to_id=${to_id}`)
          .then(
            (response): AxiosResponse<Promise<[string] | void>> => {
              const { followed_at, from_name, to_name } = response.data
                .data[0] as responseDateFollowAge;
              if (!followed_at) return;
              const followed_atParsed = parseISO(followed_at);
              const dateNowFormated = parseISO(formatISO(Date.now()));

              const years = differenceInYears(
                dateNowFormated,
                followed_atParsed,
              );

              const months =
                differenceInMonths(dateNowFormated, followed_atParsed) -
                years * 12;

              const days =
                differenceInDays(dateNowFormated, followed_atParsed) -
                months * 30;
              bot.say(
                target,
                `@${from_name} Você segue @${to_name} há ${years} anos, ${months} meses e ${days} dias`,
              );
            },
          )
          .catch(err => console.error(err));
      }
      if (command === '!uptime') {
        twitchApi
          .get(`/streams?user_login=${process.env.TARGET_CHANNEL_NAME}`)
          .then(response => {
            if (response.data.data.length === 0) {
              bot.say(target, `O/a streamer está offline`);
            }
            const { started_at } = response.data.data[0];
            const dateNowFormated = parseISO(formatISO(Date.now()));
            const parsedDateStartedAt = parseISO(started_at);
            const hours = differenceInHours(
              dateNowFormated,
              parsedDateStartedAt,
            );
            const minutes =
              differenceInMinutes(dateNowFormated, parsedDateStartedAt) -
              hours * 60;
            const seconds =
              differenceInSeconds(dateNowFormated, parsedDateStartedAt) -
              hours * 3600 -
              minutes * 60;

            bot.say(
              target,
              `@${process.env.TARGET_CHANNEL_NAME} está online há ${hours}h ${minutes}min ${seconds}s`,
            );
          })
          .catch(err => {
            console.error(err);
          });
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
        bot.say(target, 'Tenho 19 anos ainda SeemsGood');
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

function getInOnTwitch(address: string, port: string | number) {
  bot.say(process.env.TARGET_CHANNEL_NAME, 'Entrei KappaPride');
  console.log(
    `>> ${process.env.TARGET_CHANNEL_NAME} está online em ${address}:${port}`,
  );
}

// Registra nossas funções
bot.on('message', messageArrived);
bot.on('connected', getInOnTwitch);
// Conecta na Twitch:
bot.connect();
