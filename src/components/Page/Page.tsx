import type { CSSProperties, ReactNode } from 'react'
import type { CSSVariables } from '../../lib/cssVariables'
import styles from './Page.module.css'

interface PageProps {
  /** Tints the page background. */
  dimmed: boolean
  /** CSS `cursor` value applied to everything on the page, or null for the defaults. */
  cursor: string | null
  style?: CSSProperties
  children: ReactNode
}

export function Page({ dimmed, cursor, style, children }: PageProps) {
  const pageStyle: CSSVariables = { ...style }
  if (cursor) pageStyle['--page-cursor'] = cursor

  return (
    <div
      className={styles.page}
      data-dimmed={dimmed || undefined}
      data-custom-cursor={cursor ? '' : undefined}
      style={pageStyle}
    >
      {children}
    </div>
  )
}
