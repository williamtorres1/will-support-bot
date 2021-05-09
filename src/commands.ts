import {
  parseISO,
  formatISO,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns';
import { ChatUserstate } from 'tmi.js';

import { bot } from './bot';
import twitchApi from './services/twitchApi';
import { ITwitchUptimeResponse, ITwitchFollowageResponse } from './interfaces';

async function getFollowAge(
  target: string,
  context: ChatUserstate,
): Promise<void> {
  const { 'room-id': to_id, 'user-id': user_id } = context;

  try {
    const {
      data: { data },
    } = await twitchApi.get<ITwitchFollowageResponse>(
      `/users/follows?from_id=${user_id}&to_id=${to_id}`,
    );

    if (data.length === 0) {
      bot.say(target, 'Você não segue o boy!');
      return;
    }

    const { from_name, to_name, followed_at } = data[0];

    const followed_atParsed = parseISO(followed_at);
    const dateNowFormated = parseISO(formatISO(Date.now()));

    const years = differenceInYears(dateNowFormated, followed_atParsed);

    const months =
      differenceInMonths(dateNowFormated, followed_atParsed) - years * 12;

    const days =
      differenceInDays(dateNowFormated, followed_atParsed) - months * 30;

    bot.say(
      target,
      `@${from_name} Você segue @${to_name} há ${years} anos, ${months} meses e ${days} dias`,
    );
  } catch (err) {
    console.error(err);
  }
}

async function getUptime(target: string): Promise<void> {
  try {
    const {
      data: { data },
    } = await twitchApi.get<ITwitchUptimeResponse>(
      `streams?user_login=${process.env.TARGET_CHANNEL_NAME}`,
    );

    if (data.length === 0) {
      bot.say(target, 'O streamer tá offline');
    }

    const { started_at } = data[0];

    const started_atParsed = parseISO(started_at);
    const dateNowFormated = parseISO(formatISO(Date.now()));

    const hours = differenceInHours(dateNowFormated, started_atParsed);

    const minutes =
      differenceInMinutes(dateNowFormated, started_atParsed) - hours * 60;

    const seconds =
      differenceInSeconds(dateNowFormated, started_atParsed) -
      hours * 3600 -
      minutes * 60;

    bot.say(
      target,
      `@${process.env.TARGET_CHANNEL_NAME} está online há ${hours}h ${minutes}min ${seconds}s`,
    );
  } catch (err) {
    console.error(err);
  }
}

export { getFollowAge, getUptime };
