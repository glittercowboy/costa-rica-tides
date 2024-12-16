export interface Beach {
  name: string;
  latitude: number;
  longitude: number;
}

export interface TideInfo {
  time: string;
  height: number;
  type: 'HIGH' | 'LOW';
}

export interface BeachTideData {
  beach: Beach;
  tides: TideInfo[];
  date: string;
}
