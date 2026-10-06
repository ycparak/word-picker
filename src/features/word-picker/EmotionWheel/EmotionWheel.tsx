import { useId } from 'react'
import { EMOTIONS } from '../../../data/emotions'
import { annularSectorPath, polarToPoint, type Point } from '../../../lib/geometry'
import { labelPlacement, segmentBounds, WHEEL_GEOMETRY, type WheelSelection } from './wheelModel'
import styles from './EmotionWheel.module.css'

const { innerRadius, outerRadius, segmentGap, disc, tick, label, canvasRadius } = WHEEL_GEOMETRY
const HALF_GAP = segmentGap / 2
const CANVAS_SIZE = canvasRadius * 2

/**
 * Opacity across the center disc's feathered edge, as [progress, opacity] pairs where progress
 * runs from the solid core (0) to the fully transparent rim (1).
 */
const DISC_FALLOFF: readonly (readonly [number, number])[] = [
  [0, 1],
  [1 / 6, 0.83],
  [2 / 6, 0.6],
  [3 / 6, 0.37],
  [4 / 6, 0.13],
  [5 / 6, 0.03],
  [1, 0],
]
const discStopOffset = (progress: number) =>
  (disc.solidRadius + progress * (disc.fadeRadius - disc.solidRadius)) / disc.fadeRadius

/** Portion of each tick (from its inner end) that fades in. */
const TICK_FADE = 0.3

interface EmotionWheelProps {
  /** Wheel center, relative to the positioned container the wheel renders in. */
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
            <stop className={styles.discStop} offset={0} />
            {DISC_FALLOFF.map(([progress, opacity]) => (
              <stop
                key={progress}
                className={styles.discStop}
                offset={discStopOffset(progress)}
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

        {EMOTIONS.map((emotion) => {
          const { x, y, anchor } = labelPlacement(emotion.centerAngle)
          return (
            <text
              key={emotion.id}
              className={styles.label}
              x={x}
              y={y}
              fontSize={label.fontSize}
              textAnchor={anchor}
              dominantBaseline="central"
            >
              {emotion.label}
            </text>
          )
        })}
      </svg>

      {word !== null && <div className={styles.centerWord}>{word}</div>}
    </div>
  )
}
