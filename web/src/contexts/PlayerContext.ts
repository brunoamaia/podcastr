import { createContext } from 'react'

interface Episode {
  duration: number,
  members: string,
  thumbnail: string,
  title: string,
  url: string
}

interface PlayerContextData {
  episodeList: Episode[]
  currentEpisodeIndex: number,
  isPlaying: boolean,
  play: (episode: Episode) => void,
  setplayingState: (state: boolean) => void,
  togglePlay: () => void,
}

export const PlayerContext = createContext({} as PlayerContextData)