import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* ---------- Lenis smooth scroll + GSAP sync ---------- */
function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => { lenis.raf(time * 1000) }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(raf); lenis.destroy() }
  }, [])
}

/* ---------- Kinetic split-text: words rise with scroll (corrected) ---------- */
const SplitWords = ({ text, className = '', as: Tag = 'h2' }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] })
  const words = text.split(' ')
  // Precompute per-word springys (ok most: map over constant array of springs)
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => {
        const y = useTransform(scrollYProgress, [(i) / words.length, (i + 1.2) / words.length], ['115%', '0%'], { clamp: true })
        return (
          <span key={i} className="word-mask" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '.1em' }}>
            <motion.span style={{ display: 'inline-block', y, willChange: 'transform' }}>{w}</motion.span>
            {'\u00A0'}
          </span>
        )
      })}
    </Tag>
  )
}

/* ---------- Magnetic wrapper ---------- */
const Magnetic = ({ children, strength = 0.35 }) => {
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current
    const r = el.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * strength
    const y = (e.clientY - (r.top + r.height / 2)) * strength
    el.style.transform = `translate(${x}px, ${y}px)`
  }
  const onLeave = () => { if (ref.current) ref.current.style.transform = 'translate(0,0)' }
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ transition: 'transform .4s cubic-bezier(.22,1,.36,1)' }}>
      {children}
    </motion.div>
  )
}

/* ---------- Scroll-scrubbed pinned hero visual ---------- */
const PinnedShowcase = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.4])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.2])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -8])
  const bigText = useTransform(scrollYProgress, [0, 1], ['0%', '-60%'])
  return (
    <section ref={ref} className="pinned" id="showcase" style={{ height: '220vh', position: 'relative' }}>
      <div className="pinned-sticky" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <motion.div className="pinned-bg" style={{ scale, y, opacity, rotate, position: 'absolute', inset: '-10%' }}>
          <div className="pinned-grid" />
        </motion.div>
        <motion.h2 className="pinned-word" style={{ y: bigText, position: 'absolute', bottom: '8%', fontSize: 'clamp(60px, 18vw, 260px)', fontFamily: "'Space Grotesk'", fontWeight: 700, letterSpacing: '-.03em', color: 'transparent', WebkitTextStroke: '1.5px rgba(244,244,245,.28)', whiteSpace: 'nowrap' }}>
          KINETIQ®
        </motion.h2>
        <motion.div style={{ position: 'absolute', bottom: '30%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', opacity }}>
          <span className="chip">Scroll to experience — 220vh of pinned motion</span>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------- Section reveal wrapper ---------- */
const Reveal = ({ children }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 60%'] })
  const y = useTransform(scrollYProgress, [0, 1], [50, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1])
  return <motion.div ref={ref} style={{ y, opacity }}>{children}</motion.div>
}

/* ---------- Header ---------- */
const Header = () => {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#" className="logo">Kinetiq<span>®</span></a>
        <nav>
          <a href="#showcase">Studio</a>
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <Magnetic><motion.a href="#contact" whileHover={{ scale: 1.04 }} className="btn-cta">Start a project</motion.a></Magnetic>
        </nav>
      </div>
    </header>
  )
}

/* ---------- Hero ---------- */
const Hero = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  return (
    <section ref={ref} className="hero" style={{ position: 'relative', height: '100vh', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
      <motion.div style={{ y: heroY, opacity: heroOpacity, textAlign: 'center' }}>
        <motion.p className="kicker" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          Editorial motion studio — est. 2019
        </motion.p>
        <h1>
          <motion.span className="hero-word" style={{ display: 'inline-block' }} initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}>We</motion.span>{' '}
          <motion.span className="hero-word" style={{ display: 'inline-block' }} initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}>make</motion.span>{' '}
          <motion.span className="hero-word accent" style={{ display: 'inline-block' }} initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}>type</motion.span>{' '}
          <motion.span className="hero-word" style={{ display: 'inline-block' }} initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}>move.</motion.span>
        </h1>
        <motion.div className="hero-ctas" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          <Magnetic><motion.a href="#contact" whileHover={{ scale: 1.06 }} className="btn-primary">Book a free call</motion.a></Magnetic>
          <Magnetic><motion.a href="#work" whileHover={{ scale: 1.06 }} className="btn-ghost">See our work</motion.a></Magnetic>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ---------- Marquee ---------- */
const Marquee = ({ items }) => (
  <div className="marquee">
    <div className="marquee-track">
      {[...items, ...items, ...items].map((item, i) => (
        <div className="marquee-item" key={i}>{item} <span>✦</span></div>
      ))}
    </div>
  </div>
)

/* ---------- Stats ---------- */
const Stats = () => {
  const ref = useRef(null)
  const stats = [
    { n: '120+', l: 'Brand projects' },
    { n: '14', l: 'Years of craft' },
    { n: '9', l: 'Design awards' },
    { n: '4.9', l: 'Client rating' },
  ]
  return (
    <motion.section ref={ref} className="stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 40 }}>
      {stats.map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
          <div className="stat-n">{s.n}</div>
          <div className="stat-l">{s.l}</div>
        </motion.div>
      ))}
    </motion.section>
  )
}

