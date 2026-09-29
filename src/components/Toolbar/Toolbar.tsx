import { Icon } from '../Icon/Icon'
import type { IconName } from '../Icon/icons'
import styles from './Toolbar.module.css'

const ICON_SIZE = 56

interface ToolbarItem {
  icon: IconName
  label: string
}

/** Formatting controls are visual-only, as in the prototype. */
const FORMATTING_GROUPS: readonly (readonly ToolbarItem[])[] = [
  [
    { icon: 'formatBold', label: 'Bold' },
    { icon: 'formatItalic', label: 'Italic' },
    { icon: 'formatUnderlined', label: 'Underline' },
  ],
  [
    { icon: 'formatListBulleted', label: 'Bulleted list' },
    { icon: 'formatListNumbered', label: 'Numbered list' },
  ],
  [
    { icon: 'formatColorText', label: 'Text color' },
    { icon: 'formatSize', label: 'Text size' },
  ],
]

interface ToolbarProps {
  pickerActive: boolean
  onTogglePicker: () => void
  dimmed: boolean
}

export function Toolbar({ pickerActive, onTogglePicker, dimmed }: ToolbarProps) {
  return (
    <div
      className={styles.toolbar}
      role="toolbar"
      aria-label="Formatting"
      data-dimmed={dimmed || undefined}
    >
      {FORMATTING_GROUPS.map((group) => (
        <div key={group[0]?.icon} className={styles.group} role="group">
          {group.map(({ icon, label }) => (
            <button
              key={icon}
              type="button"
              className={styles.button}
              aria-label={label}
              aria-disabled="true"
            >
              <Icon name={icon} size={ICON_SIZE} />
            </button>
          ))}
        </div>
      ))}
      <button
        type="button"
        className={styles.button}
        aria-label="Emotion word picker"
        aria-pressed={pickerActive}
        onClick={onTogglePicker}
      >
        <Icon name="filterTiltShift" size={ICON_SIZE} />
      </button>
    </div>
  )
}
