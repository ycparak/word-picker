import type { CSSVariables } from '../../lib/cssVariables'
import { ICONS, type IconName } from './icons'
import styles from './Icon.module.css'

const GRID = 24

interface IconProps {
  name: IconName
  size: number
}

export function Icon({ name, size }: IconProps) {
  const { path, inkCenterY } = ICONS[name]
  const style: CSSVariables = {
    '--icon-ink-offset': `${((GRID / 2 - inkCenterY) * size) / GRID}px`,
  }

  return (
    <svg
      className={styles.icon}
      width={size}
      height={size}
      viewBox={`0 0 ${GRID} ${GRID}`}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} />
    </svg>
  )
}
