import Link from 'next/link'

import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR'

import styles from '../styles/Header.module.scss'

export default function Header() {
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR,
  })

  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <img src="/logo.svg" alt="logo do poscastr" />
      </Link>
      <p>O melhor para  você ouvir sempre</p>

      <span>{currentDate}</span>
    </header>
  )
}
