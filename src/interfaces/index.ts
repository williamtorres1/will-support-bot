export interface IRankedLeagues {
  leagueId: string;
  queueType: 'RANKED_FLEX_SR' | 'RANKED_SOLO_5X5';
  tier:
    | 'IRON'
    | 'BRONZE'
    | 'SILVER'
    | 'GOLD'
    | 'PLATINUM'
    | 'DIAMOND'
    | 'MASTER'
    | 'GRANDMASTER'
    | 'CHALLENGER';
  rank: 'I' | 'II' | 'III' | 'IV';
  leaguePoints: number;
  wins: number;
  loses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

interface IFollowageResponse {
  from_id: string;
  from_login: string;
  from_name: string;
  to_id: string;
  to_login: string;
  to_name: string;
  followed_at: string;
}

export interface ITwitchFollowageResponse {
  total: number;
  data: IFollowageResponse[];
}

interface IUptimeResponse {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: 'live';
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  is_mature: boolean;
}

export interface ITwitchUptimeResponse {
  data: IUptimeResponse[];
  pagination: {
    cursor: string;
  };
}
