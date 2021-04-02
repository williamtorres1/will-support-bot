import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const api = axios.create({
  baseURL: 'https://api.twitch.tv/helix/streams',
  headers: {
    Authorization: `Bearer ${process.env.BOT_ACCESS_TOKEN}`,
    'client-id': 'bdv4rambwdxapho3z5bopaadzflhsf',
  },
});

export default api;
