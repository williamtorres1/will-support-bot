import { client as Client } from 'tmi.js';

const botName = 'night-bot';
const botChannel = 'supernightstorm';
const botToken = 'oauth:';

const options = {
  identity: {
    username: botName,
    password: botToken,
  },
  channels: [botChannel],
};

const commands = ['!help', '!ban', '!hello', '!elo'];

const client = new Client(options);

function messageArrived(alvo, contexto, message, ehBot) {
  if (ehBot) {
    return; // se for mensagens do nosso bot ele não faz nada
  }

  const commandName = message.trim(); // remove espaço em branco da mensagem para verificar o comando
  // checando o nosso comando

  commands.map(command => {
    if (command === commandName) {
      client.say(alvo, `* Você pediu para executar o comando ${commandName}`);
    }
  });
}

function entrouNoChatDaTwitch(adress: string, port: string | number) {
  console.log(`* Bot entrou no endereço ${adress}:${port}`);
}

// Registra nossas funções
client.on('message', messageArrived);
client.on('connected', entrouNoChatDaTwitch);
// Connecta na Twitch:
client.connect();
