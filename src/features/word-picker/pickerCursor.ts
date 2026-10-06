import { ICONS } from '../../components/Icon/icons'

/** The picker cursor matches the toolbar icon size. */
const CURSOR_SIZE = 24
const CURSOR_HOTSPOT = CURSOR_SIZE / 2
const CURSOR_COLOR = 'rgba(40, 40, 40, 0.8)'

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${CURSOR_SIZE}" height="${CURSOR_SIZE}" viewBox="0 0 24 24">` +
  `<path fill="${CURSOR_COLOR}" d="${ICONS.filterTiltShift.path}"/></svg>`

/**
 * CSS `cursor` value for the picker tool: the tool's icon, drawn translucent, with its hotspot
 * on the center dot.
 */
export const PICKER_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${CURSOR_HOTSPOT} ${CURSOR_HOTSPOT}, crosshair`
