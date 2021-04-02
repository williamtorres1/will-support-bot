import dotenv from 'dotenv';

import { Client, client as Client } from 'tmi.js';
import {
  formatISO,
  parseISO,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns';

import api from './services/api';

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

const commands = ['!help', '!ban', '!hello', '!elo', '!uptime'];

const client = new Client(options);

function messageArrived(target, context, message, isBot) {
  if (isBot) {
    return; // se for mensagens do nosso bot ele não faz nada
  }

  const commandName = message.trim(); // remove espaço em branco da mensagem para verificar o comando
  // checando o nosso comando

  console.log(`>> message: ${commandName}`);
  commands.map(command => {
    console.log(`>> Executing map function`);
    if (command === commandName) {
      console.log(
        { target },
        `Você pediu para executar o comando ${commandName}`,
      );
      client.say(target, `* Você pediu para executar o comando ${commandName}`);

      if (command === '!uptime') {
        api
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
          .catch(err => console.log(err));
      }
    }
  });
}

function getInOnTwitch(address: string, port: string | number) {
  console.log(`>> ${botName} está online em ${address}:${port}`);
}

// Registra nossas funções
client.on('message', messageArrived);
client.on('connected', getInOnTwitch);
// Conecta na Twitch:
client.connect();
