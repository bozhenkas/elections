import './Badge.css'

type BadgeProps = {
  children: React.ReactNode
  variant?: 'pink' | 'outline' | 'outline-pink'
}

export default function Badge({ children, variant = 'outline' }: BadgeProps) {
  return (
    <span className={`badge badge--${variant}`}>
      {children}
    </span>
  )
}
