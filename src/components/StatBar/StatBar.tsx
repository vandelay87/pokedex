import type { FC } from 'react'

interface StatBarProps {
  label: string
  value: number
  maxValue?: number
}

export const StatBar: FC<StatBarProps> = ({ label, value, maxValue = 255 }) => {
  const percentage = Math.min((value / maxValue) * 100, 100)

  return (
    <div
      role="progressbar"
      aria-label={`${label}: ${value} out of ${maxValue}`}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={maxValue}
    >
      <span>{label}</span>
      <span>{value}</span>
      <div>
        <div style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
