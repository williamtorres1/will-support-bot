import dotenv from 'dotenv';

import { client as Client } from 'tmi.js';
import { formatISO, parseISO } from 'date-fns';

import api from './services/api';

dotenv.config();

const botName = process.env.BOT_USERNAME;
const botChannel = process.env.CHANNEL_NAME;
const botToken = process.env.OAUTH;

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

  commands.map(command => {
    // if (command === commandName) {
    //   client.say(target, `* Você pediu para executar o comando ${commandName}`);
    // }
    if (commandName === '!uptime') {
      api
        .get('?user_login=supernightstorm')
        .then(response => {
          const { started_at } = response.data.data[0];
          const dateNowFormated = formatISO(Date.now());
          const parsedDateStartedAt = formatISO(started_at);
          console.log(dateNowFormated, parsedDateStartedAt);
        })
        .catch(err => console.log(err));
    }
  });
}

function getInOnTwitch(adress: string, port: string | number) {
  console.log(`>> ${botName} está online em ${adress}:${port}`);
}

// Registra nossas funções
client.on('message', messageArrived);
client.on('connected', getInOnTwitch);
// Connecta na Twitch:
client.connect();
