import styles from './Headline.module.css'

interface HeadlineProps {
  lead: string
  /** Set on a second, staggered line in the italic accent style. */
  accent: string
}

export function Headline({ lead, accent }: HeadlineProps) {
  return (
    <h1 className={styles.headline}>
      <span className={styles.lead}>{lead}</span> <em className={styles.accent}>{accent}</em>
    </h1>
  )
}
