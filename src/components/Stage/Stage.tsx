import type { CSSProperties, ReactNode, Ref } from 'react'
import { STAGE_HEIGHT, STAGE_WIDTH } from '../../config/stage'
import { useFitScale } from '../../hooks/useFitScale'
import type { CSSVariables } from '../../lib/cssVariables'
import styles from './Stage.module.css'

interface StageProps {
  ref?: Ref<HTMLDivElement>
  /** Tints the whole viewport behind the stage. */
  dimmed: boolean
  /** CSS `cursor` value applied to everything on the page. */
  cursor: string | null
  style?: CSSProperties
  children: ReactNode
}

/**
 * A fixed 1280×720 canvas, scaled uniformly to fit the viewport and centered in it, so the
 * layout matches the prototype at any window size.
 */
export function Stage({ ref, dimmed, cursor, style, children }: StageProps) {
  const scale = useFitScale(STAGE_WIDTH, STAGE_HEIGHT)

  const viewportStyle: CSSVariables = { ...style }
  if (cursor) viewportStyle['--stage-cursor'] = cursor

  const stageStyle: CSSVariables = {
    width: STAGE_WIDTH,
    height: STAGE_HEIGHT,
    '--stage-scale': scale,
  }

  return (
    <div
      className={styles.viewport}
      data-dimmed={dimmed || undefined}
      data-custom-cursor={cursor ? '' : undefined}
      style={viewportStyle}
    >
      <div ref={ref} className={styles.stage} style={stageStyle}>
        {children}
      </div>
    </div>
  )
}
