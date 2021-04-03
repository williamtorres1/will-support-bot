import dotenv from 'dotenv';

import { ChatUserstate, client as Client } from 'tmi.js';
import {
  formatISO,
  parseISO,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns';

import twitchApi from './services/twitchApi';
import riotApi from './services/riotApi';

dotenv.config();

const botName = process.env.BOT_USERNAME;
const botChannel = process.env.TARGET_CHANNEL_NAME;
const botToken = process.env.BOT_OAUTH;

const options = {
  identity: {
    username: botName,
    password: botToken,
  },
  channels: [botChannel],
};

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
  // '!delay',
  // '!followage',
];

const client = new Client(options);

async function getInfoByNick(target: string): Promise<[string] | void> {
  try {
    const { data: user } = await riotApi.get(
      `summoner/v4/summoners/by-name/${process.env.LOL_NICKNAME}`,
    );

    const { data: rankedLeagues } = await riotApi.get(
      `league/v4/entries/by-summoner/${user.id}`,
    );
    if (rankedLeagues.length === 0) {
      return client.say(target, 'Não terminou as MD10 ainda BibleThump');
    }
    let eloFlex = '';
    let eloSolo = '';
    rankedLeagues.forEach(rankedLeague => {
      if (rankedLeague.queueType === 'RANKED_FLEX_SR') {
        eloFlex = `${rankedLeague.tier} ${rankedLeague.rank} (${rankedLeague.leaguePoints} PDL)`;
        return eloFlex;
      }

      eloSolo = `${rankedLeague.tier} ${rankedLeague.rank} (${rankedLeague.leaguePoints} PDL)`;
      return eloSolo;
    });
    return client.say(
      target,
      `──────────────────────────────── Solo/Duo ...... ${eloSolo} ───────────────────────────────────────── Flex ...... ${eloFlex}`,
    );
  } catch (err) {
    return console.error(err);
  }
}

function messageArrived(
  target: string,
  context: ChatUserstate,
  message: string,
  isBot: boolean,
) {
  if (isBot) {
    return; // se for mensagens do nosso bot ele não faz nada
  }
  const commandName = message.trim(); // remove espaço em branco da mensagem para verificar o comando
  // checando o nosso comando

  console.log(`>> message: ${commandName}`);
  commands.map(command => {
    console.log(`>> Executing map function`);
    if (command === commandName) {
      if (command === '!uptime') {
        twitchApi
          .get(`?user_login=${botChannel}`)
          .then(response => {
            if (response.data.data.length === 0) {
              return client.say(target, `O/a streamer está offline`);
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

            return client.say(
              target,
              `@${botChannel} está online há ${hours}h ${minutes}min ${seconds}s`,
            );
          })
          .catch(err => {
            return console.log(err.message);
          });
      }
      if (command === '!github') {
        return client.say(
          target,
          'Me segue no GitHub pra ver muitos códigos fodas e talvez umas gambiarras github.com/williamtorres1',
        );
      }
      if (command === '!vod') {
        return client.say(
          target,
          'O vod vai ficar disponível por 14 dias assim que a live terminar.',
        );
      }
      if (command === '!idade') {
        return client.say(target, 'Tenho 19 anos ainda SeemsGood');
      }
      if (command === '!comandos') {
        return client.say(
          target,
          'Os comandos disponíveis são: !elo, !uptime, !github, !idade, !vod, !comandos, !configs',
        );
      }
      if (
        command === '!configs' ||
        command === '!pc' ||
        command === '!config'
      ) {
        return client.say(
          target,
          `As configs estão no sobre do meu perfil ou no link: twitch.tv/iwillsuportu/about`,
        );
      }
      if (command === '!delay') {
        return client.say(target, 'Sem delay Kreygasm');
      }
      if (command === '!elo') {
        return getInfoByNick(target);
      }
    }
  });
}

function getInOnTwitch(address: string, port: string | number) {
  client.say(process.env.TARGET_CHANNEL_NAME, 'Entrei KappaPride');
  return console.log(`>> ${botName} está online em ${address}:${port}`);
}

// Registra nossas funções
client.on('message', messageArrived);
client.on('connected', getInOnTwitch);
// Conecta na Twitch:
client.connect();
