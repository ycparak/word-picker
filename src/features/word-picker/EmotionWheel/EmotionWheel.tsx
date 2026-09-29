import { useId } from 'react'
import { EMOTIONS } from '../../../data/emotions'
import { annularSectorPath, polarToPoint, type Point } from '../../../lib/geometry'
import { segmentBounds, WHEEL_GEOMETRY, type WheelSelection } from './wheelModel'
import styles from './EmotionWheel.module.css'

const { innerRadius, outerRadius, segmentGap, disc, tick, canvasRadius } = WHEEL_GEOMETRY
const HALF_GAP = segmentGap / 2
const CANVAS_SIZE = canvasRadius * 2

/** Opacity falloff of the center disc's feathered edge, as [radius, opacity] pairs. */
const DISC_FALLOFF: readonly (readonly [number, number])[] = [
  [0, 1],
  [disc.solidRadius, 1],
  [80, 0.83],
  [84, 0.6],
  [88, 0.37],
  [92, 0.13],
  [96, 0.03],
  [disc.fadeRadius, 0],
]

/** Portion of each tick (from its inner end) that fades in. */
const TICK_FADE = 0.3

interface EmotionWheelProps {
  /** Wheel center in stage coordinates. */
  center: Point
  selection: WheelSelection | null
  /** Word shown at the center, or null once it has been committed to the text. */
  word: string | null
  closing: boolean
}

export function EmotionWheel({ center, selection, word, closing }: EmotionWheelProps) {
  // useId output isn't guaranteed to be valid inside url(#...), so keep it to safe characters.
  const idPrefix = `wheel-${useId().replace(/[^\w-]/g, '')}`
  const discGradientId = `${idPrefix}-disc`
  const tickFilterId = `${idPrefix}-tick-soften`
  const tickGradientId = (emotionId: string) => `${idPrefix}-tick-${emotionId}`

  return (
    <div
      className={styles.wheel}
      style={{ left: center.x, top: center.y }}
      data-closing={closing || undefined}
    >
      <svg
        className={styles.graphic}
        style={{ left: -canvasRadius, top: -canvasRadius }}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        viewBox={`${-canvasRadius} ${-canvasRadius} ${CANVAS_SIZE} ${CANVAS_SIZE}`}
        aria-hidden="true"
      >
        <defs>
          <radialGradient
            id={discGradientId}
            cx={0}
            cy={0}
            r={disc.fadeRadius}
            gradientUnits="userSpaceOnUse"
          >
            {DISC_FALLOFF.map(([radius, opacity]) => (
              <stop
                key={radius}
                className={styles.discStop}
                offset={radius / disc.fadeRadius}
                stopOpacity={opacity}
              />
            ))}
          </radialGradient>
          {EMOTIONS.map((emotion) => {
            const from = polarToPoint(tick.innerRadius, emotion.centerAngle)
            const to = polarToPoint(tick.outerRadius, emotion.centerAngle)
            return (
              <linearGradient
                key={emotion.id}
                id={tickGradientId(emotion.id)}
                gradientUnits="userSpaceOnUse"
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
              >
                <stop offset={0} stopColor={emotion.tickColor} stopOpacity={0} />
                <stop offset={TICK_FADE} stopColor={emotion.tickColor} />
                <stop offset={1} stopColor={emotion.tickColor} />
              </linearGradient>
            )
          })}
          <filter id={tickFilterId}>
            <feGaussianBlur stdDeviation={tick.blur} />
          </filter>
        </defs>

        <circle r={disc.fadeRadius} fill={`url(#${discGradientId})`} />

        <g filter={`url(#${tickFilterId})`}>
          {EMOTIONS.map((emotion) => {
            const from = polarToPoint(tick.innerRadius, emotion.centerAngle)
            const to = polarToPoint(tick.outerRadius, emotion.centerAngle)
            return (
              <line
                key={emotion.id}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={`url(#${tickGradientId(emotion.id)})`}
                strokeWidth={tick.width}
              />
            )
          })}
        </g>

        {EMOTIONS.map((emotion) => {
          const { start, end } = segmentBounds(emotion)
          return (
            <path
              key={emotion.id}
              className={styles.outline}
              d={annularSectorPath(start, end, innerRadius, outerRadius, HALF_GAP)}
            />
          )
        })}

        {selection && (
          <path
            fill={selection.emotion.color}
            d={annularSectorPath(
              segmentBounds(selection.emotion).start,
              segmentBounds(selection.emotion).end,
              innerRadius,
              selection.fillRadius,
              HALF_GAP,
            )}
          />
        )}

        {EMOTIONS.map(({ id, label, labelAnchor, labelScaleY = 1 }) => (
          <text
            key={id}
            className={styles.label}
            transform={`translate(${labelAnchor.x} ${labelAnchor.y}) scale(1 ${labelScaleY})`}
            textAnchor="middle"
          >
            {label}
          </text>
        ))}
      </svg>

      {word !== null && <div className={styles.centerWord}>{word}</div>}
    </div>
  )
}
