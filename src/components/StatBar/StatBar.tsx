import type { CSSProperties, FC } from 'react'
import styles from './StatBar.module.css'

interface StatBarProps {
  label: string
  value: number
  maxValue?: number
  index?: number
}

const getStatColor = (value: number, maxValue: number): string => {
  const ratio = value / maxValue
  if (ratio < 0.3) return 'var(--color-stat-low)'
  if (ratio < 0.6) return 'var(--color-stat-mid)'
  return 'var(--color-stat-high)'
}

export const StatBar: FC<StatBarProps> = ({
  label,
  value,
  maxValue = 255,
  index = 0,
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100)

  return (
    <div
      className={styles.row}
      role="progressbar"
      aria-label={`${label}: ${value} out of ${maxValue}`}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={maxValue}
    >
      <div className={styles.labelRow}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
      </div>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={
            {
              '--stat-width': `${percentage}%`,
              '--stat-index': String(index),
              backgroundColor: getStatColor(value, maxValue),
            } as CSSProperties
          }
        />
      </div>
    </div>
  )
}
