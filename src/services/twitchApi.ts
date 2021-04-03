import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const twitchApi = axios.create({
  baseURL: 'https://api.twitch.tv/helix/streams',
  headers: {
    'client-id': process.env.BOT_CLIENT_ID,
    Authorization: `Bearer ${process.env.BOT_ACCESS_TOKEN}`,
  },
});

export default twitchApi;