/* ---------- Services ---------- */
const SERVICES = [
  { num: '01', title: 'Brand identity', desc: 'Logos, type systems and the visual language that makes your brand unmistakable.', price: 'from €2,900' },
  { num: '02', title: 'Editorial websites', desc: 'Kinetic, narrative-driven sites built on type. Conversions that feel like art.', price: 'from €4,500' },
  { num: '03', title: 'Motion identity', desc: 'Logo animations, kinetic type and micro-motion that make your brand alive.', price: 'from €1,800' },
  { num: '04', title: 'Campaigns', desc: 'Launch sites and microsites with a cinematic story written in type.', price: 'from €3,400' },
]
const Services = () => (
  <section className="services" id="services" style={{ padding: '120px 0' }}>
    <div className="wrap">
      <Reveal><SplitWords text="What we make." className="sec-title" /></Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 22, marginTop: 56 }}>
        {SERVICES.map((s, i) => (
          <motion.div key={i} className="service-card" whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300 } }} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <div className="num">{s.num}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <span className="price">{s.price}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

/* ---------- Work ---------- */
const WORK = [
  { title: 'The Weight of Words', tag: 'Brand · 2026', desc: 'Variable font family where every headline shifts 400→900 on hover.' },
  { title: 'Outlined & Alive', tag: 'Editorial · 2026', desc: 'Full-bleed stroke type revealed word-by-word for a fashion house.' },
  { title: 'Infinite Ticker', tag: 'Web · 2025', desc: 'Marquee editorial bands threading a museum digital exhibition.' },
  { title: 'Letter Reveal', tag: 'Identity · 2025', desc: 'A global launch site where the logotype rises out of clipped masks.' },
]
const Work = () => (
  <section className="work" id="work">
    <div className="wrap">
      <Reveal><SplitWords text="Selected work." className="sec-title" /></Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 22, marginTop: 56 }}>
        {WORK.map((p, i) => (
          <motion.a href="#contact" key={i} className="work-card" whileHover={{ y: -6 }} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 2) * 0.1, duration: 0.6 }}>
            <div className="work-thumb">{p.title.split(' ')[0].toUpperCase()}</div>
            <div style={{ padding: 26 }}>
              <div className="tag">{p.tag}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
            <ArrowUpRight className="work-arrow" />
          </motion.a>
        ))}
      </div>
    </div>
  </section>
)

/* ---------- Process ---------- */
const PROCESS = [
  { num: '01', t: 'Discover', d: 'Map your story, audience and goals before a single pixel.' },
  { num: '02', t: 'Design', d: 'Moodboards, type directions, a clear visual route.' },
  { num: '03', t: 'Build', d: 'Kinetic sites, motion and polished delivery in short sprints.' },
  { num: '04', t: 'Launch', d: 'Go live, monitor, iterate. Zero downtime, full support.' },
]
const Process = () => (
  <section className="process" id="process">
    <div className="wrap">
      <Reveal><SplitWords text="How we work." className="sec-title" /></Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 20, marginTop: 56 }}>
        {PROCESS.map((s, i) => (
          <motion.div key={i} className="process-step" whileHover={{ y: -6 }} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}>
            <div className="step-num">{s.num}</div>
            <h4>{s.t}</h4>
            <p>{s.d}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

/* ---------- Quotes ---------- */
const QUOTES = [
  { q: 'Kinetiq rebuilt our entire brand. The kinetic headlines stopped scrolls cold — engagement numbers have never been better.', n: 'Laura R.', r: 'CMO, Rowen Publishing' },
  { q: 'They told our story in type. Our launch site felt like a film you could scroll. Clients actually mention it.', n: 'David S.', r: 'Founder, Stride Studio' },
  { q: 'Fast, communicative, world-class craft. Fixed price, delivered early.', n: 'Anna C.', r: 'Director, Femme Collective' },
]
const Quotes = () => (
  <section className="quotes">
    <div className="wrap">
      <Reveal><SplitWords text="Client love." className="sec-title" /></Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 22, marginTop: 56 }}>
        {QUOTES.map((q, i) => (
          <motion.figure key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
            <div className="stars">★★★★★</div>
            <blockquote>{q.q}</blockquote>
            <figcaption><b>{q.n}</b><span>{q.r}</span></figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  </section>
)

/* ---------- CTA ---------- */
const CTA = () => (
  <section className="cta" id="contact">
    <div className="wrap cta-inner">
      <Reveal><SplitWords text="Let's build something unforgettable." className="sec-title" /></Reveal>
      <p style={{ color: 'var(--muted)', maxWidth: 560, margin: '20px auto 0', lineHeight: 1.8 }}>Tell us about your project. We'll reply within one business day with a clear plan and a fixed quote.</p>
      <div style={{ marginTop: 40 }}><Magnetic><motion.a href="mailto:hello@kinetiq.studio" whileHover={{ scale: 1.06 }} className="btn-primary">hello@kinetiq.studio</motion.a></Magnetic></div>
    </div>
  </section>
)

/* ---------- App ---------- */
export default function App() {
  useSmoothScroll()
  return (
    <>
      <Header />
      <Hero />
      <Marquee items={['editorial', 'variable', 'kinetic', 'motion', 'brand']} />
      <Stats />
      <PinnedShowcase />
      <Services />
      <Work />
      <Process />
      <Quotes />
      <CTA />
      <footer className="site-footer">
        <div className="wrap foot-inner"><span>© 2026 Kinetiq Studio — editorial motion.</span><span><a href="#">Instagram</a> · <a href="#">Behance</a> · <a href="mailto:hello@kinetiq.studio">Email</a></span></div>
      </footer>
    </>
  )
}
