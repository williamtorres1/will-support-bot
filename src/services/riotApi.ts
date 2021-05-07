import axios from 'axios';

const riotApi = axios.create({
  baseURL: 'https://br1.api.riotgames.com/lol/',
  headers: {
    'X-Riot-Token': process.env.RIOT_TOKEN,
  },
});

export default riotApi;
