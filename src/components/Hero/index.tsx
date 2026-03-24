import Tilt from 'react-parallax-tilt'
import { useI18n } from '../../stores/i18n'
import './Hero.css'

export default function Hero() {
  const { t } = useI18n()

  return (
    <section className="hero">
      <Tilt
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        perspective={800}
        glareEnable={false}
        transitionSpeed={600}
        scale={1.02}
        className="hero__tilt"
      >
        <img src={t('hero.logo')} alt="Elections" className="hero__logo" />
      </Tilt>
    </section>
  )
}
