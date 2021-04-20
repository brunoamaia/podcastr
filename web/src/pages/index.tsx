import Head from 'next/head'

import localData from '../../server'

interface serverData {
  episodes: [
    {
      id: string,
      title: string,
      members: string,
      published_at: string,
      thumbnail: string,
      description: string,
      file: {
        url: string,
        type: string,
        duration: number,
      }
    }
  ]
}

const hash = global.window && window.location.hash

export default function Home(props: serverData) {
  return (
    <div>
      <Head>
        <title>Podcastr</title>
      </Head>

      <main>
        <strong>Episódios</strong>
        {props.episodes.map((episode) => (
          <p key={episode.file.duration} >{episode.title}</p>
        ))}
        <br/> <br/>
      </main>

      <footer>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  /* // localhost [development] - access local server (json server)
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json() */ 

 // vercel (local data)
  const data = localData

  return {
    props: {
      episodes: data
    },
    revalidate: 60 * 60 * 8
  }

  // revalidate: tempo que a página irá se atualizar (em segundos)
}