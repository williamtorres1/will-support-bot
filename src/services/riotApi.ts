import axios from 'axios';

const riotApi = axios.create({
  baseURL: `https://${process.env.RIOT_SERVER}.api.riotgames.com/lol/`,
  headers: {
    'X-Riot-Token': process.env.RIOT_TOKEN,
  },
});

export default riotApi;
