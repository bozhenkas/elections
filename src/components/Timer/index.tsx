import { useState, useEffect } from 'react'
import { useI18n } from '../../stores/i18n'
import './Timer.css'

type TimerProps = {
  targetDate: Date
}

export default function Timer({ targetDate }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate))
  const { t } = useI18n()

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="timer">
      <div className="timer__digits">
        <span className="timer__num">{pad(timeLeft.hours)}</span>
        <span className="timer__sep">:</span>
        <span className="timer__num">{pad(timeLeft.minutes)}</span>
        <span className="timer__sep">:</span>
        <span className="timer__num">{pad(timeLeft.seconds)}</span>
      </div>
      <p className="timer__label">{t('timer.label')}</p>
    </div>
  )
}

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    hours: Math.floor(diff / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}
