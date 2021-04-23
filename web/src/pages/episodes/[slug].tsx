import { GetStaticPaths, GetStaticProps } from 'next'
import Header from 'next/head'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { api } from '../../services/api'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'
import styles from '../../styles/Episode.module.scss'
import Link from 'next/link'
import { usePLayer } from '../../contexts/PlayerContext'


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

interface EpisodeProps {
  episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
/*  // Gerar páginas com o "true"
  const router = useRouter()
  if (router.isFallback) {
    return <p>Carregando...</p>
  } 
*/

  const { play } = usePLayer()

  return (
    <div className={styles.episode}>
      <Header>
        <title> {episode.title} | Podcastr</title>
      </Header>

      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button>
          <img 
            src="/play.svg" 
            alt="tocar epsisódio" 
            onClick={() => play(episode)} 
          />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  }

/*
  fallback: false => se a página não foi gerada na build, da erro 404

  fallback: true => se a página não foi gerada na build, é criada apenas no navegador 

  fallback: 'blocking' => se a página não foi gerada na build, é criada uma versão 
    estática no servidor quando alguem acessar
*/
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params
  const { data } = await api.get(`/episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    thumbnail: data.thumbnail,
    description: data.description,
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    url: data.file.url,
  }

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}