import { createContext, ReactNode, useContext, useState } from 'react'

interface Episode {
  duration: number,
  members: string,
  thumbnail: string,
  title: string,
  url: string
}

interface PlayerContextData {
  currentEpisodeIndex: number,
  episodeList: Episode[],
  hasNextEpisode: boolean,
  hasPreviousEpisode: boolean,
  isLooping: boolean,
  isPlaying: boolean,
  isShuffling: boolean,
  clearPlayerState: () => void,
  play: (episode: Episode) => void,
  playList: (List: Episode[], index: number) => void,
  playNext: () => void,
  playPrevious: () => void,
  setplayingState: (state: boolean) => void,
  toggleLoop: () => void,
  togglePlay: () => void,
  toggleShuffle: () => void,
}

export const PlayerContext = createContext({} as PlayerContextData)

interface PlayerContextProviderProps {
  children: ReactNode
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps){
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isLooping, setIsLooping] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  function clearPlayerState() {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  function play(episode: Episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(List: Episode[], index: number) {
    setEpisodeList(List)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  const hasNextEpisode = isShuffling || (currentEpisodeIndex + 1) < episodeList.length
  function playNext(){
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if (hasNextEpisode) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  const hasPreviousEpisode = isShuffling || currentEpisodeIndex > 0
  function playPrevious(){
    if (hasPreviousEpisode) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  function setplayingState(state: boolean) {
    setIsPlaying(state)
  }
  
  function toggleLoop(){
    setIsLooping(!isLooping)
  }

  function togglePlay(){
    setIsPlaying(!isPlaying)
  }

  function toggleShuffle(){
    setIsShuffling(!isShuffling)
  }

  return (
    <PlayerContext.Provider 
      value={{ 
        currentEpisodeIndex, 
        episodeList, 
        hasNextEpisode,
        hasPreviousEpisode,
        isLooping,
        isPlaying, 
        isShuffling,
        clearPlayerState,
        play,
        playList, 
        playNext, 
        playPrevious,
        setplayingState,
        toggleLoop,
        togglePlay, 
        toggleShuffle
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePLayer = () => {
  return useContext(PlayerContext)
}
