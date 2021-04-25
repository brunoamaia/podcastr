import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import { usePLayer } from '../contexts/PlayerContext';

import styles from '../styles/Player.module.scss';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)

  const { 
    episodeList, 
    currentEpisodeIndex, 
    hasNextEpisode,
    hasPreviousEpisode,
    isLooping,
    isPlaying, 
    isShuffling,
    playerIsMinimized,
    clearPlayerState,
    playNext,
    playPrevious,
    setplayingState,
    toggleLoop,
    togglePlay,
    togglePlayerState,
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

  function handleEpisodeEnded() {
    if (hasNextEpisode) {
      playNext()
    } else {
      clearPlayerState()
    }
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function setupProgressListener() {
    audioRef.current.currentTime = 0
    audioRef.current.addEventListener('timeupdate', event => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="tocando agora" />
        <strong>Tocando agora{`:  ${episode?.title ?? ''}`} </strong>
        
        {episode ? (
          <div className={styles.showPlayer}> 
            <div 
              className={playerIsMinimized ? styles.playerMinimized : styles.playerMaximized}
            >
              <img src="/x.svg" alt="fechar display do player" onClick={togglePlayerState}/> 
            </div>
          
          </div>
          )
          : ('')
        }
      </header>

      {episode ? (
        <div 
          className={episode && playerIsMinimized
            ? styles.currentEpisodeEmpty 
            : styles.currentEpisode
          }
        >
          <Image 
            width={728} 
            height={409}
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
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider 
                handleStyle={{borderColor: '#04D361', borderWidth: 4}}
                max={episode.duration}
                onChange={handleSeek}
                railStyle={{backgroundColor: '#9F75FF'}}
                trackStyle={{ backgroundColor: '#04D361' }}
                value={progress}
                />
                ) : (
                  <div className={styles.emptySlider}></div>
                  )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        { episode && (
          <audio 
            autoPlay
            loop={isLooping}
            onEnded={handleEpisodeEnded}
            onLoadedMetadata={setupProgressListener}
            onPause={() => setplayingState(false)}
            onPlay={() => setplayingState(true)}
            ref={audioRef} 
            src={episode.url} 
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