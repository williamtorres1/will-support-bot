const botOptions = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.BOT_OAUTH,
  },
  channels: [process.env.TARGET_CHANNEL_NAME],
};

export default botOptions;
