import Image from 'next/image';
import { useEffect, useRef } from 'react';
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import { usePLayer } from '../contexts/PlayerContext';

import styles from '../styles/Player.module.scss';

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)

  const { 
    episodeList, 
    currentEpisodeIndex, 
    hasNextEpisode,
    hasPreviousEpisode,
    isLooping,
    isPlaying, 
    isShuffling,
    playNext,
    playPrevious,
    setplayingState,
    toggleLoop,
    togglePlay,
    toggleShuffle 
  } = usePLayer()

  useEffect(() => {
    if (!audioRef.current) {
      return
    }

    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  const episode = episodeList[currentEpisodeIndex]

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="tocando agora" />
        <strong>Tocando agora {episode?.title} </strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image 
            width={592} 
            height={592}
            src={episode.thumbnail}
            alt={episode.title}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (

        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider 
                trackStyle={{ backgroundColor: '#04D361' }}
                railStyle={{backgroundColor: '#9F75FF'}}
                handleStyle={{borderColor: '#04D361', borderWidth: 4}}
              />
            ) : (
              <div className={styles.emptySlider}></div>
            )}
          </div>
          <span>00:00</span>
        </div>

        { episode && (
          <audio 
            src={episode.url} 
            ref={audioRef} 
            onPlay={() => setplayingState(true)}
            onPause={() => setplayingState(false)}
            loop={isLooping}
            autoPlay
          />
        )}


        <div className={styles.buttons}>
          <button 
            type="button" 
            className={isShuffling ? styles.isActive : ''}
            disabled={!episode || episodeList.length == 1}
            onClick={toggleShuffle}
          >
            <img src="/shuffle.svg" alt="embaralhar" />
          </button>
          <button 
            type="button" 
            onClick={playPrevious} 
            disabled={!episode || !hasPreviousEpisode}
          >
            <img src="/play-previous.svg" alt="tocar anterior" />
          </button>
          <button type="button" 
            className={styles.playButton} 
            onClick={togglePlay} 
            disabled={!episode}
          >
            {isPlaying 
              ? <img src="/pause.svg" alt="pausar" />
              : <img src="/play.svg" alt="tocar" />
            }
          </button>
          <button 
            type="button" 
            onClick={playNext} 
            disabled={!episode || !hasNextEpisode}
          >
            <img src="/play-next.svg" alt="tocar próxima" />
          </button>
          <button 
            type="button" 
            className={isLooping ? styles.isActive : ''}
            disabled={!episode}
            onClick={toggleLoop}
          >
            <img src="/repeat.svg" alt="repetir" />
          </button>
        </div>
      </footer>
    </div>
  )
}