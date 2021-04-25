import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'
import { usePLayer } from '../contexts/PlayerContext'

import localData from '../../server'
import styles from '../styles/Home.module.scss'


interface Episode {
  description: string,
  duration: number,
  durationAsString: string,
  id: string,
  members: string,
  publishedAt: string,
  thumbnail: string,
  title: string,
  url: string
}
interface HomeProps {
  allEpisodes: Episode[]
  latestEpisodes: Episode[]
}

// const hash = global.window && window.location.hash

export default function Home({ allEpisodes, latestEpisodes }: HomeProps) {
  const { playerIsMinimized, playList } = usePLayer()

  const episodeList = [...latestEpisodes, ...allEpisodes]

  return (
    <>
      <Head>
        <title>Podcastr | Home</title>
      </Head>

      <div className={styles.homepage}>
        <section className={styles.latestEpisodes}>
          <h2>Últimos Lançamentos</h2>

          <ul>
            {latestEpisodes.map((episode, index) => {
              return (
                <li key={episode.duration}>
                  {/* <Image 
                    width={728} 
                    height={409} 
                    src={episode.thumbnail} 
                    alt={episode.title}
                    objectFit="cover"
                  /> */}

                  <img src={episode.thumbnail} alt={episode.title} />

                  <div className={styles.episodeDetails}>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>

                  <button type="button" onClick={() => playList(episodeList, index)}>
                    <img src="/play-green.svg" alt="tocar episódio" />
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        <section className={styles.allEpisodesCard}>
          <h2>Todos episódios</h2>

          <div className={styles.tableHead}>
            <div></div>
            <div>Podcast</div>
            <div>Integrantes</div>
            <div>Data</div>
            <div>Duração</div>
            <div></div>
          </div>

          <div className={styles.tableItem}>
            {allEpisodes.map((episode, index) => {
              return (
                <div className={styles.item} key={episode.id}>
                  <div>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </div>
                  <div>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link></div>
                  <div>{episode.members}</div>
                  <div style={{ width: 100 }}>{episode.publishedAt}</div>
                  <div>{episode.durationAsString}</div>
                  <div>
                    <button
                      type="button"
                      onClick={() => playList(episodeList, index + latestEpisodes.length)}
                    >
                      <img src="/play-green.svg" alt="tocar episódio" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* {<section className={styles.allEpisodesTable}>
          <h2>Todos episódios</h2>

          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {allEpisodes.map((episode, index) => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 72 }}>
                      <Image
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 100 }} >{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => playList(episodeList, index + latestEpisodes.length)}
                      >
                        <img src="/play-green.svg" alt="tocar episódio" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>} */}

        {playerIsMinimized 
          ? <div className={styles.spaceForPlayerMinimized}></div>
          : <div className={styles.spaceForPlayerMaximized}></div>
        }
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // A variável [data] pode ser acessada por uma API ou a partir do arquivo local

  /*
  // localhost [development] - access local server (json server)
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })
  */

  // vercel (local data)
  const data = localData

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      thumbnail: episode.thumbnail,
      description: episode.description,
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  }

  // revalidate: tempo que a página irá se atualizar (em segundos)
}